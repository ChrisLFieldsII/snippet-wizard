import { useEffect } from 'react'

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
  useToast,
  Container,
  Wrap,
  WrapItem,
  HStack,
  Avatar,
  Divider,
} from '@chakra-ui/react'
import { createView } from 'react-create-view'
import { AiFillGitlab, AiFillGithub } from 'react-icons/ai'
import { BiLinkExternal } from 'react-icons/bi'

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
  Spacer,
  Card,
  Logo,
} from '~/components'
import { UISnippet } from '~/types'
import { emitter, isEmpty } from '~/utils'

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
        {/* Main content */}
        <>
          <InfiniteList
            {...infiniteQuery}
            renderItem={(item, index) => renderItem({ item, index })}
            renderLoading={renderLoading}
          />
          <Spacer size={60} />
        </>

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
    const introOptions: {
      type: 'c' | 'r' | 'u' | 'd' | 'more'
      title: string
      description: string
    }[] = [
      {
        type: 'c',
        title: 'Summon',
        description: `
          Create a snippet in one form and select the services you
          want the snippet to be created in. Create once, create
          everywhere!
        `,
      },
      {
        type: 'r',
        title: 'Read',
        description: `
          Read snippets from your desired services and combine them all into one infinite list.
          Your snippets are grouped by their contents.
        `,
      },
      {
        type: 'u',
        title: 'Transmute',
        description: `
          Update snippets across your many different services in one place.
        `,
      },
      {
        type: 'd',
        title: 'Disintegrate',
        description: `
          Delete snippets across your many different services in one place.
        `,
      },
      {
        type: 'more',
        title: 'More...',
        description: `
          There are more useful features too like cloning a snippet from one service to others and more
          to be added!
        `,
      },
    ]

    return (
      <>
        <Container p={30}>
          <VStack spacing={12} alignItems={'start'}>
            <HStack>
              <Heading size="md">Welcome to Snippet Wizard </Heading>
              <Logo />
            </HStack>

            <Text>
              Snippet Wizard is a convenience site that helps you in the case
              that you need to manage code snippets across the many different
              snippet sites like GitHub (gists), GitLab, etc.
            </Text>

            <Text>
              In Snippet Wizard, you can do the following for the many different
              snippet services you require (and we support)...
            </Text>

            <Wrap spacing={12}>
              {introOptions.map(({ description, title, type }) => {
                const isMore = type === 'more'
                return (
                  <WrapItem key={type}>
                    <Card width={300} height={250}>
                      <VStack alignItems={'start'}>
                        <HStack>
                          {!isMore ? (
                            <Avatar name={type} bg="gray.500" size="sm" />
                          ) : null}
                          <Heading as="h6" size="xs">
                            {title}
                          </Heading>
                        </HStack>

                        <Spacer size={3} />
                        <Divider />
                        <Spacer size={3} />

                        <Text>{description}</Text>
                      </VStack>
                    </Card>
                  </WrapItem>
                )
              })}
            </Wrap>

            <Divider />

            <HStack>
              <Heading size="md">Snippet Wizard is open source!</Heading>
              <ChakraLink
                href="https://github.com/ChrisLFieldsII/snippet-wizard"
                isExternal
              >
                <AiFillGithub size={'2em'} />
              </ChakraLink>
            </HStack>

            <Text>
              Snippet Wizard is powered by API Plugins that are responsible for
              doing the CRUD operations per service. If a service you require is
              not supported, head over to the{' '}
              <ChakraLink
                href="https://github.com/ChrisLFieldsII/snippet-wizard"
                isExternal
                color={'accent'}
              >
                GitHub <BiLinkExternal style={{ display: 'inline-block' }} />
              </ChakraLink>{' '}
              repo and learn how to create and contribute a plugin!
            </Text>
          </VStack>
        </Container>
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
      <MetaTags
        title="Snippet Wizard"
        description="An app to CRUD snippets in one place across the many different snippet sites like github, gitlab, etc"
      />

      <HomeView {...viewModel} />
    </MainLayout>
  )
}

export default HomePage
