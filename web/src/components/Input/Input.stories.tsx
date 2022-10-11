// When you've added props to your component,
// pass Storybook's `args` through this story to control it from the addons panel:
//
// ```tsx
// import type { ComponentStory } from '@storybook/react'
//
// export const generated: ComponentStory<typeof Input> = (args) => {
//   return <Input {...args} />
// }
// ```
//
// See https://storybook.js.org/docs/react/writing-stories/args.

import type { ComponentMeta, ComponentStory } from '@storybook/react'

import Input from './Input'

export default {
  title: 'Components/Input',
  component: Input,
  args: {
    label: 'Label',
  },
} as ComponentMeta<typeof Input>

type InputStory = ComponentStory<typeof Input>
export const generated: InputStory = (args) => {
  return <Input {...args} />
}
