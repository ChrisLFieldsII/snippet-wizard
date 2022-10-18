import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from '@chakra-ui/react'

import { SnippetForm, SnippetFormProps } from '~/components'
import { DrawerProps } from '~/types'

type CreateSnippetDrawerProps = DrawerProps & SnippetFormProps & {}

export const CreateSnippetDrawer = ({
  isOpen,
  onClose,
  ...props
}: CreateSnippetDrawerProps) => {
  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="full">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Create Snippet</DrawerHeader>

        <DrawerBody p={50}>
          <SnippetForm {...props} />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}
