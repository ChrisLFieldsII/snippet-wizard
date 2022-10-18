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

import type { ComponentMeta } from '@storybook/react'

import { CreateSnippetDrawer } from './CreateSnippetDrawer'

export const generated = () => {
  return <CreateSnippetDrawer />
}

export default {
  title: 'Components/CreateSnippetDrawer',
  component: CreateSnippetDrawer,
} as ComponentMeta<typeof CreateSnippetDrawer>
