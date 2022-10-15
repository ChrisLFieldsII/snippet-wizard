import { useState } from 'react'

import {
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Divider,
} from '@chakra-ui/react'

import { ServiceSelector } from '../ServiceBadges/ServiceBadges'
import { Snippet } from '../Snippet/Snippet'
import { Spacer } from '../Spacer/Spacer'

import { SERVICE_TAGS } from '~/app-constants'
import { ServiceTag, UISnippet } from '~/types'

type CloneSnippetModalProps = {
  isOpen: boolean
  onClose(): void
  snippet: UISnippet
  onClone(snippet: UISnippet, services: ServiceTag[]): void
}

export const CloneSnippetModal = ({
  isOpen,
  snippet,
  onClone,
  ...props
}: CloneSnippetModalProps) => {
  /** the services selected for stuff like cloning */
  const [selectedServices, setSelectedServices] = useState<ServiceTag[]>([])
  console.log({ selectedServices })

  const onClose = () => {
    props.onClose()
    setSelectedServices([])
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="4xl"
      closeOnOverlayClick={false}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          Clone snippet
          <Text color="muted" fontSize={'md'}>
            Select the badges below to determine which services to clone your
            snippet too
          </Text>
        </ModalHeader>

        <ModalCloseButton />
        <ModalBody>
          <ServiceSelector
            allServices={SERVICE_TAGS}
            alreadyServices={snippet.services}
            selectedServices={selectedServices}
            onSelect={setSelectedServices}
          />

          <Spacer size={20} />

          <Divider />

          <Snippet {...snippet} defaultIsCodeOpen={false} showMenu={false} />
        </ModalBody>

        <ModalFooter>
          <Button mr={3} onClick={onClose}>
            Close
          </Button>

          <Button
            variant="ghost"
            onClick={() => onClone(snippet, selectedServices)}
            disabled={!selectedServices.length}
          >
            Clone Snippet
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
