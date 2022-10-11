import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { FatalErrorBoundary, RedwoodProvider } from '@redwoodjs/web'
import { RedwoodApolloProvider } from '@redwoodjs/web/apollo'

import FatalErrorPage from 'src/pages/FatalErrorPage'
import Routes from 'src/Routes'

import './index.css'
import { useInitApp } from './hooks'
import { theme } from './styles'

const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      retry: false,
    },
    queries: {
      retry: false,
    },
  },
})

const App = () => {
  useInitApp()

  return (
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  )
}

export default App
