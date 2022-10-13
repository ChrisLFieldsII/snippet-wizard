import type { ComponentMeta } from '@storybook/react'

import UpdateSnippetPage from './UpdateSnippetPage'

export const generated = () => {
  return <UpdateSnippetPage />
}

export default {
  title: 'Pages/UpdateSnippetPage',
  component: UpdateSnippetPage,
} as ComponentMeta<typeof UpdateSnippetPage>
