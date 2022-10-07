import { Button } from '@chakra-ui/react'

import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'

import MainLayout from 'src/layouts/MainLayout/MainLayout'

const HomePage = () => {
  return (
    <MainLayout>
      <MetaTags title="Home" description="Home page" />

      <h1>HomePage</h1>
      <Button>test</Button>
    </MainLayout>
  )
}

export default HomePage
