import { useStore as store } from 'src/state'

import { getKeys } from './utils.utils'

import {
  SnippetMutationInput,
  ServiceTag,
  SnippetMap,
  ISnippetPlugin,
  Snippet,
  SnippetMutationResponse,
  SnippetManagerDeleteInput,
  CreateSnippetInput,
  CreateSnippetResponse,
} from '~/types'

/** THE PLUGIN MANGER */
interface ISnippetPluginManager {
  getSnippets(): Promise<SnippetMap>
  createSnippet(input: SnippetMutationInput): Promise<SnippetMap>
  deleteSnippet(
    input: SnippetManagerDeleteInput
  ): Promise<Record<ServiceTag, SnippetMutationResponse>>
  updateSnippet(input: SnippetMutationInput): Promise<SnippetMap>
}

export abstract class SnippetPlugin implements ISnippetPlugin {
  public readonly tag: ServiceTag
  constructor(tag: ServiceTag) {
    this.tag = tag
  }
  abstract getSnippets(): Promise<Snippet[]>
  abstract createSnippet(
    input: CreateSnippetInput
  ): Promise<CreateSnippetResponse>
  abstract deleteSnippet(
    input: SnippetMutationInput
  ): Promise<SnippetMutationResponse>
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

export class SnippetPluginManager implements ISnippetPluginManager {
  private tags: ServiceTag[] = []
  private plugins: SnippetPlugin[] = []

  constructor(plugins: SnippetPlugin[]) {
    this.tags = plugins.map((p) => p.getTag())
    this.plugins = plugins
  }

  async getSnippets(): Promise<SnippetMap> {
    const promises = await this.plugins.map((plugin) => plugin.getSnippets())
    // TODO: improve with allSettled
    const snippets = await Promise.all(promises)
    const snippetMap = this.tags.reduce((accum, tag, index) => {
      return {
        ...accum,
        [tag]: snippets[index],
      }
    }, {} as SnippetMap)
    console.log(snippetMap)

    return snippetMap
  }

  createSnippet(input: SnippetMutationInput): Promise<SnippetMap> {
    throw new Error('Method not implemented.')
  }

  async deleteSnippet({
    services,
  }: SnippetManagerDeleteInput): Promise<
    Record<ServiceTag, SnippetMutationResponse>
  > {
    const tags = getKeys(services)
    const promises = await this.plugins.map((plugin) =>
      tags.includes(plugin.getTag())
        ? plugin.deleteSnippet({ id: services[plugin.getTag()].id })
        : Promise.resolve({ isSuccess: true, service: plugin.getTag() })
    )
    // TODO: improve with allSettled
    const responses = await Promise.all(promises)

    const map = this.tags.reduce((accum, tag, index) => {
      return {
        ...accum,
        [tag]: responses[index],
      }
    }, {} as Record<ServiceTag, SnippetMutationResponse>)

    return map
  }

  updateSnippet(input: SnippetMutationInput): Promise<SnippetMap> {
    throw new Error('Method not implemented.')
  }
}
