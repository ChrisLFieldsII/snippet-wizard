import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  VStack,
  Text,
} from '@chakra-ui/react'

import { SnippetForm, SnippetFormProps, ServiceSelector } from '~/components'
import { useServices } from '~/hooks'
import { DrawerProps } from '~/types'

type CreateSnippetDrawerProps = DrawerProps &
  SnippetFormProps &
  ReturnType<typeof useServices>

export const CreateSnippetDrawer = ({
  isOpen,
  onClose,
  registeredServices,
  selectedServices,
  setSelectedServices,
  ...props
}: CreateSnippetDrawerProps) => {
  const renderExtra = () => {
    return (
      <VStack align="start">
        <Text>
          By default, the snippet will be created for all services with a PAT
          entered. If you want to only create the snippet for specific services,
          select them below.
        </Text>
        <ServiceSelector
          allServices={registeredServices}
          selectedServices={selectedServices}
          onSelect={setSelectedServices}
        />
      </VStack>
    )
  }

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="full">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Create Snippet</DrawerHeader>

        <DrawerBody p={50}>
          <SnippetForm {...props} renderExtra={renderExtra} />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}
