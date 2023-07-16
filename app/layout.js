import './globals.css'
import { Link } from '@chakra-ui/next-js'

import { ChakraProvider, extendTheme  } from '@chakra-ui/react'
import { CacheProvider } from '@chakra-ui/next-js'
import { Flex,Text } from '@chakra-ui/react'

const colors = {
  brand: {
    900: '#1a365d',
    800: '#153e75',
    700: '#2a69ac',
  },
}
export const theme = extendTheme({ colors })

export const metadata = {
  title: 'Premium Fresh Fruits',
  description: 'Point of Sale Application',
}

export default function RootLayout({ children }) {
  return (
      <html lang="en">
        <body>
        <CacheProvider>
          <ChakraProvider theme={theme}>
          <Flex p={2} direction="column" width="100vw" height="100%" align="center" justify="flex-start">
          <header>
            <Flex direction="column" width="100vw" height="80px" align="center" justify="space-apart">
              <Flex p={2} width="100vw" direction="row" justify='center'>
              <Text fontSize={24} fontWeight="bold" textAlign="center">Premium Fresh Fruits POS System</Text>
              </Flex>
              <Flex p={2} width="20vw" direction="row" justify="space-around">
                <Link href="/"  color='blue.400' _hover={{ color: 'blue.500' }}>View Cart</Link>
                <Link href="/orders" color='blue.400' _hover={{ color: 'blue.500' }}>View Orders</Link>
                </Flex>
            </Flex>
          </header>
          <main>
          <Flex p={2} direction="column" width="100vw" minHeight="300px" align="center" justify="flex-start">
            {children}
          </Flex>
          </main>
          <footer>Premium Fresh Fruits &copy; 2023 </footer>
          </Flex>
          </ChakraProvider>
          </CacheProvider>
        </body>
      </html>
  )
}
