import { theme as proTheme } from '@chakra-ui/pro-theme'
import { extendTheme, type ThemeConfig } from '@chakra-ui/react'
import '@fontsource/inter/variable.css'

const config: ThemeConfig = {
  useSystemColorMode: true,
  initialColorMode: 'system',
}

export const theme = extendTheme(
  {
    colors: { ...proTheme.colors, brand: proTheme.colors.blue },
  },
  // withDefaultColorScheme({ colorScheme: 'blue' }),
  proTheme,
  config,
)
