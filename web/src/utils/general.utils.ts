export const getKeys = <T extends object>(obj: T) => {
  return Object.keys(obj) as (keyof T)[]
}

export const getEntries = <T extends object>(obj: T) => {
  return Object.entries(obj) as [keyof T, T[keyof T]][]
}
