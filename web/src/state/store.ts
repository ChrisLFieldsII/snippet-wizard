import produce from 'immer'
import create from 'zustand'

import { ServiceTag, ServicesMap } from 'src/types'

const services: Record<ServiceTag, true> = {
  github: true,
  gitlab: true,
}

// const defaultServicesMap: ServicesMap =

const createEmptyServicesMap = (): ServicesMap => {
  const keys = Object.keys(services) as ServiceTag[]
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
  init(): void
  services: ServicesMap
  setToken(service: ServiceTag, token: string): void
}

export const useStore = create<AppState>()((set, get) => ({
  services: createEmptyServicesMap(),
  init() {
    console.log('init app state')
  },
  setToken(service, token: string) {
    console.log(`setting token for ${service} to ${token}`)

    set(
      produce<AppState>((draft) => {
        draft.services[service].token = token
      })
    )
  },
}))
