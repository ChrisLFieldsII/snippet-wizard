import type { ComponentMeta } from '@storybook/react'

import CreateSnippetPage from './CreateSnippetPage'

export const generated = () => {
  return <CreateSnippetPage />
}

export default {
  title: 'Pages/CreateSnippetPage',
  component: CreateSnippetPage,
} as ComponentMeta<typeof CreateSnippetPage>
