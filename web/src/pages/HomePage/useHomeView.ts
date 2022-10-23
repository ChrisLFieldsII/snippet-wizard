import { useEffect, useState, useRef, useCallback } from 'react'

import { useToast } from '@chakra-ui/react'
import { useInfiniteQuery } from '@tanstack/react-query'
import cuid from 'cuid'
import { ViewModelProps } from 'react-create-view'
import shallow from 'zustand/shallow'

import { mockSnippets } from '~/../mocks'
import { QUERY_KEY, useServices, useSnippetManager } from '~/hooks'
import { snippetPluginManager } from '~/plugins'
import { useStore } from '~/state'
import {
  Drawers,
  DrawerType,
  ISnippetPluginManager,
  MutationAdapter,
  ServiceTag,
  Snippet,
  SnippetManagerCreateInput,
  SnippetManagerUpdateInput,
  SnippetMap,
  UISnippet,
} from '~/types'
import {
  emitter,
  getEntries,
  getKeys,
  InfiniteQueryAdapter,
  mutationAdapter,
} from '~/utils'

/** max # of LOC to display for code editors in list view */
const MAX_LOC_TO_DISPLAY = 10

export type HomeViewSuccessModel = {
  isEmpty: boolean
  selectedSnippet: UISnippet | null
  infiniteQuery: InfiniteQueryAdapter<UISnippet>
  onDelete(snippet: UISnippet): void
  onEdit(snippet: UISnippet): void
  /** called when user starts cloning process for a snippet */
  onStartCloning(snippet: UISnippet): void
  createSnippetMutation: MutationAdapter<
    Awaited<ReturnType<ISnippetPluginManager['createSnippet']>>,
    unknown,
    SnippetManagerCreateInput
  >
  updateSnippetMutation: MutationAdapter<
    Awaited<ReturnType<ISnippetPluginManager['updateSnippet']>>,
    unknown,
    SnippetManagerUpdateInput
  >
  deleteSnippetMutation: MutationAdapter<
    Awaited<ReturnType<ISnippetPluginManager['deleteSnippet']>>,
    unknown,
    Partial<Record<ServiceTag, { id: string }>>
  >
  drawers: Drawers<DrawerType>
  userServices: ReturnType<typeof useServices>
}

type HomeViewModelProps = ViewModelProps<
  HomeViewSuccessModel,
  {},
  {},
  HomeViewSuccessModel
>

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
  // console.log(`page is ${pageRef.current}`)
  const setSnippet = useStore((store) => store.setSnippet)
  const selectedSnippetNullable = useStore((store) => store.snippet)
  const selectedSnippet: UISnippet = (() => {
    if (selectedSnippetNullable) return selectedSnippetNullable

    return {
      contents: '',
      contentsShort: '',
      createdAt: new Date(),
      description: '',
      filename: '',
      hasMoreContentsToDisplay: false,
      id: '',
      isPublic: false,
      privacy: 'private',
      services: [],
      servicesMap: {},
      title: '',
      updatedAt: new Date(),
    }
  })()
  const drawers: HomeViewSuccessModel['drawers'] = useStore(
    (store) => ({
      drawer: store.drawer,
      closeDrawer: store.closeDrawer,
      openDrawer: store.openDrawer,
    }),
    shallow,
  )

  const userServices = useServices()

  const {
    deleteSnippetMutation,
    createSnippetMutation,
    updateSnippetMutation,
  } = useSnippetManager()

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
      refetchOnWindowFocus: false,
      // my page params are just numbers like page 1, 2, 3, ...
      getNextPageParam: (lastPage) => {
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
    },
  )

  const fetchNextPage = useCallback(async () => {
    console.log(`fetching page: ${++pageRef.current}`)
    await query.fetchNextPage()
  }, [])

  useEffect(() => {
    return emitter.on('getSnippets', () => {
      pageRef.current = 1 // TODO: should we refetch from page 1

      query.refetch()
    })
  }, [query])

  console.log('raw infinite query data', query.data)

  // reduce each pages snippet map into one big array
  let combinedSnippets: Snippet[] =
    query.data?.pages?.reduce((accum, page) => {
      const pageCombinedSnippets = getKeys(page).reduce<Snippet[]>(
        (accum, key) => {
          return accum.concat(page[key])
        },
        [],
      )

      return accum.concat(pageCombinedSnippets)
    }, []) || []

  if (IS_DEBUG) combinedSnippets = mockSnippets

  // reduce combined snippets array into a map of UI Snippets where the key is the contents to make it unique by contents
  const snippetsMapByContents = combinedSnippets.reduce<
    Record<string, UISnippet>
  >((accum, currSnippet) => {
    const { contents } = currSnippet
    // format contents from service apis. it returns data with `\\n` and double backslashes cause probs in code editor component. format to `\n`
    const formattedContents = currSnippet.contents.split('\\n').join('\n')
    const linesArr = formattedContents.split('\n')

    // snippet isnt present in accum
    if (!accum[contents]) {
      accum[contents] = {
        ...currSnippet,
        id: cuid(), // give ui snippets a stable id
        isPublic: currSnippet.privacy === 'public',
        services: [currSnippet.service],
        contents: formattedContents,
        contentsShort: linesArr.slice(0, MAX_LOC_TO_DISPLAY).join('\n'),
        hasMoreContentsToDisplay: linesArr.length > MAX_LOC_TO_DISPLAY,
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
      // some services (github) dont use a description, so dont overwrite description if its empty
      if (currSnippet.description) {
        accum[contents].description = currSnippet.description
      }

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

  const toast = useToast()

  useEffect(() => {
    return emitter.on('clickedCreate', () => {
      if (userServices.registeredServices.length) {
        drawers.openDrawer('create-snippet')
      } else {
        toast({
          status: 'warning',
          title: 'Warning',
          description:
            'You must enter a token for a service to create snippets',
          position: 'top',
        })
      }
    })
  }, [userServices.registeredServices.length])

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

  const isEmpty = !uiSnippets.length

  return {
    status: 'success',
    model: {
      isEmpty,
      selectedSnippet,
      infiniteQuery: {
        hasNextPage: query.hasNextPage || false,
        isNextPageLoading: query.isLoading,
        items: uiSnippets,
        fetchNextPage,
      },
      async onDelete(snippet) {
        setSnippet(snippet)
        drawers.openDrawer('delete-snippet')
      },
      async onEdit(snippet) {
        setSnippet(snippet)
        drawers.openDrawer('update-snippet')
      },
      onStartCloning(snippet) {
        setSnippet(snippet)
        drawers.openDrawer('clone-snippet')
      },
      createSnippetMutation: mutationAdapter(createSnippetMutation),
      updateSnippetMutation: mutationAdapter(updateSnippetMutation),
      deleteSnippetMutation: mutationAdapter(deleteSnippetMutation),
      drawers: {
        ...drawers,
        closeDrawer() {
          drawers.closeDrawer()
          userServices.setSelectedServices([]) // need to clear selected services when closing drawer to prevent bugs on snippet creation
        },
      },
      userServices,
    },
  }
}
