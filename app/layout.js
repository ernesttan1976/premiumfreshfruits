import './globals.css'
import Link from 'next/link'

import { Providers } from "./providers";
import { Text,Flex,Button } from './chakra/chakra'

export default function RootLayout({ children }) {
  return (
      <html lang="en">
        <body>
          <Providers>
          <Flex p={2} direction="column" width="100vw" height="100%" align="center" justify="flex-start">
          <header>
            <Flex direction="column" width="100vw" height="80px" align="center" justify="space-apart">
              <Flex p={2} width="100vw" direction="row" justify='center'>
              <Text fontSize={20} p={0} fontWeight="bold" textAlign="center">Premium Fresh Fruits POS System</Text>
              </Flex>
              <Flex p={2} width="20vw" height="80px" direction="row" justify="space-around">
                <Button size="sm" px={4}><Link href="/">View Cart</Link></Button>
                <Button size="sm" px={4}><Link href="/orders">View Orders</Link></Button>
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
          </Providers>
        </body>
      </html>
  )
}
