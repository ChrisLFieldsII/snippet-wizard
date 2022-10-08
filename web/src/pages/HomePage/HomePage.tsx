import { useEffect } from 'react'

import {
  Alert,
  AlertIcon,
  Button,
  Code,
  ListItem,
  UnorderedList,
  Link as ChakraLink,
  Flex,
  Heading,
  Text,
  VStack,
  Box,
} from '@chakra-ui/react'
import { createView } from 'react-create-view'

import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'

import MainLayout from 'src/layouts/MainLayout/MainLayout'

import { useHomeView, HomeViewSuccessModel } from './useHomeView'

import { SERVICES_MAP, SERVICE_TAGS } from '~/app-constants'

const HomeView = createView<HomeViewSuccessModel>({
  Success({ snippets }) {
    console.log('render success')
    return (
      <Box as="pre" w="full">
        <Code>{JSON.stringify(snippets, null, 5)}</Code>
      </Box>
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
                  {service.icon}
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
