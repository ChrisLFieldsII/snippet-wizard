import {
  ServiceTag,
  SnippetMap,
  SnippetMutationResponse,
  SnippetManagerDeleteInput,
  CreateSnippetResponse,
  SnippetManagerCreateInput,
  DeleteSnippetResponse,
  SnippetManagerUpdateInput,
  UpdateSnippetResponse,
  ISnippetPluginManager,
  GetSnippetsInput,
} from 'src/types'

import { getKeys } from '../utils/general.utils'

import { githubSnippetPlugin } from './github.plugin'
import { gitlabSnippetPlugin } from './gitlab.plugin'
import { SnippetPlugin } from './plugin'

/** THE PLUGIN MANGER */

export class SnippetPluginManager implements ISnippetPluginManager {
  private tags: ServiceTag[] = []
  private plugins: SnippetPlugin[] = []

  constructor(plugins: SnippetPlugin[]) {
    this.tags = plugins.map((p) => p.getTag())
    this.plugins = plugins
  }

  async getSnippets(input: GetSnippetsInput): Promise<SnippetMap> {
    const promises = await this.plugins.map((plugin) =>
      plugin.getSnippets(input),
    )
    // TODO: improve with allSettled
    const snippets = await Promise.all(promises)
    const snippetMap = this.tags.reduce((accum, tag, index) => {
      return {
        ...accum,
        [tag]: snippets[index],
      }
    }, {} as SnippetMap)
    console.log('plugin manager snippet map', snippetMap)

    return snippetMap
  }

  async createSnippet({
    services: tags,
    input,
  }: SnippetManagerCreateInput): Promise<
    Record<ServiceTag, CreateSnippetResponse>
  > {
    const promises = await this.plugins
      .filter((plugin) => tags.includes(plugin.getTag()))
      .map((plugin) => plugin.createSnippet(input))

    // TODO: improve with allSettled
    const responses = await Promise.all(promises)

    const map = this.tags.reduce((accum, tag, index) => {
      return {
        ...accum,
        [tag]: responses[index],
      }
    }, {} as Record<ServiceTag, CreateSnippetResponse>)

    return map
  }

  async deleteSnippet({
    services,
  }: SnippetManagerDeleteInput): Promise<
    Record<ServiceTag, SnippetMutationResponse<DeleteSnippetResponse>>
  > {
    const tags = getKeys(services)
    const promises = await this.plugins
      .filter((plugin) => tags.includes(plugin.getTag()))
      .map((plugin) =>
        plugin.deleteSnippet({ id: services[plugin.getTag()].id }),
      )
    // TODO: improve with allSettled
    const responses = await Promise.all(promises)

    const map = this.tags.reduce((accum, tag, index) => {
      return {
        ...accum,
        [tag]: responses[index],
      }
    }, {} as Record<ServiceTag, SnippetMutationResponse<DeleteSnippetResponse>>)

    return map
  }

  async updateSnippet({
    services,
    input,
  }: SnippetManagerUpdateInput): Promise<
    Record<ServiceTag, UpdateSnippetResponse>
  > {
    const tags = getKeys(services)
    const promises = await this.plugins
      .filter((plugin) => tags.includes(plugin.getTag()))
      .map((plugin) =>
        plugin.updateSnippet({
          ...input,
          id: services[plugin.getTag()].id,
        }),
      )

    // TODO: improve with allSettled
    const responses = await Promise.all(promises)

    const map = this.tags.reduce((accum, tag, index) => {
      return {
        ...accum,
        [tag]: responses[index],
      }
    }, {} as Record<ServiceTag, UpdateSnippetResponse>)

    return map
  }
}

export const snippetPluginManager = new SnippetPluginManager([
  githubSnippetPlugin,
  gitlabSnippetPlugin,
])
