/** @desc standard props for a form component */
export type FormProps<T> = {
  /** @desc fn for saving form */
  onSave?: (data: T) => void
  /** @desc fn every time form field is updated */
  onUpdate?: (data: T) => void
  initValues?: Partial<T>
}
