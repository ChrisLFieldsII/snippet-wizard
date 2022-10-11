import {
  FormControl,
  FormLabel,
  Input as ChakraInput,
  InputProps as ChakraInputProps,
} from '@chakra-ui/react'

type InputProps = ChakraInputProps & {
  id: string
  label: string
}

export const Input = (props: InputProps) => {
  const { label, id } = props

  return (
    <FormControl>
      <ChakraInput id={id} {...props} placeholder=" " data-peer />
      <FormLabel htmlFor={id} variant="floating">
        {label}
      </FormLabel>
    </FormControl>
  )
}
export default Input
