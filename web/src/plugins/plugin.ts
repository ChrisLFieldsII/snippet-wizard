import { useStore as store } from 'src/state'

import {
  SnippetMutationInput,
  ServiceTag,
  ISnippetPlugin,
  Snippet,
  SnippetMutationResponse,
  CreateSnippetInput,
  CreateSnippetResponse,
  DeleteSnippetResponse,
  UpdateSnippetResponse,
  UpdateSnippetInput,
  GetSnippetsInput,
} from '~/types'

export abstract class SnippetPlugin implements ISnippetPlugin {
  public readonly tag: ServiceTag

  constructor(tag: ServiceTag) {
    this.tag = tag
  }

  abstract getSnippets(input: GetSnippetsInput): Promise<Snippet[]>

  abstract createSnippet(
    input: CreateSnippetInput,
  ): Promise<CreateSnippetResponse>

  abstract deleteSnippet(
    input: SnippetMutationInput,
  ): Promise<SnippetMutationResponse<DeleteSnippetResponse>>

  abstract updateSnippet(
    input: UpdateSnippetInput,
  ): Promise<UpdateSnippetResponse>

  abstract transformSnippet(rawSnippet: unknown): Promise<Snippet>

  isEnabled(): boolean {
    const isEnabled = !!this.getServiceConfig().token.length
    if (!isEnabled) {
      console.warn(`${this.tag} is not enabled`)
    }
    return isEnabled
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
