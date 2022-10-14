import { useEffect } from 'react'

import {
  VStack,
  Button,
  FormControl,
  FormLabel,
  Switch,
  ButtonGroup,
} from '@chakra-ui/react'
import { useFormik } from 'formik'

import { CodeEditor } from '../CodeEditor/CodeEditor'
import { Input } from '../Input/Input'

import { CreateSnippetInput, FormProps, SnippetPrivacy } from '~/types'
import { noop, reduceObjectToString } from '~/utils'

export type SnippetFormValues = CreateSnippetInput
type SnippetFormProps = FormProps<SnippetFormValues>

const defaultValues: SnippetFormValues = {
  title: '',
  description: '',
  filename: '',
  contents: '',
  privacy: 'private' as SnippetPrivacy,
}

export const SnippetForm = ({
  initValues = defaultValues,
  onSave = noop,
  onUpdate = noop,
}: SnippetFormProps) => {
  const formik = useFormik({
    initialValues: {
      ...defaultValues,
      ...initValues,
    },
    onSubmit: (values) => {
      onSave(values)
    },
  })

  const { contents, description, filename, privacy, title } = formik.values

  const updateString = reduceObjectToString(formik.values)
  useEffect(() => {
    onUpdate(formik.values)
  }, [updateString])

  /** clear form to default values */
  const clearForm = () => {
    formik.resetForm({
      values: defaultValues,
    })
  }

  return (
    <VStack
      spacing={12}
      align="start"
      as="form"
      // @ts-ignore
      onSubmit={formik.handleSubmit}
      onReset={formik.handleReset}
    >
      <Input
        id="title"
        label="Title"
        value={title}
        isRequired
        onChange={formik.handleChange}
      />

      <Input
        id="description"
        label="Description"
        value={description}
        onChange={formik.handleChange}
      />

      <CodeEditor
        isEditable
        showHeader
        code={contents}
        filename={filename}
        setFilename={(newFilename) =>
          formik.setFieldValue('filename', newFilename)
        }
        setCode={(newCode) => formik.setFieldValue('contents', newCode)}
      />

      <FormControl display="flex" alignItems="center">
        <FormLabel htmlFor="privacy" mb="0">
          Make snippet public?
        </FormLabel>

        <Switch
          id="privacy"
          checked={privacy === 'public'}
          onChange={(e) =>
            formik.setFieldValue(
              'privacy',
              e.currentTarget.checked ? 'public' : 'private'
            )
          }
        />
      </FormControl>

      <ButtonGroup>
        <Button type="submit">Submit</Button>
        <Button type="reset">Reset</Button>
        <Button type="button" onClick={clearForm}>
          Clear
        </Button>
      </ButtonGroup>
    </VStack>
  )
}

export default SnippetForm
