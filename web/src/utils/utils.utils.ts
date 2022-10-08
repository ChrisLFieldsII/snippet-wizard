import Emittery from 'emittery'

import { SnippetMap } from '~/types'

export const getKeys = <T>(obj: object) => {
  return Object.keys(obj) as T[]
}

type EventMap = {
  getSnippets: {
    snippetMap: SnippetMap
  }
}

export const emitter = new Emittery<EventMap>()
