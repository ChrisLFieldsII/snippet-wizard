// When you've added props to your component,
// pass Storybook's `args` through this story to control it from the addons panel:
//
// ```tsx
// import type { ComponentStory } from '@storybook/react'
//
// export const generated: ComponentStory<typeof Card> = (args) => {
//   return <Card {...args} />
// }
// ```
//
// See https://storybook.js.org/docs/react/writing-stories/args.

import { Text } from '@chakra-ui/react'
import type { ComponentMeta, ComponentStory } from '@storybook/react'

import { Card } from './Card'

export default {
  title: 'Components/Card',
  component: Card,
} as ComponentMeta<typeof Card>

type CardStory = ComponentStory<typeof Card>
export const generated: CardStory = (args) => {
  return (
    <Card {...args}>
      <Text>Hello world</Text>
    </Card>
  )
}
