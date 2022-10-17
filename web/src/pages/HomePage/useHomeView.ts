import { useEffect, useState, useRef, useCallback } from 'react'

import { useQuery, useInfiniteQuery } from '@tanstack/react-query'
import cuid from 'cuid'
import { ViewModelProps } from 'react-create-view'

import { mockSnippets } from '~/../mocks'
import { QUERY_KEY, useSnippetManager } from '~/hooks'
import { snippetPluginManager } from '~/plugins'
import { useStore } from '~/state'
import { ServiceTag, Snippet, SnippetMap, UISnippet } from '~/types'
import { emitter, getEntries, getKeys, InfiniteQueryAdapter } from '~/utils'

export type HomeViewSuccessModel = {
  selectedSnippet: UISnippet | null
  infiniteQuery: InfiniteQueryAdapter<UISnippet>
  onDelete(snippet: UISnippet): void
  onEdit(snippet: UISnippet): void
  onToggleCode(isOpen: boolean): void
  /** called when user starts cloning process for a snippet */
  onStartCloning(snippet: UISnippet): void
  /** called when user completes cloning process for a snippet */
  onFinishCloning(snippet: UISnippet, services: ServiceTag[]): void
}

type HomeViewModelProps = ViewModelProps<HomeViewSuccessModel>

const IS_DEBUG = false

/**
 * This is where the magic happens!
 * Hook up biz logic to UI models.
 * Listen for `getSnippets` event and refetch query.
 * Reduce `SnippetMap` down to UI models.
 */
export const useHomeView = (): HomeViewModelProps => {
  const [perPage] = useState(5) // TODO: create UI

  const pageRef = useRef(1)
  const setSnippet = useStore((store) => store.setSnippet)
  const selectedSnippet = useStore((store) => store.snippet)
  const { deleteSnippetMutation, createSnippetMutation } = useSnippetManager()

  const query = useInfiniteQuery(
    [QUERY_KEY],
    async () => {
      console.log('home page getting snippets')

      if (IS_DEBUG) {
        return {} as SnippetMap
      }

      const snippetMap = await snippetPluginManager.getSnippets({
        page: pageRef.current,
        perPage,
      })

      return snippetMap
    },
    {
      // dont want to abuse service apis. staleTime is longer than usual.
      // cacheTime is infinite to preserve data. will manage cache on operations
      cacheTime: Infinity,
      staleTime: 1000 * 60 * 30,
      // my page params are just numbers like page 1, 2, 3, ...
      getNextPageParam: (lastPage, pages) => {
        // we know there might be a next page if one of the services still returned some snippets
        const hasNextPage = getEntries(lastPage).some(([service, snippets]) => {
          if (snippets.length) {
            console.log(`service ${service} still has snippets to fetch`)
            return true
          }
        })
        const currPage = pageRef.current

        console.log({ hasNextPage, currPage })

        if (hasNextPage) {
          // NOTE: we actually increment pageRef when `fetchNextPage` is called as `getNextPageParam` can get spammed and called many times...
          const nextPage = currPage + 1
          console.log(`next page to fetch will be: ${nextPage}`)

          return nextPage
        }
      },
    }
  )

  const fetchNextPage = useCallback(() => {
    console.log(`fetching page: ${++pageRef.current}`)
    query.fetchNextPage()
  }, [])

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

  console.log('raw infinite query data', query.data)

  // reduce each pages snippet map into one big array
  let combinedSnippets: Snippet[] = query.data.pages?.reduce((accum, page) => {
    const pageCombinedSnippets = getKeys(page).reduce<Snippet[]>(
      (accum, key) => {
        return accum.concat(page[key])
      },
      []
    )

    return accum.concat(pageCombinedSnippets)
  }, [])

  if (IS_DEBUG) combinedSnippets = mockSnippets

  // reduce combined snippets array into a map of UI Snippets where the key is the contents to make it unique by contents
  const snippetsMapByContents = combinedSnippets.reduce<
    Record<string, UISnippet>
  >((accum, currSnippet) => {
    const { contents } = currSnippet
    // format contents from service apis. it returns data with `\\n` and double backslashes cause probs in code editor component. format to `\n`
    const formattedContents = currSnippet.contents.split('\\n').join('\n')

    // snippet isnt present in accum
    if (!accum[contents]) {
      accum[contents] = {
        ...currSnippet,
        id: cuid(), // give ui snippets a stable id
        isPublic: currSnippet.privacy === 'public',
        services: [currSnippet.service],
        contents: formattedContents,
        contentsShort: formattedContents.split('\n').slice(0, 10).join('\n'),
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
  console.log('ui snippets array', uiSnippets)

  if (!uiSnippets.length) {
    return {
      status: 'empty',
    }
  }

  return {
    status: 'success',
    model: {
      selectedSnippet,
      infiniteQuery: {
        hasNextPage: query.hasNextPage || false,
        isNextPageLoading: query.isLoading,
        items: uiSnippets,
        fetchNextPage,
      },
      async onDelete(snippet) {
        if (!confirm(`Delete snippet "${snippet.title}"?`)) {
          return
        }

        await deleteSnippetMutation.mutateAsync(snippet)
      },
      async onEdit(snippet) {
        setSnippet(snippet)
      },
      onToggleCode(isOpen) {
        emitter.emit('toggleCode', { isOpen })
      },
      onStartCloning(snippet) {
        setSnippet(snippet)
      },
      // TODO: improve with passing loading status
      async onFinishCloning(snippet, services) {
        console.log('make cloning service call', { snippet, services })

        // cloning just delegates to create for specified services
        await createSnippetMutation.mutateAsync({
          input: snippet,
          services,
        })
      },
    },
  }
}
