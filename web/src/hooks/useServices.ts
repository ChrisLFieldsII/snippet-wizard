import { useState } from 'react'

import { SERVICE_TAGS } from '~/app-constants'
import { useStore } from '~/state'
import { ServiceTag } from '~/types'
import { getEntries } from '~/utils'

/**
 * Helper Hook to get services
 */
export const useServices = () => {
  const [selectedServices, setSelectedServices] = useState<ServiceTag[]>([])

  const services = useStore((store) => store.services)
  const registeredServicesWithTokens: { tag: ServiceTag; token: string }[] =
    getEntries(services).reduce<{ tag: ServiceTag; token: string }[]>(
      (accum, [tag, state]) => {
        if (state.token) {
          accum.push({ tag, token: state.token })
        }
        return accum
      },
      [],
    )

  return {
    /** the services a user has entered PAT for. */
    registeredServices: registeredServicesWithTokens.map((svc) => svc.tag),
    /** the services a user has entered PAT for with token included. */
    registeredServicesWithTokens,
    /** includes all services, even the ones a user is not registered for */
    allServices: SERVICE_TAGS,
    selectedServices,
    setSelectedServices,
  }
}
