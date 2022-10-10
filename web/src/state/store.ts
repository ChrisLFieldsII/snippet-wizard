import { useEffect } from 'react'

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
  init(): void
  services: ServicesMap
  setToken(service: ServiceTag, token: string): void
}

export const useStore = create<AppState>()((set, get) => ({
  services: createEmptyServicesMap(),
  init() {
    // NOTE: use to do stuff like load tokens from storage (if thats safe)
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

export const useInitStore = () => {
  const initStore = useStore((store) => store.init)

  useEffect(() => {
    initStore()
  }, [])
}
