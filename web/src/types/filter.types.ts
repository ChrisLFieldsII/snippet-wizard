import { ServiceTag, SnippetPrivacy } from './snippet.types'

/**
 * A map of the filter key to the params the filter supports
 */
export type FilterParamsMap = {
  /** can filter by multiple services */
  services: ServiceTag[]
  /** can filter by privacy */
  privacy: SnippetPrivacy[]
  /** can filter by file type/extension */
  fileType: string[]
}

export type Filters<T extends Record<string, unknown>> = {
  filters: T
  addFilter<Key extends keyof T>(key: Key, values: T[Key]): void
  removeFilter<Key extends keyof T>(key: Key, values: T[Key]): void
}

export type AppFilters = Filters<FilterParamsMap>
