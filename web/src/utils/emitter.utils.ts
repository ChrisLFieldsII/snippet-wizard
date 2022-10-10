import Emittery from 'emittery'

type EventMap = {
  getSnippets: undefined
}

export const emitter = new Emittery<EventMap>()
