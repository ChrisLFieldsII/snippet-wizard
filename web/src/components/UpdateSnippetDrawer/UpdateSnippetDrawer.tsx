import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from '@chakra-ui/react'

import {
  SnippetForm,
  SnippetFormProps,
  Spacer,
  ServiceBadgesWithLinks,
} from '~/components'
import { DrawerProps, UISnippet } from '~/types'

type UpdateSnippetDrawerProps = DrawerProps &
  SnippetFormProps & {
    snippet: UISnippet
  }

export const UpdateSnippetDrawer = ({
  isOpen,
  onClose,
  snippet,
  ...props
}: UpdateSnippetDrawerProps) => {
  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="full">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Update Snippet</DrawerHeader>

        <DrawerBody p={50}>
          {isOpen ? (
            <ServiceBadgesWithLinks servicesMap={snippet.servicesMap} />
          ) : null}

          <Spacer size={40} />

          <SnippetForm {...props} />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}
