import { useEffect } from 'react'

import { useToast } from '@chakra-ui/react'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import produce from 'immer'
import { ViewModelProps } from 'react-create-view'

import { emitter, getEntries, getKeys, snippetPluginManager } from 'src/utils'

import { mockSnippets } from '~/../mocks'
import { ServiceTag, Snippet, SnippetMap, UISnippet } from '~/types'

export type HomeViewSuccessModel = {
  snippets: UISnippet[]
  onDelete(snippet: UISnippet): void
}

type HomeViewModelProps = ViewModelProps<HomeViewSuccessModel>

const IS_DEBUG = false
const QUERY_KEY = 'snippets'

/**
 * This is where the magic happens!
 * Hook up biz logic to UI models.
 * Listen for `getSnippets` event and refetch query.
 * Reduce `SnippetMap` down to UI models.
 */
export const useHomeView = (): HomeViewModelProps => {
  const toast = useToast()
  const query = useQuery(
    [QUERY_KEY],
    async () => {
      console.log('home page getting snippets')

      if (IS_DEBUG) {
        return {}
      }
      const snippetMap = snippetPluginManager.getSnippets()
      return snippetMap
    },
    {
      // dont want to abuse service apis. staleTime is longer than usual.
      // cacheTime is infinite to preserve data. will manage cache on operations
      cacheTime: Infinity,
      staleTime: 1000 * 60 * 30,
    }
  )
  const queryClient = useQueryClient()

  const onDeleteMutation = useMutation(
    async (snippet: UISnippet) => {
      const res = await snippetPluginManager.deleteSnippet({
        services: snippet.servicesMap,
      })
      console.log('deleted snippets response', res)

      return res
    },
    {
      onSuccess(data) {
        // #region modify cache
        // modify cached data w/ deleted ids and set new cached data
        let cachedData = queryClient.getQueryData<SnippetMap>([QUERY_KEY])
        console.log('cached data', cachedData)

        getEntries(data).forEach(([service, snippetRes]) => {
          if (!snippetRes.isSuccess) {
            toast({
              title: `Error deleting snippet`,
              description: `Failed to delete snippet for service ${service}`,
              status: 'error',
              position: 'top',
              isClosable: true,
            })
            return
          }

          cachedData = produce<SnippetMap>(cachedData, (draft) => {
            draft[service] = draft[service].filter(
              (currSnippet) => currSnippet.id !== snippetRes.data?.id
            )
          })
        })

        console.log('set new cached data', cachedData)

        queryClient.setQueryData<SnippetMap>([QUERY_KEY], cachedData)
        // #endregion modify cache

        const entries = getEntries(data)

        // if there were no failures, show success alert
        if (
          entries.filter(([_, response]) => !response.isSuccess).length == 0
        ) {
          toast({
            title: `Deleted snippets!`,
            description: `Snippets were deleted for each of your services`,
            status: 'success',
            position: 'top',
            isClosable: true,
          })
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

  useEffect(() => {
    return emitter.on('getSnippets', () => {
      query.refetch()
    })
  }, [query])

  if (query.isLoading) {
    return {
      status: 'loading',
    }
  }

  if (query.isError) {
    return {
      status: 'error',
    }
  }

  const snippetMap = query.data
  console.log('snippet map', snippetMap)

  // reduce snippet map into combined array of snippets
  let combinedSnippets: Snippet[] = getKeys(query.data).reduce<Snippet[]>(
    (accum, key) => {
      return accum.concat(snippetMap[key])
    },
    []
  )
  if (IS_DEBUG) combinedSnippets = mockSnippets

  // reduce combined snippets array into a map of UI Snippets where the key is the contents to make it unique by contents
  const snippetsMapByContents = combinedSnippets.reduce<
    Record<string, UISnippet>
  >((accum, currSnippet) => {
    const { contents } = currSnippet

    // snippet isnt present in accum
    if (!accum[contents]) {
      accum[contents] = {
        ...currSnippet,
        isPublic: currSnippet.privacy === 'public',
        services: [currSnippet.service],
        contents: currSnippet.contents.split('\\n').join('\n'), // format contents from service apis
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore - we are okay w/ a partial map here
        servicesMap: {
          [currSnippet.service]: {
            url: currSnippet.url,
            id: currSnippet.id,
          },
        },
      }
    } else {
      const { services } = accum[contents]
      // `Set` ensures uniqueness
      accum[contents].services = [
        ...new Set<ServiceTag>(services.concat(currSnippet.service)),
      ]
      accum[contents].description = currSnippet.description

      const mapping = accum[contents].servicesMap[currSnippet.service]
      if (mapping) {
        mapping.url = currSnippet.url
      } else {
        accum[contents].servicesMap[currSnippet.service] = {
          id: currSnippet.id,
          url: currSnippet.url,
        }
      }
    }

    return accum
  }, {})

  const uiSnippets = Object.values(snippetsMapByContents)
  console.log('ui snippets', uiSnippets)

  if (!uiSnippets.length) {
    return {
      status: 'empty',
    }
  }

  return {
    status: 'success',
    model: {
      snippets: uiSnippets,
      async onDelete(snippet) {
        if (!confirm(`Delete snippet "${snippet.title}"?`)) {
          return
        }

        await onDeleteMutation.mutateAsync(snippet)
      },
    },
  }
}
