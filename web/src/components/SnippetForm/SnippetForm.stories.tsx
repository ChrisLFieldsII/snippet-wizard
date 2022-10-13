// When you've added props to your component,
// pass Storybook's `args` through this story to control it from the addons panel:
//
// ```tsx
// import type { ComponentStory } from '@storybook/react'
//
// export const generated: ComponentStory<typeof CreateSnippetForm> = (args) => {
//   return <CreateSnippetForm {...args} />
// }
// ```
//
// See https://storybook.js.org/docs/react/writing-stories/args.

import type { ComponentMeta, ComponentStory } from '@storybook/react'

import { Card } from '../Card/Card'

import SnippetForm from './SnippetForm'

export default {
  title: 'Components/SnippetForm',
  component: SnippetForm,
  decorators: [
    (Story) => (
      <Card p={10}>
        <Story />
      </Card>
    ),
  ],
  argTypes: {
    onUpdate: { action: 'on update' },
  },
} as ComponentMeta<typeof SnippetForm>

type SnippetFormStory = ComponentStory<typeof SnippetForm>

export const SnippetFormExample: SnippetFormStory = (args) => (
  <SnippetForm {...args} />
)
