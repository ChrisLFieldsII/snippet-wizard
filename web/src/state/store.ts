import produce from 'immer'
import create from 'zustand'

import { SERVICES_MAP } from 'src/app-constants'
import { ServiceTag, ServicesMap, UISnippet } from 'src/types'

import { getKeys } from '~/utils'

// const defaultServicesMap: ServicesMap =

const createEmptyServicesMap = (): ServicesMap => {
  const keys = getKeys(SERVICES_MAP)
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

  /** reps the current selected snippet if any */
  snippet: UISnippet | null
  /** sets selected snippet. set to null if none selected */
  setSnippet(snippet: UISnippet | null): void
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

  snippet: null,
  setSnippet(snippet) {
    set(
      produce<AppState>((draft) => {
        draft.snippet = snippet
      })
    )
  },
}))
