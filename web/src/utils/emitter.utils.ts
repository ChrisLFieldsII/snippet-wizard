import Emittery from 'emittery'

type EventMap = {
  getSnippets: undefined
  /** toggle snippet code blocks all at once */
  toggleCode: {
    isOpen: boolean
  }
  clickedCreate: undefined
}

export const emitter = new Emittery<EventMap>()
