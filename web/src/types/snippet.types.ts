/** tag for a snippet service */
export type ServiceTag = 'gitlab' | 'github'

export type ServiceState = {
  token: string
}

export type ServicesMap = Record<ServiceTag, ServiceState>

export type SnippetMutationInput = {}

export type SnippetPrivacy = 'public' | 'private'

export type Snippet = {
  id: string
  url: string
  privacy: SnippetPrivacy
  title: string
  description: string
  /** actual snippet text */
  contents: string
  createdAt: Date
  updatedAt: Date
  filename: string
  service: ServiceTag
}

/** Snippet shown in UI */
export type UISnippet = Omit<Snippet, 'service' | 'url'> & {
  /** the services the snippet is in */
  services: ServiceTag[]
  servicesMap: Record<ServiceTag, { url: string }>
  isPublic: boolean
}

export interface ISnippetPlugin {
  getSnippets(): Promise<Snippet[] | null>
  createSnippet(input: SnippetMutationInput): Promise<Snippet | null>
  deleteSnippet(input: SnippetMutationInput): Promise<boolean>
  updateSnippet(input: SnippetMutationInput): Promise<Snippet | null>
  transformSnippet(rawSnippet: unknown): Promise<Snippet>
  isEnabled(): boolean
  getToken(): string
  getTag(): ServiceTag
}

export type SnippetMap = Record<ServiceTag, Snippet[]>
