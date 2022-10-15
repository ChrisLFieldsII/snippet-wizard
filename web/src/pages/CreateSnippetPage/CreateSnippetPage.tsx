import { Box, Divider, Heading } from '@chakra-ui/react'

import { MetaTags } from '@redwoodjs/web'

import { SnippetFormValues, SnippetForm } from '~/components'
import { useSnippetManager } from '~/hooks'
import { MainLayout } from '~/layouts'

const IS_DEBUG = true
const initValues: SnippetFormValues | undefined = IS_DEBUG
  ? {
      contents: `echo 'hello world'`,
      description: 'how to echo hello world in shell',
      filename: 'example.sh',
      privacy: 'private',
      title: 'Echo hello world in shell',
    }
  : undefined

const CreateSnippetPage = () => {
  const { createSnippetMutation } = useSnippetManager()

  return (
    <>
      <MetaTags title="CreateSnippet" description="CreateSnippet page" />

      <MainLayout>
        <Box p={10}>
          <Heading as="h5" size="sm">
            Create Snippet
          </Heading>

          <Divider mt={5} mb={12} />

          <SnippetForm
            onSave={(input) => createSnippetMutation.mutate({ input })}
            initValues={initValues}
          />
        </Box>
      </MainLayout>
    </>
  )
}

export default CreateSnippetPage
