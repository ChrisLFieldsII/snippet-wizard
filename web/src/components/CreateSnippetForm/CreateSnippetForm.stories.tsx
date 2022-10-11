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

import type { ComponentMeta } from '@storybook/react'

import { Card } from '../Card/Card'

import CreateSnippetForm from './CreateSnippetForm'

export const generated = () => {
  return <CreateSnippetForm />
}

export default {
  title: 'Components/CreateSnippetForm',
  component: CreateSnippetForm,
  decorators: [
    (Story) => (
      <Card p={10}>
        <Story />
      </Card>
    ),
  ],
} as ComponentMeta<typeof CreateSnippetForm>
