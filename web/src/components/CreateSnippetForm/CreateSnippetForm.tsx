import { useEffect } from 'react'

import {
  VStack,
  Button,
  FormControl,
  FormLabel,
  Switch,
} from '@chakra-ui/react'
import { useFormik } from 'formik'

import { Card } from '../Card/Card'
import { CodeEditor } from '../CodeEditor/CodeEditor'
import { Input } from '../Input/Input'

import { FormProps, SnippetPrivacy } from '~/types'
import { noop, reduceObjectToString } from '~/utils'

type CreateSnippetFormValues = {
  title: string
  description?: string
  filename: string
  code: string
  privacy: SnippetPrivacy
}
type CreateSnippetFormProps = FormProps<CreateSnippetFormValues>

const defaultValues: CreateSnippetFormValues = {
  title: '',
  description: '',
  filename: '',
  code: '',
  privacy: 'private' as SnippetPrivacy,
}

export const CreateSnippetForm = ({
  initValues = defaultValues,
  onSave = noop,
  onUpdate = noop,
}: CreateSnippetFormProps) => {
  const { handleSubmit, handleChange, setFieldValue, values } = useFormik({
    initialValues: {
      ...defaultValues,
      ...initValues,
    },
    onSubmit: (values) => {
      onSave(values)
    },
  })

  const { code, description, filename, privacy, title } = values

  const updateString = reduceObjectToString(values)
  useEffect(() => {
    onUpdate(values)
  }, [updateString])

  return (
    // @ts-ignore
    <Card as="form" p={10} onSubmit={handleSubmit}>
      <VStack spacing={12} align="start">
        <Input
          id="title"
          label="Title"
          value={title}
          isRequired
          onChange={handleChange}
        />

        <Input
          id="description"
          label="Description"
          value={description}
          onChange={handleChange}
        />

        <CodeEditor
          isEditable
          showHeader
          code={code}
          filename={filename}
          setFilename={(newFilename) => setFieldValue('filename', newFilename)}
          setCode={(newCode) => setFieldValue('code', newCode)}
        />

        <FormControl display="flex" alignItems="center">
          <FormLabel htmlFor="privacy" mb="0">
            Make snippet public?
          </FormLabel>

          <Switch
            id="privacy"
            checked={privacy === 'public'}
            onChange={(e) =>
              setFieldValue(
                'privacy',
                e.currentTarget.checked ? 'public' : 'private'
              )
            }
          />
        </FormControl>

        <Button type="submit">Create Snippet</Button>
      </VStack>
    </Card>
  )
}

export default CreateSnippetForm
