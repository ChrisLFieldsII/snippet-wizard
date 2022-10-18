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
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from '@chakra-ui/react'
import { createView } from 'react-create-view'

import { MetaTags } from '@redwoodjs/web'

import MainLayout from 'src/layouts/MainLayout/MainLayout'

import { useHomeView, HomeViewSuccessModel } from './useHomeView'

import { SERVICES_MAP, SERVICE_TAGS } from '~/app-constants'
import {
  Snippet,
  CloneSnippetModal,
  InfiniteList,
  SnippetForm,
  SnippetFormValues,
  CreateSnippetDrawer,
} from '~/components'
import { UISnippet } from '~/types'

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
    drawers,
    ...props
  }) {
    const cloneDisclosure = useDisclosure()

    const onClone = (snippet: UISnippet) => {
      onStartCloning(snippet)
      cloneDisclosure.onOpen()
    }

    const onFinishCloning: HomeViewSuccessModel['onFinishCloning'] = async (
      snippet,
      services
    ) => {
      await props.onFinishCloning(snippet, services)
      cloneDisclosure.onClose()
    }

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
          onClone={onClone}
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

        <CloneSnippetModal
          isOpen={cloneDisclosure.isOpen}
          onClose={cloneDisclosure.onClose}
          onClone={onFinishCloning}
          snippet={selectedSnippet}
        />

        <CreateSnippetDrawer
          isOpen={drawers.drawer === 'create-snippet'}
          onClose={drawers.closeDrawer}
          onSave={(input) =>
            createSnippetMutation.mutate({
              input,
              services: SERVICE_TAGS,
            })
          }
          initValues={initValues}
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
