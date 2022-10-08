import { useStore as store } from 'src/state'

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
export type UISnippet = Snippet & {
  /** the services the snippet is in */
  services: ServiceTag[]
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

export abstract class SnippetPlugin implements ISnippetPlugin {
  private tag: ServiceTag
  constructor(tag: ServiceTag) {
    this.tag = tag
  }
  abstract getSnippets(): Promise<Snippet[] | null>
  abstract createSnippet(input: SnippetMutationInput): Promise<Snippet>
  abstract deleteSnippet(input: SnippetMutationInput): Promise<boolean>
  abstract updateSnippet(input: SnippetMutationInput): Promise<Snippet>
  abstract transformSnippet(rawSnippet: unknown): Promise<Snippet>
  isEnabled(): boolean {
    return !!this.getServiceConfig().token.length
  }
  getToken(): string {
    return this.getServiceConfig().token
  }
  getTag(): ServiceTag {
    return this.tag
  }
  private getServiceConfig() {
    return store.getState().services[this.tag]
  }
}

export type SnippetMap = Record<ServiceTag, Snippet[]>
