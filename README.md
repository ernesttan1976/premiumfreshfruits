## 1. Problem Statement 
Jenny is the owner of a fruit shop. She wants to create a simple POS (point of sales) system that can: 
- Input line items which contain product name (Apples, Bananas etc), and quantity of items that a customer is purchasing 
- Calculate the total price of purchase 
- Store the purchase as a database record 

## 2. Example use case: 
James would like to purchase four apples and two bananas. Jenny can easily input 2 line items, “apple x4 and banana x2” into the system Jenny is shown the total price of the items Jenny store this transaction into a database Optional: You may chose to add one bonus features that could help Jenny improve her POS system including (but not limited to): 
- Tracking stock of items 
- Calculate cost by item weight

## 3. User Stories
As a cashier, I can
1. View Products Table where I can set the quantity and click on "add to cart".
2. View the Cart as I add/remove/edit the products lines on it.
3. See the calculated subtotals and total in the Cart.
4. Decide whether to proceed with payment or empty the cart 
5. If paid, order is saved in database
6. View the order history

## 4. Stack
- Full Stack Next.JS 13 
- Next.JS is configured with App router i.e. layout.js, page.js, route.js,
  and Javascript, no automated testing, to keep it simple
- Mongoose ODM / Mongodb Database
- Chakra UI or Ant Design UI
- Deployment to Vercel

## 5. Models
Products
- name
- stock qty
- unit price

Orders
- date
- lines[{
    product
    order qty
    sub total
  }]
- total

Note: Cart will be a state and not a model

## 6. Next.JS Notes

### 6.1 API Routes 
API routes are replaced by route handler files named as route.js
 
``` 
"route.js"
import { NextResponse } from 'next/server'
 
export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  const res = await fetch(`https://data.mongodb-api.com/product/${id}`, {
    headers: {
      'Content-Type': 'application/json',
      'API-Key': process.env.DATA_API_KEY,
    },
  })
  const product = await res.json()
 
  return NextResponse.json({ product })
}

export async function POST() {
  const res = await fetch('https://data.mongodb-api.com/...', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'API-Key': process.env.DATA_API_KEY,
    },
    body: JSON.stringify({ time: new Date().toISOString() }),
  })
 
  const data = await res.json()
 
  return NextResponse.json(data)
}
```

### 6.2 Environment Variables 

[Use .env.local to load environment variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables#loading-environment-variables)


### 6.3 NextJS Caching During Fetch
The old data tends not to be refreshed because of the cache. either set to no-cache or set to short lifetime

```
export default async function Page() {
  // This request should be cached until manually invalidated.
  // Similar to `getStaticProps`.
  // `force-cache` is the default and can be omitted.
  const staticData = await fetch(`https://...`, { cache: 'force-cache' })
 
  // This request should be refetched on every request.
  // Similar to `getServerSideProps`.
  const dynamicData = await fetch(`https://...`, { cache: 'no-store' })
 
  // This request should be cached with a lifetime of 10 seconds.
  // Similar to `getStaticProps` with the `revalidate` option.
  const revalidatedData = await fetch(`https://...`, {
    next: { revalidate: 10 },
  })
 
  return <div>...</div>
}
```

### 6.4 Purge Data Cache After Every Commit
https://vercel.com/ernesttan/premiumfreshfruits/settings/data-cache

## 7 ChakraUI Notes 
[Docs:](https://chakra-ui.com/getting-started)
[Next.JS for Chakra - note that this is using Pages Router!](https://chakra-ui.com/getting-started/nextjs-guide)
### 7.1 Install command
>npm i @chakra-ui/react @chakra-ui/next-js @emotion/react @emotion/styled framer-motion

>It is important to install the @chakra-ui/next-js package or it does not work well!

### 7.2 Import ChakraProvider at Root Component
```
// app/providers.tsx
'use client'

import { CacheProvider } from '@chakra-ui/next-js'
import { ChakraProvider } from '@chakra-ui/react'

export function Providers({ 
    children 
  }: { 
  children: React.ReactNode 
  }) {
  return (
    <CacheProvider>
      <ChakraProvider>
        {children}
      </ChakraProvider>
    </CacheProvider>
  )
}
```

## 7.3 Flex Component
[Docs](https://chakra-ui.com/docs/styled-system/style-props#flexbox)
This element is using a shorthand like so:
```
// shorthand using the `Flex` component
<Flex align="center" justify="center">
  Flex Container
</Flex>
```
