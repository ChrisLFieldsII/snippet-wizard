// When you've added props to your component,
// pass Storybook's `args` through this story to control it from the addons panel:
//
// ```tsx
// import type { ComponentStory } from '@storybook/react'
//
// export const generated: ComponentStory<typeof Spacer> = (args) => {
//   return <Spacer {...args} />
// }
// ```
//
// See https://storybook.js.org/docs/react/writing-stories/args.

import type { ComponentMeta } from '@storybook/react'

import { Spacer } from './Spacer'

export const generated = () => {
  return <Spacer />
}

export default {
  title: 'Components/Spacer',
  component: Spacer,
} as ComponentMeta<typeof Spacer>
