import {
  FormControl,
  FormLabel,
  Input as ChakraInput,
  InputProps as ChakraInputProps,
} from '@chakra-ui/react'

type InputProps = ChakraInputProps & {
  label: string
}

export const Input = (props: InputProps) => {
  const { label } = props
  return (
    <FormControl>
      <ChakraInput {...props} placeholder=" " data-peer />
      <FormLabel htmlFor="medium" variant="floating" size="md">
        {label}
      </FormLabel>
    </FormControl>
  )
}
export default Input
