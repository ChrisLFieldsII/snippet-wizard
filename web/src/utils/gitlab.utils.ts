import axios from 'axios'

import {
  SnippetMutationResponse,
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
        service: this.tag,
      }
    }

    const { contents, description, filename, privacy, title } = input

    try {
      const res = await axios.post<GitLabSnippet>(
        `${API_URL}/snippets`,
        {
          title,
          description,
          visibility: privacy,
          files: [
            {
              content: contents,
              file_path: filename,
            },
          ],
        },
        {
          headers: {
            ...this.getHeaders(),
            'Content-Type': 'application/json',
          },
        }
      )

      console.log('gitlab create res', res)

      if (!res.data.id) {
        throw new Error('Failed to create gitlab snippet')
      }

      return {
        isSuccess: true,
        service: this.tag,
        snippet: await this.transformSnippet(res.data),
      }
    } catch (error) {
      console.error(error)
      return {
        isSuccess: false,
        service: this.tag,
      }
    }
  }

  async deleteSnippet({
    id,
  }: SnippetMutationInput): Promise<SnippetMutationResponse> {
    if (!this.isEnabled()) {
      return {
        isSuccess: false,
        service: this.tag,
      }
    }

    let isSuccess = false

    try {
      const res = await axios.delete(`${API_URL}/snippets/${id}`, {
        headers: this.getHeaders(),
      })

      if (res.status !== 204) {
        throw new Error('Failed to delete snippet')
      }

      isSuccess = true
    } catch (error) {
      console.error(this.tag, 'failed to delete snippet: ' + id)
    }

    return {
      isSuccess,
      service: 'gitlab',
    }
  }
  updateSnippet(input: SnippetMutationInput): Promise<Snippet | null> {
    console.error('Method not implemented.' + this.tag, input)
    return null
  }

  async getSnippets(): Promise<Snippet[]> {
    if (!this.isEnabled()) {
      return []
    }

    const rawSnippets = await axios.get<GitLabSnippet[]>(
      `${API_URL}/snippets`,
      {
        headers: this.getHeaders(),
      }
    )
    return Promise.all(
      rawSnippets.data.map((rawSnippet) => this.transformSnippet(rawSnippet))
    )
  }

  async transformSnippet(rawSnippet: GitLabSnippet): Promise<Snippet> {
    return {
      createdAt: new Date(rawSnippet.created_at),
      updatedAt: new Date(rawSnippet.updated_at),
      contents: await (async () => {
        return await axios
          .get<string>(`${API_URL}/snippets/${rawSnippet.id}/raw`, {
            headers: this.getHeaders(),
            responseType: 'text',
          })
          .then((res) => res.data)
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
    return {
      'PRIVATE-TOKEN': token,
    }
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
