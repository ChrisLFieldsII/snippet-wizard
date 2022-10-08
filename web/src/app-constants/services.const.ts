import { IconType } from 'react-icons'
import { AiFillGitlab, AiFillGithub } from 'react-icons/ai'

import { ServiceTag } from 'src/types'
import { getKeys } from 'src/utils'

type ServiceConfig = {
  icon: IconType
}

export const SERVICES_MAP: Record<ServiceTag, ServiceConfig> = {
  github: {
    icon: AiFillGithub,
  },
  gitlab: {
    icon: AiFillGitlab,
  },
}
export const SERVICE_TAGS = getKeys<ServiceTag>(SERVICES_MAP)
