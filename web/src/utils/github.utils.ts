import { request } from '@octokit/request'

import {
  SnippetMutationResponse,
  Snippet,
  SnippetMutationInput,
  CreateSnippetInput,
  CreateSnippetResponse,
  DeleteSnippetResponse,
  UpdateSnippetInput,
  UpdateSnippetResponse,
} from 'src/types'

import { getKeys } from './general.utils'
import { SnippetPlugin } from './plugin.utils'

class GitHubSnippetPlugin extends SnippetPlugin {
  async createSnippet(
    input: CreateSnippetInput
  ): Promise<CreateSnippetResponse> {
    if (!this.isEnabled()) {
      return {
        isSuccess: false,
      }
    }

    // gist doesnt have title, use description field as title
    const { contents, title: description, filename, privacy } = input

    try {
      const rawSnippet = await request('POST /gists', {
        description,
        public: privacy === 'public',
        files: {
          [filename]: {
            content: contents,
          },
        },
        headers: this.getHeaders(),
      })

      return {
        isSuccess: true,
        data: {
          snippet: await this.transformSnippet(
            rawSnippet.data as GitHubSnippet
          ),
        },
      }
    } catch (error) {
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
      await request('DELETE /gists/{gist_id}', {
        gist_id: id,
        headers: this.getHeaders(),
      })
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

    // gist doesnt have title, use description field as title
    const { contents, title: description, id, newFilename, oldFilename } = input

    // github doesnt seem to let you update privacy

    try {
      const res = await request('PATCH /gists/{gist_id}', {
        gist_id: id,
        description,
        files: {
          [oldFilename]: {
            filename: newFilename,
            content: contents,
          },
        },
        headers: this.getHeaders(),
      })
      return {
        isSuccess: true,
        data: {
          snippet: await this.transformSnippet(res.data as GitHubSnippet),
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
      const rawSnippets = await request('GET /gists', {
        headers: this.getHeaders(),
        per_page: 5, // TODO: this is temp while testing
      })
      return Promise.all(
        rawSnippets.data.map((rawSnippet) => this.transformSnippet(rawSnippet))
      )
    } catch (error) {
      console.error(this.tag, 'failed to get snippets')
      return []
    }
  }

  async transformSnippet(rawSnippet: GitHubSnippet): Promise<Snippet> {
    return {
      createdAt: new Date(rawSnippet.created_at),
      updatedAt: new Date(rawSnippet.updated_at),
      contents: await (async () => {
        // return contents if rawSnippet already contains it (from update/create)
        const filename = getKeys(rawSnippet.files)[0] as string
        const contents = rawSnippet.files[filename].content
        if (contents) return contents

        return await request('GET /gists/{gist_id}', {
          gist_id: rawSnippet.id,
          headers: this.getHeaders(),
        }).then((res) => {
          const filename = Object.keys(res.data.files)[0]
          return res.data.files[filename].content
        })
      })(),
      description: '',
      // NOTE: only supporting one file per gist currently
      filename: Object.keys(rawSnippet.files)[0],
      id: rawSnippet.id,
      privacy: rawSnippet.public ? 'public' : 'private',
      // gist dont have title, use description
      title: rawSnippet.description,
      url: rawSnippet.html_url,
      service: 'github',
    }
  }

  private getHeaders() {
    return {
      authorization: `token ${this.getToken()}`,
    }
  }
}

export const githubSnippetPlugin = new GitHubSnippetPlugin('github')

export type GitHubSnippet = {
  url: string
  forks_url: string
  commits_url: string
  id: string
  node_id: string
  git_pull_url: string
  git_push_url: string
  html_url: string
  files: {
    [key: string]: {
      filename?: string
      type?: string
      language?: string
      raw_url?: string
      size?: number
      truncated?: boolean
      content?: string
    }
  }
  public: boolean
  created_at: string
  updated_at: string
  description: string
  comments: number
  user: any
  comments_url: string
  owner?: {
    login: string
    id: number
    node_id: string
    avatar_url: string
    gravatar_id: string
    url: string
    html_url: string
    followers_url: string
    following_url: string
    gists_url: string
    starred_url: string
    subscriptions_url: string
    organizations_url: string
    repos_url: string
    events_url: string
    received_events_url: string
    type: string
    site_admin: boolean
  }
  truncated?: boolean
  forks?: any[]
  history?: any[]
}
