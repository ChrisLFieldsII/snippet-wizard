export const getKeys = <T extends object>(obj: T) => {
  return Object.keys(obj) as (keyof T)[]
}

export const getEntries = <T extends object>(obj: T) => {
  return Object.entries(obj) as [keyof T, T[keyof T]][]
}

export const noop = (..._params: any[]) => {}

export const reduceObjectToString = (obj: object) => {
  return Object.values(obj)
    .map((value) => value + '')
    .join()
}

export const isEmpty = (array: unknown[]) => {
  return array.length === 0
}
