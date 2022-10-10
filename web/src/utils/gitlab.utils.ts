import {
  SnippetMutationResponse,
  ServiceTag,
  Snippet,
  SnippetMutationInput,
  CreateSnippetResponse,
  CreateSnippetInput,
} from 'src/types'

import { SnippetPlugin } from './plugin.utils'

const API_URL = 'https://gitlab.com/api/v4'
class GitLabSnippetPlugin extends SnippetPlugin {
  async createSnippet(
    input: CreateSnippetInput
  ): Promise<CreateSnippetResponse> {
    if (!this.isEnabled()) {
      return {
        isSuccess: false,
        service: this.getTag(),
      }
    }

    const { contents, description, filename, privacy, title } = input

    try {
      const res = (await fetch(`${API_URL}/snippets`, {
        method: 'POST',
        headers: {
          ...this.getHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          visibility: privacy,
          files: [
            {
              content: contents,
              file_path: filename,
            },
          ],
        }),
      }).then((res) => res.json())) as GitLabSnippet

      console.log('gitlab create res', res)

      if (!res.id) {
        throw new Error('Failed to create gitlab snippet')
      }

      return {
        isSuccess: true,
        service: this.getTag(),
        snippet: await this.transformSnippet(res),
      }
    } catch (error) {
      return {
        isSuccess: false,
        service: this.getTag(),
      }
    }
  }

  async deleteSnippet({
    id,
  }: SnippetMutationInput): Promise<SnippetMutationResponse> {
    if (!this.isEnabled()) {
      return {
        isSuccess: false,
        service: this.getTag(),
      }
    }

    let isSuccess = false

    try {
      const res = await fetch(`${API_URL}/snippets/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      })

      if (res.status !== 204) {
        throw new Error('Failed to delete snippet')
      }

      isSuccess = true
    } catch (error) {
      console.error(this.getTag(), 'failed to delete snippet: ' + id)
    }

    return {
      isSuccess,
      service: 'gitlab',
    }
  }
  updateSnippet(input: SnippetMutationInput): Promise<Snippet | null> {
    console.error('Method not implemented.' + this.getTag(), input)
    return null
  }

  async getSnippets(): Promise<Snippet[]> {
    if (!this.isEnabled()) {
      return []
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
      service: 'gitlab',
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
