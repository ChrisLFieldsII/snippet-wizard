export * from './github.utils'
export * from './gitlab.utils'
export * from './plugin.utils'
export * from './utils.utils'

import { githubSnippetPlugin } from './github.utils'
import { gitlabSnippetPlugin } from './gitlab.utils'
import { SnippetPluginManager } from './plugin.utils'

export const snippetPluginManager = new SnippetPluginManager([
  githubSnippetPlugin,
  gitlabSnippetPlugin,
])
