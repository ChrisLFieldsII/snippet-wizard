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
  const { label, id, size } = props

  return (
    <FormControl>
      <ChakraInput {...props} id={id} name={id} placeholder=" " data-peer />
      <FormLabel htmlFor={id} variant="floating" size={size}>
        {label}
      </FormLabel>
    </FormControl>
  )
}
export default Input
