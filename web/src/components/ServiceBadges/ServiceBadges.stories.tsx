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

import { Text } from '@chakra-ui/react'
import type { ComponentMeta, ComponentStory } from '@storybook/react'

import {
  ServiceBadges,
  ServiceBadgesWithLinks,
  ServiceSelector,
} from './ServiceBadges'

import { SERVICE_TAGS } from '~/app-constants'

export default {
  title: 'Components/ServiceBadges',
  component: ServiceBadges,
} as ComponentMeta<typeof ServiceBadges>

export const NoWrapper: ComponentStory<typeof ServiceBadges> = () => {
  return <ServiceBadges services={SERVICE_TAGS} />
}

export const WithLinks = () => {
  return (
    <ServiceBadgesWithLinks
      servicesMap={{
        github: {
          url: 'https://gist.github.com/e4028348cdfc5f1fbf699c5158aa692b',
          id: 'e4028348cdfc5f1fbf699c5158aa692b',
        },
        gitlab: {
          id: '2427170',
          url: 'https://gitlab.com/-/snippets/2427170',
        },
      }}
    />
  )
}

export const SelectServices: ComponentStory<typeof ServiceSelector> = (
  args
) => {
  return <ServiceSelector {...args} />
}
SelectServices.args = {
  allServices: SERVICE_TAGS,
  alreadyServices: ['github'],
  selectedServices: ['gitlab'],
}
SelectServices.argTypes = {
  onSelect: { action: 'on select' },
}

export const Empty: ComponentStory<typeof ServiceBadges> = () => {
  return <ServiceBadges services={[]} />
}

export const EmptyRender: ComponentStory<typeof ServiceBadges> = () => {
  return (
    <ServiceBadges
      services={[]}
      renderEmpty={() => <Text>There are no service badges</Text>}
    />
  )
}
