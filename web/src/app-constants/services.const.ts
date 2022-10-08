import { IconType } from 'react-icons'
import { AiFillGitlab, AiFillGithub } from 'react-icons/ai'

import { ServiceTag } from 'src/types'
import { getKeys } from 'src/utils'

type ServiceConfig = {
  icon: IconType
  /** link to get personal access token */
  patLink: string
  name: string
}

export const SERVICES_MAP: Record<ServiceTag, ServiceConfig> = {
  // GIT HUB
  github: {
    icon: AiFillGithub,
    patLink:
      'https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token',
    name: 'GitHub',
  },
  // GIT LAB
  gitlab: {
    icon: AiFillGitlab,
    patLink:
      'https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html',
    name: 'GitLab',
  },
}
export const SERVICE_TAGS = getKeys(SERVICES_MAP)
