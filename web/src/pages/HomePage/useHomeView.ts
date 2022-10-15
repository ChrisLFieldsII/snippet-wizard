import { useEffect } from 'react'

import { useQuery } from '@tanstack/react-query'
import cuid from 'cuid'
import { ViewModelProps } from 'react-create-view'

import { mockSnippets } from '~/../mocks'
import { QUERY_KEY, useSnippetManager } from '~/hooks'
import { snippetPluginManager } from '~/plugins'
import { useStore } from '~/state'
import { ServiceTag, Snippet, SnippetMap, UISnippet } from '~/types'
import { emitter, getKeys } from '~/utils'

export type HomeViewSuccessModel = {
  snippets: UISnippet[]
  selectedSnippet: UISnippet | null
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
  const setSnippet = useStore((store) => store.setSnippet)
  const selectedSnippet = useStore((store) => store.snippet)
  const { deleteSnippetMutation, createSnippetMutation } = useSnippetManager()

  const query = useQuery(
    [QUERY_KEY],
    async () => {
      console.log('home page getting snippets')

      if (IS_DEBUG) {
        return {} as SnippetMap
      }

      const snippetMap = await snippetPluginManager.getSnippets()
      console.log('snippet map', snippetMap)

      return snippetMap
    },
    {
      // dont want to abuse service apis. staleTime is longer than usual.
      // cacheTime is infinite to preserve data. will manage cache on operations
      cacheTime: Infinity,
      staleTime: 1000 * 60 * 30,
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

  // reduce snippet map into combined array of snippets
  let combinedSnippets: Snippet[] = getKeys(snippetMap).reduce<Snippet[]>(
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
        id: cuid(), // give ui snippets a stable id
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
      selectedSnippet,
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
