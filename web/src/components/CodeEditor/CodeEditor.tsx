import { useMemo } from 'react'

import { Flex } from '@chakra-ui/react'
import { Extension } from '@codemirror/state'
import { langs } from '@uiw/codemirror-extensions-langs'
import CodeMirror from '@uiw/react-codemirror'

import { FILE_UI_MAP } from '~/app-constants'
import { getKnownFileExtension, noop } from '~/utils'

type CodeEditorProps = {
  /** the code string */
  code: string
  setCode?(code: string): void
  filename: string
  isEditable?: boolean
  placeholder?: string
  renderHeader?(): React.ReactNode
}

export const CodeEditor = (props: CodeEditorProps) => {
  const {
    code,
    setCode = noop,
    filename,
    isEditable = false,
    placeholder = `console.log('time to enter some sweet code')`,
  } = props

  const fileExtension = getKnownFileExtension(filename)
  const fileMapping = FILE_UI_MAP[fileExtension]

  const extensions: Extension[] = useMemo(() => {
    if (!filename) return [langs.markdown()]
    return [langs[fileMapping.language]()]
  }, [fileExtension, filename])

  const renderHeader = () => {
    if (!props.renderHeader) return null

    return props.renderHeader()
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
