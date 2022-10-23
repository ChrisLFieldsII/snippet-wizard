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
  const registeredServices: ServiceTag[] = getEntries(services).reduce(
    (accum, [tag, state]) => {
      if (state.token) {
        accum.push(tag)
      }
      return accum
    },
    [],
  )

  return {
    /** the services a user has entered PAT for. */
    registeredServices,
    /** includes all services, even the ones a user is not registered for */
    allServices: SERVICE_TAGS,
    selectedServices,
    setSelectedServices,
  }
}
