import produce from 'immer'
import create from 'zustand'

import { SERVICES_MAP } from 'src/app-constants'
import { ServiceTag, ServicesMap } from 'src/types'

// const defaultServicesMap: ServicesMap =

const createEmptyServicesMap = (): ServicesMap => {
  const keys = Object.keys(SERVICES_MAP) as ServiceTag[]
  return keys.reduce((accum, svc) => {
    return {
      ...accum,
      [svc]: {
        token: '',
      },
    }
  }, {} as ServicesMap)
}

interface AppState {
  services: ServicesMap
  setToken(service: ServiceTag, token: string): void
}

export const useStore = create<AppState>()((set) => ({
  services: createEmptyServicesMap(),
  setToken(service, token: string) {
    console.log(`setting token for ${service} to ${token}`)

    set(
      produce<AppState>((draft) => {
        draft.services[service].token = token
      })
    )
  },
}))
