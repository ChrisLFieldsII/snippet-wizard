import { SnippetPlugin, Snippet, SnippetMutationInput } from 'src/types'

const API_URL = 'https://gitlab.com/api/v4'
class GitLabSnippetPlugin extends SnippetPlugin {
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

  async getSnippets(): Promise<Snippet[] | null> {
    if (!this.isEnabled()) {
      return null
    }

    const rawSnippets = (await fetch(`${API_URL}/snippets`, {
      headers: this.getHeaders(),
    }).then((r) => r.json())) as GitLabSnippet[]
    // console.log(rawSnippets)
    return Promise.all(
      rawSnippets.map((rawSnippet) => this.transformSnippet(rawSnippet))
    )
  }

  async transformSnippet(rawSnippet: GitLabSnippet): Promise<Snippet> {
    return {
      createdAt: new Date(rawSnippet.created_at),
      updatedAt: new Date(rawSnippet.updated_at),
      contents: await (async () => {
        return (
          await fetch(`${API_URL}/snippets/${rawSnippet.id}/raw`, {
            headers: this.getHeaders(),
          })
        ).text()
      })(),
      description: rawSnippet.description,
      filename: rawSnippet.file_name,
      id: rawSnippet.id.toString(),
      privacy: ['private', 'internal'].includes(rawSnippet.visibility)
        ? 'private'
        : 'public',
      title: rawSnippet.title,
      url: rawSnippet.web_url,
    }
  }

  private getHeaders() {
    const token = this.getToken()
    const headers = new Headers()
    headers.set('PRIVATE-TOKEN', token)
    return headers
  }
}

export const gitlabSnippetPlugin = new GitLabSnippetPlugin('gitlab')

export type GitLabSnippet = {
  id: number
  title: string
  description: string
  visibility: string
  author: {
    id: number
    username: string
    email: string
    name: string
    state: string
    created_at: string
  }
  expires_at: any
  updated_at: string
  created_at: string
  project_id: any
  web_url: string
  raw_url: string
  ssh_url_to_repo: string
  http_url_to_repo: string
  file_name: string
  files: Array<{
    path: string
    raw_url: string
  }>
}
