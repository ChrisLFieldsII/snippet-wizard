// When you've added props to your component,
// pass Storybook's `args` through this story to control it from the addons panel:
//
// ```tsx
// import type { ComponentStory } from '@storybook/react'
//
// export const generated: ComponentStory<typeof CloneSnippetDrawer> = (args) => {
//   return <CloneSnippetDrawer {...args} />
// }
// ```
//
// See https://storybook.js.org/docs/react/writing-stories/args.

import type { ComponentMeta } from '@storybook/react'

import CloneSnippetDrawer from './CloneSnippetDrawer'

export const generated = () => {
  return <CloneSnippetDrawer />
}

export default {
  title: 'Components/CloneSnippetDrawer',
  component: CloneSnippetDrawer,
} as ComponentMeta<typeof CloneSnippetDrawer>
