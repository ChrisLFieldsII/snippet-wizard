import { useToast } from '@chakra-ui/react'
import { useMutation } from '@tanstack/react-query'

import { SERVICE_TAGS } from '~/app-constants'
import { SnippetFormValues } from '~/components'
import {
  ServiceTag,
  SnippetMutationResponse,
  UpdateSnippetInput,
} from '~/types'
import { getEntries, snippetPluginManager } from '~/utils'

export const useSnippetManager = () => {
  const toast = useToast()

  const createSnippetMutation = useMutation(
    async (data: SnippetFormValues) => {
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
        showNotifications(data, {
          toast,
          failure: {
            title: 'Error creating snippet',
            getDescription: (service) =>
              `Failed to create snippet for service ${service}`,
          },
          success: {
            title: 'Created snippets!',
            getDescription: () =>
              'Snippets were created for each of your services',
          },
        })
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

  const updateSnippetMutation = useMutation(
    async (data: UpdateSnippetInput) => {
      return snippetPluginManager.updateSnippet({
        services: SERVICE_TAGS,
        input: data,
      })
    },
    {
      onSuccess(data) {
        showNotifications(data, {
          toast,
          failure: {
            title: 'Error updating snippet',
            getDescription: (service) =>
              `Failed to update snippet for service ${service}`,
          },
          success: {
            title: 'Updated snippets!',
            getDescription: () =>
              'Snippets were updated for each of your services',
          },
        })
      },
      onError() {
        toast({
          title: 'Error updating snippets',
          description: 'Failed to update snippets for some reason...',
          status: 'error',
          position: 'top',
          isClosable: true,
        })
      },
    }
  )

  return {
    createSnippetMutation,
    updateSnippetMutation,
  }
}

type NotificationMsg = {
  title: string
  getDescription(service?: ServiceTag): string
}
/**
 * util to show notifications from snippet manager response
 */
const showNotifications = (
  data: Record<ServiceTag, SnippetMutationResponse>,
  opts: {
    success: NotificationMsg
    failure: NotificationMsg
    toast: ReturnType<typeof useToast>
  }
) => {
  const { failure, success, toast } = opts
  const entries = getEntries(data)

  // notify user of any failed services
  entries.forEach(([service, response]) => {
    if (!response.isSuccess) {
      toast({
        title: failure.title,
        description: failure.getDescription(service),
        status: 'error',
        position: 'top',
        isClosable: true,
      })
    }
  })

  // if there were no failures, show success alert
  if (entries.filter(([_, response]) => !response.isSuccess).length == 0) {
    toast({
      title: success.title,
      description: success.getDescription(),
      status: 'success',
      position: 'top',
      isClosable: true,
    })
  }
}
