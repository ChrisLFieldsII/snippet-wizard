import { useColorModeValue, Box, BoxProps } from '@chakra-ui/react'

type CardProps = BoxProps & {}

export const Card = (props: CardProps) => {
  const { children } = props
  const boxShadow = useColorModeValue('sm', 'sm-dark')

  return (
    <Box
      bg="bg-surface"
      boxShadow={boxShadow}
      borderRadius="lg"
      p={{ base: '4', md: '6' }}
      {...props}
    >
      {children}
    </Box>
  )
}
