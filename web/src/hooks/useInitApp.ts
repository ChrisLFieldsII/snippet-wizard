import { useEffect } from 'react'

import { useStore } from '~/state'
import { ServiceTag } from '~/types'
import { getEntries } from '~/utils'

export const useInitApp = () => {
  useDev()
}

/**
 * A hook to help the dev easily use some stuff
 */
const useDev = () => {
  const setToken = useStore((store) => store.setToken)
  useEffect(() => {
    // NOTE: use to do stuff like load tokens from storage (if thats safe)
    console.log('init app state')

    const initTokenMap: Record<ServiceTag, string> = {
      github: process.env.REDWOOD_ENV_GITHUB_PAT || '',
      gitlab: process.env.REDWOOD_ENV_GITLAB_PAT || '',
    }

    getEntries(initTokenMap).forEach(([service, initToken]) => {
      if (initToken) {
        setToken(service, initToken)
      }
    })
  }, [])
}
