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
  UISnippet,
} from '~/types'
import { isEmpty } from '~/utils'

type CloneSnippetDrawerProps = DrawerProps & {
  snippet: UISnippet
  selectedServices: ServiceTag[]
  registeredServices: ServiceTag[]
  setSelectedServices(services: ServiceTag[]): void
  cloneSnippetMutation: MutationAdapter<
    Awaited<ReturnType<ISnippetPluginManager['createSnippet']>>,
    unknown,
    { input: UISnippet; services: ServiceTag[] }
  >
}

export const CloneSnippetDrawer = ({
  isOpen,
  onClose,
  snippet,
  selectedServices,
  registeredServices,
  setSelectedServices,
  cloneSnippetMutation,
}: CloneSnippetDrawerProps) => {
  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="full">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Clone Snippet</DrawerHeader>

        <DrawerBody p={50}>
          <VStack align="start">
            <Text>
              By default, the snippet will be cloned for all services with a PAT
              entered. If you want to only clone the snippet for specific
              services, select them below.
            </Text>

            <Spacer size={24} />

            <ServiceSelector
              alreadyServices={snippet.services}
              allServices={registeredServices}
              selectedServices={selectedServices}
              onSelect={setSelectedServices}
            />

            <Spacer size={24} />

            <ButtonGroup spacing="6">
              <Button
                isLoading={cloneSnippetMutation.isLoading}
                onClick={() => {
                  cloneSnippetMutation.mutate({
                    input: snippet,
                    services: isEmpty(selectedServices)
                      ? registeredServices.filter(
                          (svc) => !snippet.services.includes(svc),
                        )
                      : selectedServices,
                  })
                }}
              >
                Clone
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
