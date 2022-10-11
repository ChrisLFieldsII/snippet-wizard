import { useMemo } from 'react'

import { Center, Flex, Text, Input as ChakraInput } from '@chakra-ui/react'
import { Extension } from '@codemirror/state'
import { langs } from '@uiw/codemirror-extensions-langs'
import CodeMirror from '@uiw/react-codemirror'

import { Card } from '../Card/Card'
import Input from '../Input/Input'

import { FILE_UI_MAP } from '~/app-constants'
import { getKnownFileExtension, noop } from '~/utils'

type CodeEditorProps = {
  /** the code string */
  code: string
  setCode?(code: string): void
  filename: string
  isEditable?: boolean
  placeholder?: string
  setFilename?(filename: string): void
  showHeader?: boolean
}

export const CodeEditor = (props: CodeEditorProps) => {
  const {
    code,
    setCode = noop,
    filename,
    isEditable = false,
    placeholder = `console.log('time to enter some sweet code')`,
    setFilename = noop,
    showHeader = false,
  } = props

  const fileExtension = getKnownFileExtension(filename)
  const fileMapping = FILE_UI_MAP[fileExtension]

  const extensions: Extension[] = useMemo(() => {
    if (!filename) return [langs.markdown()]
    return [langs[fileMapping.language]()]
  }, [fileExtension, filename])

  const renderHeader = () => {
    if (!showHeader) return null

    return (
      <Card p={2} flexDir={'row'} borderBottomRadius={0}>
        <ChakraInput
          id="filename"
          value={filename}
          onChange={(e) => setFilename(e.currentTarget.value)}
          size={'xs'}
          isRequired
          placeholder="enter filename with extension (example.ts)"
        />
      </Card>
    )
  }

  return (
    <Flex flexDir={'column'} w="full">
      {/* header */}
      {renderHeader()}

      <CodeMirror
        value={code}
        extensions={extensions}
        editable={isEditable}
        placeholder={placeholder}
        onChange={(newCode) => setCode(newCode)}
      />
    </Flex>
  )
}
