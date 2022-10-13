import { useEffect } from 'react'

import { useToast } from '@chakra-ui/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import produce from 'immer'

import { SERVICE_TAGS } from '~/app-constants'
import { SnippetFormValues } from '~/components'
import {
  ServiceTag,
  SnippetManagerUpdateInput,
  SnippetMutationResponse,
  UISnippet,
} from '~/types'
import { getEntries, getKeys, snippetPluginManager } from '~/utils'

export const QUERY_KEY = 'snippets'

export const useSnippetManager = () => {
  const toast = useToast()
  const queryClient = useQueryClient()

  useEffect(() => {
    window.queryClient = queryClient
  }, [])

  const createSnippetMutation = useMutation(
    async (input: SnippetFormValues) => {
      return snippetPluginManager.createSnippet({
        // TODO: allow user to specify services via UI
        services: SERVICE_TAGS,
        input,
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
    async (input: SnippetManagerUpdateInput) => {
      return snippetPluginManager.updateSnippet(input)
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
            title: 'Successfully updated snippets!',
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

  const deleteSnippetMutation = useMutation(
    async (snippet: UISnippet) => {
      const res = await snippetPluginManager.deleteSnippet({
        services: snippet.servicesMap,
      })
      console.log('deleted snippets response', res)

      return res
    },
    {
      onSuccess(data) {
        try {
          // #region modify cache
          // modify cached data w/ deleted ids and set new cached data
          let cachedData = queryClient.getQueryData<UISnippet[]>([QUERY_KEY])
          console.log('cached data', cachedData)

          showNotifications(data, {
            toast,
            failure: {
              title: `Error deleting snippet`,
              getDescription: (service) =>
                `Failed to delete snippet for service ${service}`,
            },
            success: {
              title: `Successfully deleted snippets!`,
              getDescription: () =>
                `Snippets were deleted for each of your services`,
            },
          })

          getEntries(data).forEach(([service, deleteRes]) => {
            if (!deleteRes.isSuccess) {
              return
            }

            const idToDelete = deleteRes.data?.id
            console.log({ service, idToDelete })

            cachedData = produce<UISnippet[]>(cachedData, (draft) => {
              draft.some((snippet, index) => {
                if (snippet.servicesMap[service].id === idToDelete) {
                  delete snippet.servicesMap[service]

                  // can delete this ui snippet
                  if (getKeys(snippet.servicesMap).length === 0) {
                    draft.splice(index, 1)
                  }

                  return true
                }

                return false
              })
            })
          })

          console.log('set new cached data', cachedData)

          queryClient.setQueryData<UISnippet[]>([QUERY_KEY], cachedData)
          // #endregion modify cache
        } catch (error) {
          console.error('delete snippet onSuccess failed', error)
        }
      },
      onError() {
        toast({
          title: `Error deleting snippets`,
          description: `Failed to delete snippets for some reason...`,
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
    deleteSnippetMutation,
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
