import * as React from 'react'

import { Box, ChakraProvider, extendTheme } from '@chakra-ui/react'

// import * as theme from 'config/chakra.config'
import { theme } from '../src/styles/theme'

/** @type { import("@storybook/csf").GlobalTypes } */
export const globalTypes = {}

/**
 * An example, no-op storybook decorator. Use a function like this to create decorators.
 * @param { import("@storybook/addons").StoryFn} StoryFn
 * @param { import("@storybook/addons").StoryContext} context
 * @returns StoryFn, unmodified.
 */
const _exampleDecorator = (StoryFn, _context) => {
  return <StoryFn />
}

const extendedTheme = extendTheme(theme)

const withChakra = (StoryFn) => {
  return (
    <ChakraProvider theme={extendedTheme}>
      <StoryFn />
    </ChakraProvider>
  )
}

const withPadding = (Story) => (
  <Box p={30}>
    <Story />
  </Box>
)

export const decorators = [withChakra, withPadding]

export const parameters = {
  actions: { argTypesRegex: '(^on.*|^set.*)' },
}
