// When you've added props to your component,
// pass Storybook's `args` through this story to control it from the addons panel:
//
// ```tsx
// import type { ComponentStory } from '@storybook/react'
//
// export const generated: ComponentStory<typeof InfiniteList> = (args) => {
//   return <InfiniteList {...args} />
// }
// ```
//
// See https://storybook.js.org/docs/react/writing-stories/args.

import type { ComponentMeta } from '@storybook/react'

import { InfiniteWindowList } from './InfiniteWindowList'

export const generated = () => {
  return <InfiniteWindowList />
}

export default {
  title: 'Components/InfiniteList',
  component: InfiniteWindowList,
} as ComponentMeta<typeof InfiniteWindowList>
