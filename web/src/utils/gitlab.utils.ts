import axios from 'axios'

import {
  SnippetMutationResponse,
  Snippet,
  SnippetMutationInput,
  CreateSnippetResponse,
  CreateSnippetInput,
  DeleteSnippetResponse,
  UpdateSnippetInput,
  UpdateSnippetResponse,
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

      if (!res.data.id) {
        throw new Error('Failed to create gitlab snippet')
      }

      res.data.contents = contents

      return {
        isSuccess: true,
        data: {
          snippet: await this.transformSnippet(res.data),
        },
      }
    } catch (error) {
      console.error(this.tag, 'failed to create snippet: ' + input)

      return {
        isSuccess: false,
      }
    }
  }

  async deleteSnippet({
    id,
  }: SnippetMutationInput): Promise<
    SnippetMutationResponse<DeleteSnippetResponse>
  > {
    if (!this.isEnabled()) {
      return {
        isSuccess: false,
      }
    }

    try {
      const res = await axios.delete(`${API_URL}/snippets/${id}`, {
        headers: this.getHeaders(),
      })

      if (res.status !== 204) {
        throw new Error('Failed to delete snippet')
      }

      return {
        isSuccess: true,
        data: {
          id,
        },
      }
    } catch (error) {
      console.error(this.tag, 'failed to delete snippet: ' + id)
      return {
        isSuccess: false,
      }
    }
  }
  async updateSnippet(
    input: UpdateSnippetInput
  ): Promise<UpdateSnippetResponse> {
    if (!this.isEnabled()) {
      return {
        isSuccess: false,
      }
    }

    const {
      contents,
      description,
      id,
      newFilename,
      oldFilename,
      privacy,
      title,
    } = input

    try {
      const res = await axios.patch<GitLabSnippet>(
        `${API_URL}/snippets/${id}`,
        {
          title,
          description,
          visibility: privacy,
          files: [
            {
              action: 'update',
              previous_path: oldFilename,
              file_path: newFilename,
              content: contents,
            },
          ],
        }
      )

      res.data.contents = contents

      return {
        isSuccess: true,
        data: {
          snippet: await this.transformSnippet(res.data),
        },
      }
    } catch (error) {
      console.error(this.tag, 'failed to update snippet: ' + input)

      return {
        isSuccess: false,
      }
    }
  }

  async getSnippets(): Promise<Snippet[]> {
    if (!this.isEnabled()) {
      return []
    }

    try {
      const rawSnippets = await axios.get<GitLabSnippet[]>(
        `${API_URL}/snippets?per_page=5`, // TODO: per_page is temp while testing
        {
          headers: this.getHeaders(),
        }
      )
      return Promise.all(
        rawSnippets.data.map((rawSnippet) => this.transformSnippet(rawSnippet))
      )
    } catch (error) {
      console.error(this.tag, 'failed to get snippets')
      return []
    }
  }

  async transformSnippet(rawSnippet: GitLabSnippet): Promise<Snippet> {
    return {
      createdAt: new Date(rawSnippet.created_at),
      updatedAt: new Date(rawSnippet.updated_at),
      contents: await (async () => {
        if (rawSnippet.contents) return rawSnippet.contents

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
  /** added by me to use for transform on create/edit where this is known from the input */
  contents?: string
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
