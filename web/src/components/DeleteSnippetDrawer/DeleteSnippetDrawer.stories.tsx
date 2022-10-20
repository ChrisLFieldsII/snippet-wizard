// When you've added props to your component,
// pass Storybook's `args` through this story to control it from the addons panel:
//
// ```tsx
// import type { ComponentStory } from '@storybook/react'
//
// export const generated: ComponentStory<typeof DeleteSnippetDrawer> = (args) => {
//   return <DeleteSnippetDrawer {...args} />
// }
// ```
//
// See https://storybook.js.org/docs/react/writing-stories/args.

import type { ComponentMeta } from '@storybook/react'

import DeleteSnippetDrawer from './DeleteSnippetDrawer'

export const generated = () => {
  return <DeleteSnippetDrawer />
}

export default {
  title: 'Components/DeleteSnippetDrawer',
  component: DeleteSnippetDrawer,
} as ComponentMeta<typeof DeleteSnippetDrawer>
