import Emittery from 'emittery'

type EventMap = {
  getSnippets: undefined
  /** toggle snippet code blocks all at once */
  toggleCode: {
    isOpen: boolean
  }
}

export const emitter = new Emittery<EventMap>()
