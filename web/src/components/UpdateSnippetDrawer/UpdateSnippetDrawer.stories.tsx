// When you've added props to your component,
// pass Storybook's `args` through this story to control it from the addons panel:
//
// ```tsx
// import type { ComponentStory } from '@storybook/react'
//
// export const generated: ComponentStory<typeof UpdateSnippetDrawer> = (args) => {
//   return <UpdateSnippetDrawer {...args} />
// }
// ```
//
// See https://storybook.js.org/docs/react/writing-stories/args.

import type { ComponentMeta } from '@storybook/react'

import UpdateSnippetDrawer from './UpdateSnippetDrawer'

export const generated = () => {
  return <UpdateSnippetDrawer />
}

export default {
  title: 'Components/UpdateSnippetDrawer',
  component: UpdateSnippetDrawer,
} as ComponentMeta<typeof UpdateSnippetDrawer>
