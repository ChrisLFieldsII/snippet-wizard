import { UseMutationResult } from '@tanstack/react-query'

import { MutationAdapter } from '~/types'

export const RenderNull = () => null

export type InfiniteQueryAdapter<TData, TError = unknown> = {
  hasNextPage: boolean
  isNextPageLoading: boolean
  items: TData[]
  fetchNextPage(): void
}

// export const infiniteQueryAdapter = <TData, TError = unknown>(query: UseInfiniteQueryResult<TData, TError>) => {

// }

/**
 * @desc convert react-query mutation to our own type.
 * this allows us to directly pass mutations to components through this adapter.
 * those components can then easily mock mutation adapters in storybook w/o react-query.
 */
export const mutationAdapter = <
  TData = unknown,
  TError = unknown,
  TVariables = void
>(
  mutation: UseMutationResult<TData, TError, TVariables>
): MutationAdapter<TData, TError, TVariables> => {
  return {
    mutate: mutation.mutateAsync,
    isError: mutation.isError,
    isLoading: mutation.isLoading,
    isSuccess: mutation.isSuccess,
    error: mutation.error || undefined,
  }
}
