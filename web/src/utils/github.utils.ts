import { request } from '@octokit/request'

import {
  SnippetMutationResponse,
  ServiceTag,
  Snippet,
  SnippetMutationInput,
  CreateSnippetInput,
  CreateSnippetResponse,
} from 'src/types'

import { SnippetPlugin } from './plugin.utils'

class GitHubSnippetPlugin extends SnippetPlugin {
  async createSnippet(
    input: CreateSnippetInput
  ): Promise<CreateSnippetResponse> {
    const service = this.tag

    if (!this.isEnabled()) {
      return {
        isSuccess: false,
        service,
      }
    }

    const { contents, description, filename, privacy } = input

    try {
      const rawSnippet = await request('POST /gists', {
        description,
        public: privacy === 'public',
        files: {
          [filename]: {
            content: contents,
          },
        },
      })

      return {
        isSuccess: true,
        service,
        snippet: await this.transformSnippet(rawSnippet.data as GitHubSnippet),
      }
    } catch (error) {
      return {
        isSuccess: false,
        service,
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
      await request('DELETE /gists/{gist_id}', {
        gist_id: id,
      })
      isSuccess = true
    } catch (error) {
      console.error(this.getTag(), 'failed to delete snippet: ' + id)
    }

    return {
      isSuccess,
      service: this.getTag(),
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

    const rawSnippets = await request('GET /gists', {
      headers: this.getHeaders(),
    })
    return Promise.all(
      rawSnippets.data.map((rawSnippet) => this.transformSnippet(rawSnippet))
    )
  }

  async transformSnippet(rawSnippet: GitHubSnippet): Promise<Snippet> {
    return {
      createdAt: new Date(rawSnippet.created_at),
      updatedAt: new Date(rawSnippet.updated_at),
      contents: await (async () => {
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
