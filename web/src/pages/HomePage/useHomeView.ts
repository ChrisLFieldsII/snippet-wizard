import { useEffect } from 'react'

import { useQuery } from '@tanstack/react-query'
import { ViewModelProps } from 'react-create-view'

import { emitter, getKeys, snippetPluginManager } from 'src/utils'

import { mockSnippets } from '~/../mocks'
import { Snippet, UISnippet } from '~/types'

export type HomeViewSuccessModel = {
  snippets: UISnippet[]
}

type HomeViewModelProps = ViewModelProps<HomeViewSuccessModel>

const IS_DEBUG = true

/**
 * This is where the magic happens!
 * Hook up biz logic to UI models.
 * Listen for `getSnippets` event and refetch query.
 * Reduce `SnippetMap` down to UI models.
 */
export const useHomeView = (): HomeViewModelProps => {
  const query = useQuery(['snippets'], async () => {
    console.log('home page getting snippets')

    if (IS_DEBUG) {
      return {}
    }
    const snippetMap = snippetPluginManager.getSnippets()
    return snippetMap
  })

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
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore - we are okay w/ a partial map here
        servicesMap: {
          [currSnippet.service]: {
            url: currSnippet.url,
          },
        },
      }
    } else {
      accum[contents].services.push(currSnippet.service)

      const mapping = accum[contents].servicesMap[currSnippet.service]
      if (mapping) {
        mapping.url = currSnippet.url
      } else {
        accum[contents].servicesMap[currSnippet.service] = {
          url: currSnippet.url,
        }
      }
    }

    return accum
  }, {})

  const uiSnippets = Object.values(snippetsMapByContents)

  if (!uiSnippets.length) {
    return {
      status: 'empty',
    }
  }

  return {
    status: 'success',
    model: {
      snippets: uiSnippets,
    },
  }
}
