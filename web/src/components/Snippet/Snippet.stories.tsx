import type { ComponentMeta, ComponentStory } from '@storybook/react'

import { Snippet } from './Snippet'

export default {
  title: 'Components/Snippet',
  component: Snippet,
  args: {
    title: 'Hello world in bash',
    contents: 'echo "Hello world"',
    createdAt: new Date(2022, 5, 28),
    updatedAt: new Date(2022, 5, 28),
    description: 'Bash hello world example',
    filename: 'hello-world.sh',
    id: '1',
    privacy: 'public',
    services: ['github', 'gitlab'],
    servicesMap: {
      github: {
        url: 'https://gist.github.com/ChrisLFieldsII/7631412243b8895f2e1f904359f12919',
      },
      gitlab: {
        url: 'https://gitlab.com/gamestopcorp/ecom/native-app/gs-mobile-app-v2.0/-/snippets/2424054',
      },
    },
    // defaultIsCodeOpen: false,
  },
} as ComponentMeta<typeof Snippet>

type SnippetStory = ComponentStory<typeof Snippet>

export const SnippetExample: SnippetStory = (args) => {
  return <Snippet {...args} />
}
