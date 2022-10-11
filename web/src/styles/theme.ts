import { theme as proTheme } from '@chakra-ui/pro-theme'
import { extendTheme, withDefaultColorScheme } from '@chakra-ui/react'
import '@fontsource/inter/variable.css'

export const theme = extendTheme(
  {
    colors: { ...proTheme.colors, brand: proTheme.colors.blue },
  },
  // withDefaultColorScheme({ colorScheme: 'blue' }),
  proTheme
)
