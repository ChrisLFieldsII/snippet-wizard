import { useEffect } from 'react'

import {
  Container,
  Stack,
  HStack,
  Heading,
  Text,
  VStack,
  Box,
  Avatar,
  Tag,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  useDisclosure,
  Menu,
  MenuList,
  MenuItem,
  MenuButton,
  IconButton,
} from '@chakra-ui/react'
import { AiFillEdit } from 'react-icons/ai'
import { FaTrash } from 'react-icons/fa'
import { FiMoreHorizontal } from 'react-icons/fi'
import { IoDuplicate } from 'react-icons/io5'

import { Link, routes } from '@redwoodjs/router'

import { Card } from '../Card/Card'
import { CodeEditor } from '../CodeEditor/CodeEditor'
import { ServiceBadgesWithLinks } from '../ServiceBadges/ServiceBadges'

import { FILE_UI_MAP } from '~/app-constants'
import { UISnippet } from '~/types'
import { emitter, getKnownFileExtension } from '~/utils'

type SnippetProps = UISnippet & {
  onDelete(snippet: UISnippet): void
  onEdit(snippet: UISnippet): void
  onClone(snippet: UISnippet): void
}

export const Snippet = (props: SnippetProps) => {
  const {
    contents,
    createdAt,
    description,
    filename,
    privacy,
    title,
    updatedAt,
    servicesMap,
    onDelete,
    onEdit,
    onClone,
  } = props

  const codeDisclosure = useDisclosure({
    defaultIsOpen: true,
  })

  const fileExtension = getKnownFileExtension(filename)
  const FileIcon = FILE_UI_MAP[fileExtension].Icon

  const createdAtString = createdAt.toLocaleString()
  const updatedAtString = updatedAt.toLocaleString()
  const showUpdatedAt = createdAtString !== updatedAtString

  useEffect(() => {
    return emitter.on('toggleCode', ({ isOpen }) => {
      isOpen ? codeDisclosure.onOpen() : codeDisclosure.onClose()
    })
  }, [codeDisclosure])

  return (
    <Box>
      <Box as="section" py={{ base: '4', md: '8' }}>
        <Container maxW="3xl">
          <Card>
            <Stack fontSize="sm" px="4" spacing="4">
              <Stack direction="row" justify="space-between" spacing="4">
                <HStack spacing="3">
                  <Avatar boxSize="10" icon={<FileIcon />} />
                  <VStack spacing={1} alignItems="start">
                    <Tag textTransform={'uppercase'} size={'sm'}>
                      {privacy}
                    </Tag>
                    <Heading as="h6" size="xs">
                      {title || '<No Title Found>'}
                    </Heading>

                    <Text color="muted">{filename}</Text>
                  </VStack>
                </HStack>

                {/* snippet actions */}
                <Menu>
                  <MenuButton
                    as={IconButton}
                    aria-label="Options"
                    icon={<FiMoreHorizontal />}
                    variant="outline"
                  />
                  <MenuList>
                    <MenuItem
                      as={Link}
                      to={routes.updateSnippet()}
                      icon={<AiFillEdit size={16} />}
                      onClick={() => onEdit(props)}
                    >
                      Edit
                    </MenuItem>

                    <MenuItem
                      icon={<IoDuplicate size={16} />}
                      onClick={() => onClone(props)}
                    >
                      Clone
                    </MenuItem>

                    <MenuItem
                      color={'red'}
                      icon={<FaTrash size={16} />}
                      onClick={() => onDelete(props)}
                    >
                      Delete
                    </MenuItem>
                  </MenuList>
                </Menu>
              </Stack>

              <Text
                color="muted"
                sx={{
                  '-webkit-box-orient': 'vertical',
                  '-webkit-line-clamp': '2',
                  overflow: 'hidden',
                  display: '-webkit-box',
                }}
              >
                {description}
              </Text>

              {/* services badges */}
              <ServiceBadgesWithLinks servicesMap={servicesMap} />

              <VStack align="start">
                <Accordion
                  w="full"
                  borderColor="transparent"
                  index={codeDisclosure.isOpen ? 0 : 1}
                >
                  <AccordionItem>
                    <h2>
                      <AccordionButton onClick={codeDisclosure.onToggle}>
                        <Box flex="1" textAlign="left">
                          <Text color="muted" fontSize={'xs'}>
                            {`${codeDisclosure.isOpen ? 'Close' : 'Open'} code`}
                          </Text>
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel>
                      <CodeEditor code={contents} filename={filename} />
                    </AccordionPanel>
                  </AccordionItem>
                </Accordion>
              </VStack>

              <VStack alignItems={'end'}>
                <VStack alignItems={'start'}>
                  <Text
                    color="muted"
                    fontSize={'0.8em'}
                  >{`Created at ${createdAtString}`}</Text>
                  {showUpdatedAt ? (
                    <Text
                      color="muted"
                      fontSize={'0.8em'}
                    >{`Updated at ${updatedAtString}`}</Text>
                  ) : null}
                </VStack>
              </VStack>
            </Stack>
          </Card>
        </Container>
      </Box>
    </Box>
  )
}
