import Emittery from 'emittery'

export const getKeys = <T extends object>(obj: T) => {
  return Object.keys(obj) as (keyof T)[]
}

type EventMap = {
  getSnippets: undefined
}

export const emitter = new Emittery<EventMap>()
