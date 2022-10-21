import {
  Alert,
  AlertIcon,
  ListItem,
  UnorderedList,
  Link as ChakraLink,
  Flex,
  Heading,
  Text,
  VStack,
  Spinner,
  Center,
} from '@chakra-ui/react'
import { createView } from 'react-create-view'

import { MetaTags } from '@redwoodjs/web'

import MainLayout from 'src/layouts/MainLayout/MainLayout'

import { useHomeView, HomeViewSuccessModel } from './useHomeView'

import { SERVICES_MAP, SERVICE_TAGS } from '~/app-constants'
import {
  Snippet,
  InfiniteList,
  SnippetFormValues,
  CreateSnippetDrawer,
  UpdateSnippetDrawer,
  DeleteSnippetDrawer,
  CloneSnippetDrawer,
} from '~/components'
import { UISnippet } from '~/types'
import { isEmpty } from '~/utils'

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

const HomeView = createView<HomeViewSuccessModel>({
  Success({
    infiniteQuery,
    selectedSnippet,
    onDelete,
    onEdit,
    onStartCloning,
    createSnippetMutation,
    updateSnippetMutation,
    deleteSnippetMutation,
    drawers,
    userServices,
  }) {
    const renderItem = ({
      item: snippet,
    }: {
      item: UISnippet
      index: number
    }) => {
      return (
        <Snippet
          {...snippet}
          onDelete={onDelete}
          onEdit={onEdit}
          onClone={onStartCloning}
        />
      )
    }

    const renderLoading = () => (
      <Center>
        <Spinner />
      </Center>
    )

    return (
      <>
        <InfiniteList
          {...infiniteQuery}
          renderItem={(item, index) => renderItem({ item, index })}
          renderLoading={renderLoading}
        />

        <CreateSnippetDrawer
          isOpen={drawers.drawer === 'create-snippet'}
          onClose={drawers.closeDrawer}
          onSave={(input) =>
            createSnippetMutation.mutate({
              input,
              services: isEmpty(userServices.selectedServices)
                ? userServices.registeredServices
                : userServices.selectedServices,
            })
          }
          initValues={initValues}
          {...userServices}
        />

        <UpdateSnippetDrawer
          isOpen={drawers.drawer === 'update-snippet'}
          onClose={drawers.closeDrawer}
          onSave={(formValues: SnippetFormValues) => {
            updateSnippetMutation
              .mutate({
                input: {
                  ...formValues,
                  oldFilename: selectedSnippet.filename,
                  newFilename: formValues.filename,
                },
                services: selectedSnippet.servicesMap,
              })
              .then(console.log)
              .catch(console.error)
          }}
          initValues={selectedSnippet}
          snippet={selectedSnippet}
        />

        {/* TODO: pass delete mutation adapater. compose delete mutation from hook with ability to determine which services to delete! (the drawer shouldnt do this logic) */}
        <DeleteSnippetDrawer
          isOpen={drawers.drawer === 'delete-snippet'}
          onClose={drawers.closeDrawer}
          snippet={selectedSnippet}
          {...userServices}
          deleteSnippetMutation={deleteSnippetMutation}
        />

        <CloneSnippetDrawer
          isOpen={drawers.drawer === 'clone-snippet'}
          onClose={drawers.closeDrawer}
          snippet={selectedSnippet}
          {...userServices}
          cloneSnippetMutation={createSnippetMutation}
        />
      </>
    )
  },
  Empty() {
    return (
      <>
        <Alert status="info">
          <VStack spacing={3} alignItems="start">
            <AlertIcon />
            <Text>No snippets found.</Text>
            <Text>
              {`Enter your personal access tokens (PAT) for each service you want to use
              and press the "Get Snippets" button.`}
            </Text>
            <Text>Make sure your PAT has access to snippets/gists!</Text>
          </VStack>
        </Alert>

        <Flex p={10} direction="column">
          <Heading as="h6" size="xs">
            How to get PAT links!
          </Heading>
          <UnorderedList>
            {SERVICE_TAGS.map((tag) => {
              const service = SERVICES_MAP[tag]

              return (
                <ListItem key={tag}>
                  {service.Icon}
                  <ChakraLink href={service.patLink} isExternal>
                    {service.name}
                  </ChakraLink>
                </ListItem>
              )
            })}
          </UnorderedList>
        </Flex>
      </>
    )
  },
  Loading() {
    return (
      <Center>
        <Spinner />
      </Center>
    )
  },
})

const HomePage = () => {
  const viewModel = useHomeView()

  return (
    <MainLayout>
      <MetaTags title="Home" description="Home page" />

      <HomeView {...viewModel} />
    </MainLayout>
  )
}

export default HomePage
