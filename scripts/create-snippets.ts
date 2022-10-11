import { useStore as store } from 'web/src/state'
import { SnippetManagerCreateInput } from 'web/src/types'
import { snippetPluginManager } from 'web/src/utils/pluginManager.utils'

/*
  Script to create simple snippet in services.
  Set PATs in .env
*/

const input: SnippetManagerCreateInput = {
  input: {
    contents: `echo "hello world"`,
    title: 'Echo hello world in bash',
    description:
      'An example of how to echo hello world in bash (created by script)',
    filename: 'example.sh',
    privacy: 'public',
  },
  services: ['github', 'gitlab'],
}

export default async () => {
  store.getState().setToken('github', process.env.GITHUB_PAT)
  store.getState().setToken('gitlab', process.env.GITLAB_PAT)
  console.log(store.getState())

  const res = await snippetPluginManager.createSnippet(input)
  console.dir(res, { depth: null })
}
