/** tag for a snippet service */
export type ServiceTag = 'gitlab' | 'github'

export type ServiceState = {
  token: string
}

export type ServicesMap = Record<ServiceTag, ServiceState>

export type SnippetMutationInput = {
  id: string
}

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
  servicesMap: Partial<Record<ServiceTag, { url: string; id: string }>>
  isPublic: boolean
  /** contents clipped to 10 LOC for quick display */
  contentsShort: string
  hasMoreContentsToDisplay: boolean
}

/** delete input for snippet manager */
export type SnippetManagerDeleteInput = {
  /** input is a map of the service to the snippet id to delete */
  services: Partial<Record<ServiceTag, { id: string }>>
}

export type SnippetManagerCreateInput = {
  /** the services want to create snippet for */
  services: ServiceTag[]
  input: CreateSnippetInput
}

export type SnippetManagerUpdateInput = {
  /** the services want to update snippet for */
  services: Partial<Record<ServiceTag, { id: string }>>
  input: Omit<UpdateSnippetInput, 'id'>
}

export interface ISnippetPlugin {
  tag: ServiceTag
  getSnippets(input: GetSnippetsInput): Promise<Snippet[]>
  createSnippet(input: CreateSnippetInput): Promise<CreateSnippetResponse>
  deleteSnippet(
    input: SnippetMutationInput
  ): Promise<SnippetMutationResponse<DeleteSnippetResponse>>
  updateSnippet(input: UpdateSnippetInput): Promise<UpdateSnippetResponse>
  transformSnippet(rawSnippet: unknown): Promise<Snippet>
  isEnabled(): boolean
  getToken(): string
  getTag(): ServiceTag
}

export type SnippetMap = Record<ServiceTag, Snippet[]>

export type DeleteSnippetResponse = {
  id: string
}

export type SnippetMutationResponse<Data = unknown> = {
  isSuccess: boolean
  data?: Data
}

// #region CREATE SNIPPET
export type CreateSnippetInput = {
  privacy: SnippetPrivacy
  title: string
  description: string
  /** actual snippet text */
  contents: string
  filename: string
}

export type CreateSnippetResponse = SnippetMutationResponse<{
  snippet?: Snippet
}>
// #region CREATE SNIPPET

// #region UPDATE SNIPPET
export type UpdateSnippetInput = {
  id: string
  privacy: SnippetPrivacy
  title: string
  description: string
  /** actual snippet text */
  contents: string
  oldFilename: string
  newFilename: string
}

export type UpdateSnippetResponse = SnippetMutationResponse<{
  snippet?: Snippet
}>
// #endregion UPDATE SNIPPET

// #region GET SNIPPET
export type GetSnippetsInput = {
  page?: number
  perPage?: number
}
// #endregion GET SNIPPET

export interface ISnippetPluginManager {
  // TODO: define input
  getSnippets(input: GetSnippetsInput): Promise<SnippetMap>
  createSnippet(
    input: SnippetManagerCreateInput
  ): Promise<Record<ServiceTag, CreateSnippetResponse>>
  /**
   * @input Takes in a map of services to the snippet id to delete.
   * @returns a map of services to success response
   */
  deleteSnippet(
    input: SnippetManagerDeleteInput
  ): Promise<
    Partial<Record<ServiceTag, SnippetMutationResponse<DeleteSnippetResponse>>>
  >
  updateSnippet(
    input: SnippetManagerUpdateInput
  ): Promise<Record<ServiceTag, UpdateSnippetResponse>>
}
