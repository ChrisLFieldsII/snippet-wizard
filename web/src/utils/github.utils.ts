import { SnippetPlugin, Snippet, SnippetMutationInput } from 'src/types'

class GitHubSnippetPlugin extends SnippetPlugin {
  createSnippet(input: SnippetMutationInput): Promise<Snippet | null> {
    console.error('Method not implemented.' + this.getTag(), input)
    return null
  }
  deleteSnippet(input: SnippetMutationInput): Promise<boolean> {
    console.error('Method not implemented.' + this.getTag(), input)
    return null
  }
  updateSnippet(input: SnippetMutationInput): Promise<Snippet | null> {
    console.error('Method not implemented.' + this.getTag(), input)
    return null
  }

  async getSnippets(): Promise<Snippet | null> {
    console.error('Method not implemented.' + this.getTag())
    if (!this.isEnabled()) {
      return null
    }

    return null
  }
}

export const githubSnippetPlugin = new GitHubSnippetPlugin('github')
