import { UseMutateAsyncFunction } from '@tanstack/react-query'

/** @desc standard props for a form component */
export type FormProps<T> = {
  /** @desc fn for saving form */
  onSave?: (data: T) => void
  /** @desc fn every time form field is updated */
  onUpdate?: (data: T) => void
  initValues?: Partial<T>
}

export type MutationAdapter<
  TData = unknown,
  TError = unknown,
  TVariables = void,
> = {
  mutate: UseMutateAsyncFunction<TData, TError, TVariables, unknown>
  error?: TError
  isError: boolean
  isLoading: boolean
  isSuccess: boolean
}

export type Drawers<T extends string> = {
  drawer?: T
  openDrawer(drawer: T): void
  closeDrawer(): void
}

export type DrawerType =
  | 'create-snippet'
  | 'update-snippet'
  | 'delete-snippet'
  | 'clone-snippet'

export type DrawerProps = {
  isOpen: boolean
  onClose(): void
}
