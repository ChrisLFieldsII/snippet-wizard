import { Box, Divider, Heading, useToast } from '@chakra-ui/react'
import { useMutation } from '@tanstack/react-query'

import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'

import { SERVICE_TAGS } from '~/app-constants'
import { CreateSnippetFormValues, CreateSnippetForm, Card } from '~/components'
import MainLayout from '~/layouts/MainLayout/MainLayout'
import { getEntries, snippetPluginManager } from '~/utils'

const IS_DEBUG = true
const initValues: CreateSnippetFormValues | undefined = IS_DEBUG
  ? {
      code: `echo 'hello world'`,
      description: 'how to echo hello world in shell',
      filename: 'example.sh',
      privacy: 'private',
      title: 'Echo hello world in shell',
    }
  : undefined

export const useSnippetManager = () => {
  const toast = useToast()

  const createSnippetMutation = useMutation(
    async (data: CreateSnippetFormValues) => {
      return snippetPluginManager.createSnippet({
        // TODO: allow user to specify services via UI
        services: SERVICE_TAGS,
        input: {
          ...data,
          contents: data.code,
        },
      })
    },
    {
      onSuccess(data) {
        const entries = getEntries(data)

        // notify user of any failed services
        entries.forEach(([service, response]) => {
          if (!response.isSuccess) {
            toast({
              title: `Error creating snippet`,
              description: `Failed to create snippet for service ${service}`,
              status: 'error',
              position: 'top',
              isClosable: true,
            })
          }
        })

        // if there were no failures, show success alert
        if (
          entries.filter(([_, response]) => !response.isSuccess).length == 0
        ) {
          toast({
            title: `Created snippets!`,
            description: `Snippets were created for each of your services`,
            status: 'success',
            position: 'top',
            isClosable: true,
          })
        }
      },
      onError() {
        toast({
          title: 'Error creating snippets',
          description: 'Failed to create snippets for some reason...',
          status: 'error',
          position: 'top',
          isClosable: true,
        })
      },
    }
  )

  return {
    createSnippetMutation,
  }
}
