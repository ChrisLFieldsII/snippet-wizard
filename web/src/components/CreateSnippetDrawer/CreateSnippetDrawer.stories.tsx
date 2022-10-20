// When you've added props to your component,
// pass Storybook's `args` through this story to control it from the addons panel:
//
// ```tsx
// import type { ComponentStory } from '@storybook/react'
//
// export const generated: ComponentStory<typeof CreateSnippetDrawer> = (args) => {
//   return <CreateSnippetDrawer {...args} />
// }
// ```
//
// See https://storybook.js.org/docs/react/writing-stories/args.

import type { ComponentMeta, ComponentStory } from '@storybook/react'

import { CreateSnippetDrawer } from './CreateSnippetDrawer'

export default {
  title: 'Components/CreateSnippetDrawer',
  component: CreateSnippetDrawer,
  args: {
    isOpen: true,
    allServices: ['github'],
  },
} as ComponentMeta<typeof CreateSnippetDrawer>

type Story = ComponentStory<typeof CreateSnippetDrawer>

export const generated: Story = (args) => {
  return <CreateSnippetDrawer {...args} />
}
