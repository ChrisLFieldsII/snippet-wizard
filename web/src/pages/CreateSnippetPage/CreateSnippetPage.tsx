import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'

import CreateSnippetForm from '~/components/CreateSnippetForm/CreateSnippetForm'
import MainLayout from '~/layouts/MainLayout/MainLayout'

const CreateSnippetPage = () => {
  return (
    <>
      <MetaTags title="CreateSnippet" description="CreateSnippet page" />

      <MainLayout>
        <CreateSnippetForm onUpdate={console.log} onSave={console.log} />
      </MainLayout>
    </>
  )
}

export default CreateSnippetPage
