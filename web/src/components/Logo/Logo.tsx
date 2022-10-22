import { HStack, Text } from '@chakra-ui/react'

type LogoProps = {
  /** defaults to false */
  showTitle?: boolean
}

export const Logo = ({ showTitle = false }: LogoProps) => (
  <HStack>
    <img src={'wizard-64x64.png'} alt="logo" />
    {showTitle ? <Text fontWeight={'bold'}>Snippet Wizard</Text> : null}
  </HStack>
)
