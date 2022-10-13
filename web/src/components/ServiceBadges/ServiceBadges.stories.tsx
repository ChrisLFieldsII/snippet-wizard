// When you've added props to your component,
// pass Storybook's `args` through this story to control it from the addons panel:
//
// ```tsx
// import type { ComponentStory } from '@storybook/react'
//
// export const generated: ComponentStory<typeof ServiceBadges> = (args) => {
//   return <ServiceBadges {...args} />
// }
// ```
//
// See https://storybook.js.org/docs/react/writing-stories/args.

import type { ComponentMeta } from '@storybook/react'

import { ServiceBadges } from './ServiceBadges'

export const generated = () => {
  return <ServiceBadges />
}

export default {
  title: 'Components/ServiceBadges',
  component: ServiceBadges,
} as ComponentMeta<typeof ServiceBadges>
