import {
  Container,
  Stack,
  useColorModeValue,
  HStack,
  Link as ChakraLink,
  Heading,
  Text,
  VStack,
  Box,
  Avatar,
  Tag,
  TagLeftIcon,
  TagLabel,
} from '@chakra-ui/react'
import SyntaxHighlighter from 'react-syntax-highlighter'

import { FILE_UI_MAP, SERVICES_MAP } from '~/app-constants'
import { UISnippet } from '~/types'
import { getCodeLanguage, getKnownFileExtension } from '~/utils'

type SnippetProps = UISnippet & {}

export const Snippet = (props: SnippetProps) => {
  const {
    contents,
    createdAt,
    description,
    filename,
    privacy,
    services,
    title,
    updatedAt,
    servicesMap,
  } = props
  console.log(props)

  const boxShadow = useColorModeValue('sm', 'sm-dark')

  const fileExtension = getKnownFileExtension(filename)
  const FileIcon = FILE_UI_MAP[fileExtension].Icon

  const createdAtString = createdAt.toLocaleString()
  const updatedAtString = updatedAt.toLocaleString()
  const showUpdatedAt = createdAtString !== updatedAtString

  return (
    <Box>
      <Box as="section" py={{ base: '4', md: '8' }}>
        <Container maxW="3xl">
          <Box
            bg="bg-surface"
            boxShadow={boxShadow}
            borderRadius="lg"
            p={{ base: '4', md: '6' }}
          >
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

                <Text color="muted">TODO</Text>
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
              <HStack>
                {services.map((svc) => {
                  const mapping = servicesMap[svc]
                  return (
                    <ChakraLink key={svc} href={mapping.url} isExternal>
                      <Tag>
                        <TagLeftIcon
                          boxSize="12px"
                          as={SERVICES_MAP[svc].Icon}
                        />
                        <TagLabel>{svc}</TagLabel>
                      </Tag>
                    </ChakraLink>
                  )
                })}
              </HStack>

              <VStack align="start">
                <SyntaxHighlighter
                  language={getCodeLanguage(fileExtension)}
                  showLineNumbers
                  // NOTE: if want to wrap code, disable these styles and enable wrap props
                  customStyle={{
                    width: '100%',
                    overflowX: 'scroll',
                  }}
                  // wrapLongLines
                >
                  {contents.split('\\n').join('\n')}
                </SyntaxHighlighter>
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
          </Box>
        </Container>
      </Box>
    </Box>
  )
}
