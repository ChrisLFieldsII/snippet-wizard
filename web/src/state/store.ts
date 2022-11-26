import produce from 'immer'
import create from 'zustand'

import { SERVICES_CONFIG } from 'src/app-constants'
import { ServiceTag, UISnippet, Drawers, DrawerType } from 'src/types'

import { AppFilters } from '~/types/filter.types'
import { getKeys } from '~/utils'

type ServiceState = {
  token: string
}

type ServicesMap = Record<ServiceTag, ServiceState>

const createEmptyServicesMap = (): ServicesMap => {
  const keys = getKeys(SERVICES_CONFIG)
  return keys.reduce((accum, svc) => {
    return {
      ...accum,
      [svc]: {
        token: '',
      },
    }
  }, {} as ServicesMap)
}

type AppState = Drawers<DrawerType> &
  AppFilters & {
    services: ServicesMap
    setToken(service: ServiceTag, token: string): void

    /** reps the current selected snippet if any */
    snippet: UISnippet | null
    /** sets selected snippet. set to null if none selected */
    setSnippet(snippet: UISnippet | null): void
  }

export const useStore = create<AppState>()((set, get) => ({
  // services and token state
  services: createEmptyServicesMap(),
  setToken(service, token: string) {
    set(
      produce<AppState>((draft) => {
        draft.services[service].token = token
      }),
    )
  },

  // selected snippet state
  snippet: null,
  setSnippet(snippet) {
    set(
      produce<AppState>((draft) => {
        draft.snippet = snippet
      }),
    )
  },

  // drawer state
  drawer: undefined,
  openDrawer(drawer) {
    set(
      produce<AppState>((draft) => {
        draft.drawer = drawer
      }),
    )
  },
  closeDrawer() {
    set(
      produce<AppState>((draft) => {
        draft.drawer = undefined
      }),
    )
  },

  filters: {
    fileType: [],
    privacy: [],
    services: [],
  },
  addFilter(key, values) {
    const currState = get()
    const currFilters = currState.filters[key]
    // @ts-ignore
    const newFilters = [...new Set(currFilters.concat(values))]
    set(
      produce<AppState>((draft) => {
        // @ts-ignore
        draft.filters[key] = newFilters
      }),
    )
  },
  removeFilter(key, values) {
    const currState = get()
    const currFilters = currState.filters[key]
    // @ts-ignore
    const newFilters = currFilters.filter((f) => !values.includes(f))
    set(
      produce<AppState>((draft) => {
        // @ts-ignore
        draft.filters[key] = newFilters
      }),
    )
  },
}))
