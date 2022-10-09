import { useStore as store } from 'src/state'

import {
  SnippetMutationInput,
  ServiceTag,
  SnippetMap,
  ISnippetPlugin,
  Snippet,
} from '~/types'

interface ISnippetPluginManager {
  getSnippets(): Promise<SnippetMap>
  createSnippet(input: SnippetMutationInput): Promise<SnippetMap>
  deleteSnippet(input: SnippetMutationInput): Promise<SnippetMap>
  updateSnippet(input: SnippetMutationInput): Promise<SnippetMap>
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

export class SnippetPluginManager implements ISnippetPluginManager {
  private tags: ServiceTag[] = []
  private plugins: SnippetPlugin[] = []

  constructor(plugins: SnippetPlugin[]) {
    this.tags = plugins.map((p) => p.getTag())
    this.plugins = plugins
  }

  async getSnippets(): Promise<SnippetMap> {
    const promises = await this.plugins.map((plugin) => plugin.getSnippets())
    const snippets = await Promise.all(promises)
    const snippetMap = this.tags.reduce((accum, tag, index) => {
      return {
        ...accum,
        [tag]: snippets[index] || [],
      }
    }, {} as SnippetMap)
    console.log(snippetMap)

    return snippetMap
  }

  createSnippet(input: SnippetMutationInput): Promise<SnippetMap> {
    throw new Error('Method not implemented.')
  }
  deleteSnippet(input: SnippetMutationInput): Promise<SnippetMap> {
    throw new Error('Method not implemented.')
  }
  updateSnippet(input: SnippetMutationInput): Promise<SnippetMap> {
    throw new Error('Method not implemented.')
  }
}
