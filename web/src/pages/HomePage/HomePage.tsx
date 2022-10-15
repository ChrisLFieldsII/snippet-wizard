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
  Wrap,
  IconButton,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/react'
import { createView } from 'react-create-view'
import { BsArrowsCollapse, BsArrowsExpand } from 'react-icons/bs'

import { MetaTags } from '@redwoodjs/web'

import MainLayout from 'src/layouts/MainLayout/MainLayout'

import { useHomeView, HomeViewSuccessModel } from './useHomeView'

import { SERVICES_MAP, SERVICE_TAGS } from '~/app-constants'
import { List, Snippet, CloneSnippetModal } from '~/components'
import { UISnippet } from '~/types'

const HomeView = createView<HomeViewSuccessModel>({
  Success({
    snippets,
    selectedSnippet,
    onDelete,
    onEdit,
    onToggleCode,
    onStartCloning,
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

    const renderItem = (snippet: UISnippet) => {
      return (
        <Snippet
          {...snippet}
          onDelete={onDelete}
          onEdit={onEdit}
          onClone={onClone}
        />
      )
    }

    return (
      <>
        <Wrap>
          <Tooltip
            aria-label="Close all code blocks"
            label="Close all code blocks"
          >
            <IconButton
              aria-label="Close all code blocks"
              icon={<BsArrowsCollapse />}
              onClick={() => onToggleCode(false)}
            />
          </Tooltip>

          <Tooltip
            aria-label="Open all code blocks"
            label="Open all code blocks"
          >
            <IconButton
              aria-label="Open all code blocks"
              icon={<BsArrowsExpand />}
              onClick={() => onToggleCode(true)}
            />
          </Tooltip>
        </Wrap>

        <List items={snippets} renderItem={renderItem} />

        <CloneSnippetModal
          isOpen={cloneDisclosure.isOpen}
          onClose={cloneDisclosure.onClose}
          onClone={onFinishCloning}
          snippet={selectedSnippet}
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
