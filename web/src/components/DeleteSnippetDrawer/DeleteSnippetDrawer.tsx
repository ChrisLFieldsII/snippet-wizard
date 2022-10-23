import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  VStack,
  Text,
  ButtonGroup,
  Button,
} from '@chakra-ui/react'

import { ServiceSelector, Snippet, Spacer } from '~/components'
import {
  DrawerProps,
  ISnippetPluginManager,
  MutationAdapter,
  ServiceTag,
  SnippetManagerDeleteInput,
  UISnippet,
} from '~/types'
import { getEntries, isEmpty } from '~/utils'

type DeleteSnippetDrawerProps = DrawerProps & {
  snippet: UISnippet
  selectedServices: ServiceTag[]
  setSelectedServices(services: ServiceTag[]): void
  deleteSnippetMutation: MutationAdapter<
    Awaited<ReturnType<ISnippetPluginManager['deleteSnippet']>>,
    unknown,
    Partial<Record<ServiceTag, { id: string }>>
  >
}

export const DeleteSnippetDrawer = ({
  isOpen,
  onClose,
  snippet,
  selectedServices,
  setSelectedServices,
  deleteSnippetMutation,
}: DeleteSnippetDrawerProps) => {
  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="full">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Delete Snippet</DrawerHeader>

        <DrawerBody p={50}>
          <VStack align="start">
            <Text>
              By default, the snippet will be deleted for all services with a
              PAT entered. If you want to only delete the snippet for specific
              services, select them below.
            </Text>

            <Spacer size={24} />

            <ServiceSelector
              allServices={snippet.services}
              selectedServices={selectedServices}
              onSelect={setSelectedServices}
            />

            <Spacer size={24} />

            <ButtonGroup spacing="6">
              <Button
                colorScheme="red"
                isLoading={deleteSnippetMutation.isLoading}
                onClick={() => {
                  if (!confirm(`Delete snippet "${snippet.title}"?`)) {
                    return
                  }

                  deleteSnippetMutation.mutate(
                    isEmpty(selectedServices)
                      ? // if no selected services, delete snippet in all services
                        snippet.servicesMap
                      : // if selected services, filter out entries not in selected array
                        getEntries(snippet.servicesMap).reduce<
                          SnippetManagerDeleteInput['services']
                        >((accum, [service, mapping]) => {
                          if (selectedServices.includes(service)) {
                            accum[service] = mapping
                          }

                          return accum
                        }, {}),
                  )
                }}
              >
                Delete
              </Button>

              <Button onClick={onClose}>Cancel</Button>
            </ButtonGroup>

            <Snippet {...snippet} showMenu={false} />
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}
