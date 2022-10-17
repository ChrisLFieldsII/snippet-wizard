import { UseInfiniteQueryResult } from '@tanstack/react-query'

export const RenderNull = () => null

export type InfiniteQueryAdapter<TData, TError = unknown> = {
  hasNextPage: boolean
  isNextPageLoading: boolean
  items: TData[]
  fetchNextPage(): void
}

// export const infiniteQueryAdapter = <TData, TError = unknown>(query: UseInfiniteQueryResult<TData, TError>) => {

// }
