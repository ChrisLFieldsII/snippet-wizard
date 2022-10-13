import { useEffect } from 'react'

import { Box, Divider, Heading } from '@chakra-ui/react'

import { MetaTags } from '@redwoodjs/web'

import { SnippetFormValues, ServiceBadges, SnippetForm } from '~/components'
import { useSnippetManager } from '~/hooks'
import { MainLayout } from '~/layouts'
import { useStore } from '~/state'
import { navBack } from '~/utils'

const UpdateSnippetPage = () => {
  const { updateSnippetMutation } = useSnippetManager()
  const selectedSnippet = useStore((store) => store.snippet)

  useEffect(() => {
    // TODO: might want to persist the selected snippet for page reloads
    if (!selectedSnippet) {
      navBack()
    }
  }, [])

  if (!selectedSnippet) return null

  const onSave = async (formValues: SnippetFormValues) => {
    updateSnippetMutation
      .mutateAsync({
        input: {
          ...formValues,
          oldFilename: selectedSnippet.filename,
          newFilename: formValues.filename,
        },
        services: selectedSnippet.servicesMap,
      })
      .then(console.log)
      .catch(console.error)
  }

  return (
    <>
      <MetaTags title="UpdateSnippet" description="UpdateSnippet page" />

      <MainLayout>
        <Box p={10}>
          <Heading as="h5" size="sm">
            Update Snippet
          </Heading>

          <Divider mt={5} mb={6} />

          <ServiceBadges servicesMap={selectedSnippet.servicesMap} />

          <Box mb={12} />

          <SnippetForm onSave={onSave} initValues={selectedSnippet} />
        </Box>
      </MainLayout>
    </>
  )
}

export default UpdateSnippetPage
