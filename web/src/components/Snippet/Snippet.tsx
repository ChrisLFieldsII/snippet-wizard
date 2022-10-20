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
  useDisclosure,
  Menu,
  MenuList,
  MenuItem,
  MenuButton,
  IconButton,
  Button,
  Spacer,
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
import { emitter, getKnownFileExtension, noop } from '~/utils'

type SnippetProps = UISnippet & {
  onDelete?(snippet: UISnippet): void
  onEdit?(snippet: UISnippet): void
  onClone?(snippet: UISnippet): void
  showMenu?: boolean
  defaultIsCodeOpen?: boolean
}

export const Snippet = (props: SnippetProps) => {
  const {
    contents,
    contentsShort,
    createdAt,
    description,
    filename,
    privacy,
    title,
    updatedAt,
    servicesMap,
    hasMoreContentsToDisplay,
    onDelete = noop,
    onEdit = noop,
    onClone = noop,
    showMenu = true,
    defaultIsCodeOpen = false,
  } = props

  const codeDisclosure = useDisclosure({
    defaultIsOpen: defaultIsCodeOpen,
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

  const renderCodeEditorHeader = () => {
    if (!hasMoreContentsToDisplay) return null

    return (
      <Card
        p={2}
        borderBottomRadius={0}
        w="full"
        display="flex"
        justifyContent={'end'}
      >
        <Spacer />
        <Button variant={'ghost'} size="xs" onClick={codeDisclosure.onToggle}>
          {`Show ${codeDisclosure.isOpen ? 'less' : 'more'} code`}
        </Button>
      </Card>
    )
  }

  return (
    <Box w="full">
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
                {showMenu ? (
                  <Menu>
                    <MenuButton
                      as={IconButton}
                      aria-label="Options"
                      icon={<FiMoreHorizontal />}
                      variant="outline"
                    />
                    <MenuList>
                      <MenuItem
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
                ) : null}
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

              <CodeEditor
                code={codeDisclosure.isOpen ? contents : contentsShort}
                filename={filename}
                renderHeader={renderCodeEditorHeader}
              />

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
