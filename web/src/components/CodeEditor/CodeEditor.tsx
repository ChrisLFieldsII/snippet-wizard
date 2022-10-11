import { useMemo } from 'react'

import { Center, Text } from '@chakra-ui/react'
import { Extension } from '@codemirror/state'
import { langs } from '@uiw/codemirror-extensions-langs'
import CodeMirror from '@uiw/react-codemirror'

import { FILE_UI_MAP } from '~/app-constants'
import { getKnownFileExtension } from '~/utils'

type CodeEditorProps = {
  /** the code string */
  code: string
  filename: string
  isEditable?: boolean
  placeholder?: string
}

const CodeEditor = (props: CodeEditorProps) => {
  const { code, filename, isEditable = false, placeholder } = props

  const fileExtension = getKnownFileExtension(filename)
  const fileMapping = FILE_UI_MAP[fileExtension]

  const extensions: Extension[] = useMemo(() => {
    if (!filename) return [langs.markdown()]
    return [langs[fileMapping.language]()]
  }, [fileExtension, filename])

  return (
    <CodeMirror
      value={code}
      extensions={extensions}
      editable={isEditable}
      placeholder={placeholder}
    />
  )
}

export default CodeEditor
