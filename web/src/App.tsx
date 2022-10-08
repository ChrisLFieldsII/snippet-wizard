import { useEffect } from 'react'

import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'

import { FatalErrorBoundary, RedwoodProvider } from '@redwoodjs/web'
import { RedwoodApolloProvider } from '@redwoodjs/web/apollo'

import FatalErrorPage from 'src/pages/FatalErrorPage'
import Routes from 'src/Routes'

import './index.css'
import { useInitStore } from './state'
import { theme } from './styles'

const App = () => {
  useInitStore()

  return (
    <FatalErrorBoundary page={FatalErrorPage}>
      <RedwoodProvider titleTemplate="%PageTitle | %AppTitle">
        <ColorModeScript />
        <ChakraProvider theme={theme}>
          <RedwoodApolloProvider>
            <Routes />
          </RedwoodApolloProvider>
        </ChakraProvider>
      </RedwoodProvider>
    </FatalErrorBoundary>
  )
}

export default App
