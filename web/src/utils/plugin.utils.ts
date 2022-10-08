import {
  SnippetPlugin,
  Snippet,
  SnippetMutationInput,
  ServiceTag,
} from 'src/types'

import { githubSnippetPlugin } from './github.utils'
import { gitlabSnippetPlugin } from './gitlab.utils'
import { getKeys } from './utils.utils'

type SnippetMap = Record<ServiceTag, Snippet>

interface ISnippetPluginManager {
  getSnippets(): Promise<SnippetMap>
  createSnippet(input: SnippetMutationInput): Promise<SnippetMap>
  deleteSnippet(input: SnippetMutationInput): Promise<SnippetMap>
  updateSnippet(input: SnippetMutationInput): Promise<SnippetMap>
}

class SnippetPluginManager implements ISnippetPluginManager {
  private tags: ServiceTag[] = []
  private plugins: SnippetPlugin[] = []
  constructor(plugins: SnippetPlugin[]) {
    this.tags = getKeys<ServiceTag>(plugins)
    this.plugins = plugins
  }
  async getSnippets(): Promise<SnippetMap> {
    const promises = await this.plugins.map((plugin) => plugin.getSnippets())
    const snippets = await Promise.all(promises)
    console.log(snippets)
    return this.tags.reduce((accum, tag, index) => {
      return {
        ...accum,
        [tag]: snippets[index],
      }
    }, {} as SnippetMap)
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

export const snippetPluginManager = new SnippetPluginManager([
  githubSnippetPlugin,
  gitlabSnippetPlugin,
])
