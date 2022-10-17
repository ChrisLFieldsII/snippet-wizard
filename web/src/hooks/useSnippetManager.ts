import { useEffect } from 'react'

import { useToast } from '@chakra-ui/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import produce from 'immer'

import { SERVICE_TAGS } from '~/app-constants'
import { snippetPluginManager } from '~/plugins'
import {
  CreateSnippetInput,
  ServiceTag,
  SnippetManagerUpdateInput,
  SnippetMap,
  SnippetMutationResponse,
  UISnippet,
} from '~/types'
import { getEntries } from '~/utils'

export const QUERY_KEY = 'snippets'

// FIXME: cache updates need to account for infinite query structure
export const useSnippetManager = () => {
  const toast = useToast()
  const queryClient = useQueryClient()

  useEffect(() => {
    window.queryClient = queryClient
  }, [])

  const createSnippetMutation = useMutation(
    async ({
      input,
      services = SERVICE_TAGS,
    }: {
      input: CreateSnippetInput
      services?: ServiceTag[]
    }) => {
      return snippetPluginManager.createSnippet({
        input,
        services,
      })
    },
    {
      onSuccess(data) {
        cleanData(data)

        console.log('create snippet mutation on success data', data)

        try {
          let cachedData = queryClient.getQueryData<SnippetMap>([QUERY_KEY])
          console.log('cached data', cachedData)

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

          getEntries(data).forEach(([service, createRes]) => {
            if (!createRes.isSuccess) {
              return
            }

            cachedData = produce<SnippetMap>(cachedData, (draft) => {
              const createdSnippet = data[service].data?.snippet
              if (createdSnippet) {
                draft[service].push(createdSnippet)
              }
            })

            console.log('set new cached data', cachedData)

            queryClient.setQueryData<SnippetMap>([QUERY_KEY], cachedData)
          })
        } catch (error) {
          console.error('create snippet onSuccess failed', error)
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

  const updateSnippetMutation = useMutation(
    async (input: SnippetManagerUpdateInput) => {
      return snippetPluginManager.updateSnippet(input)
    },
    {
      onSuccess(data) {
        cleanData(data)

        try {
          let cachedData = queryClient.getQueryData<SnippetMap>([QUERY_KEY])
          console.log('cached data', cachedData)

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

          getEntries(data).forEach(([service, updateRes]) => {
            if (!updateRes.isSuccess) {
              return
            }

            cachedData = produce<SnippetMap>(cachedData, (draft) => {
              const updatedIndex = draft[service].findIndex(
                (currSnippet) => currSnippet.id === updateRes.data?.snippet?.id
              )
              if (updatedIndex === -1) return

              console.log(
                `updating cache, service ${service} at index ${updatedIndex}`
              )
              draft[service][updatedIndex] = updateRes.data!.snippet!
            })
          })

          console.log('set new cached data', cachedData)

          queryClient.setQueryData<SnippetMap>([QUERY_KEY], cachedData)
        } catch (error) {
          console.error('update snippet onSuccess failed', error)
        }
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
        cleanData(data)

        try {
          // #region modify cache
          // modify cached data w/ deleted ids and set new cached data
          let cachedData = queryClient.getQueryData<SnippetMap>([QUERY_KEY])
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

            cachedData = produce<SnippetMap>(cachedData, (draft) => {
              draft[service] = draft[service].filter(
                (currSnippet) => currSnippet.id !== idToDelete
              )
            })
          })

          console.log('set new cached data', cachedData)

          queryClient.setQueryData<SnippetMap>([QUERY_KEY], cachedData)
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

// clean undefined from data. createRes can be undefined for example in cloning process
const cleanData = (data: Record<ServiceTag, SnippetMutationResponse>) => {
  getEntries(data).forEach(([service, createRes]) => {
    if (!createRes) {
      delete data[service]
    }
  })
}
