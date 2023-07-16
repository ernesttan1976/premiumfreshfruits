"use client"
import styles from './page.module.css'
import { useState, useEffect } from "react"
import { Spinner, Button, Flex, Text } from '@chakra-ui/react'
import { Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, TableContainer } from '@chakra-ui/react'
import { NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'

import dayjs from "dayjs"

// export const metadata = {
//   title: 'Premium Fresh Fruits',
//   description: 'Point of Sale Application',
// }

export default function Home() {

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [cartItems, setCartItems] = useState({})
  const [toggleReload, setToggleReload] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setLoading(true)
    const loadProducts = async () => {
      const result = await fetch("/api/products")
      if (!result.ok) return
      const data = await result.json()
      if (result.ok === true) {
        setProducts(data)
      } else {
        console.log("Error in GET: /api/products")
      }
      setLoading(false)
    }

    loadProducts()

  }, [toggleReload])

  const handleChange = (value, id) => {

    if (value === "0") {
      delete cartItems[id]
      setCartItems({ ...cartItems })
    } else {
      const index = products.findIndex((item) => item._id === id)
      setCartItems({
        ...cartItems, [id]: {
          name: products[index].name,
          unitPrice: products[index].unitPrice,
          orderQty: parseInt(value),
        }
      })

    }

  };

  // const handleAddToCart = async (ev) => {
  //   ev.preventDefault()
  //   console.log(cartItems)
  // };

  const handlePlaceOrder = async (ev) => {
    ev.preventDefault()
    //console.log(cartItems)
    try {
      const result = await fetch("/api/orders",
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(cartItems),
        }
      )
      
      const data = await result.json()
      const id = data._id
      router.push("/orders/"+id)

      setCartItems([])
      setToggleReload(!toggleReload)

    } catch (err) {
      console.log(err)
    }
  };

  return (
    <>
      <Flex direction="row" width="100vw" height="30px" align="center" justify="center" overflow="none">
        <Flex direction="column" width="45vw" height="30px" align="center" justify="center">
          <Text fontSize="lg" fontWeight="bold" textAlign="center">Product List</Text>
        </Flex>
        <Flex direction="column" width="35vw" height="30px" align="center" justify="center">
          <Text fontSize="lg" fontWeight="bold" textAlign="center">Shopping Cart</Text>
        </Flex>
      </Flex>
      <Flex direction="row" width="100vw" height="100%" align="flex-start" justify="center" overflow="none">
        <Flex p={4} direction="column" width="45vw" height="80vh" align="center" justify="flex-start" overflowY="scroll">
          {loading ? <Spinner size='xl' /> :
            <>
              <Table className="table" variant='striped' colorScheme='teal' >
                <TableCaption>Change the Quantity to Add Product To Cart</TableCaption>
                <Thead>
                  <Tr>
                    <Th>Product Name</Th>
                    <Th>Stock Qty</Th>
                    <Th>Unit Price</Th>
                    <Th>Order Qty</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {products.length > 0 && products?.map((product, index) => {
                    return <Tr key={index + 1000}>
                      <Td>{product.name}</Td>
                      <Td>{product.stockQty}</Td>
                      <Td>${product.unitPrice.toFixed(2)}</Td>
                      <Td>
                        <NumberInput width="100px" size='md' min={0} max={product.stockQty} default={0} onChange={(value) => handleChange(value, product._id)}>
                          <NumberInputField />
                          <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                          </NumberInputStepper>
                        </NumberInput>
                      </Td>
                    </Tr>
                  })}
                </Tbody>
              </Table>
            </>
          }
        </Flex>

        <Flex p={4} direction="column" width="35vw" height="80vh" align="center" justify="flex-start" overflowY="scroll">
          <Table className="table" variant='striped' colorScheme='teal' >
            <TableCaption>Please check carefully before placing order.</TableCaption>
            <Thead>
              <Tr>
                <Th textAlign="center">Product Name</Th>
                <Th textAlign="center">Unit Price</Th>
                <Th textAlign="center">Order Qty</Th>
                <Th textAlign="center">Sub Total</Th>
              </Tr>
            </Thead>
            <Tbody>
              {Object.keys(cartItems).length > 0 ? Object.keys(cartItems).map((id, index) => {
                const cartItem = cartItems[id]
                return <Tr key={index + 1000}>
                  <Td>{cartItem.name}</Td>
                  <Td textAlign="right">${cartItem.unitPrice.toFixed(2)}</Td>
                  <Td textAlign="center">{cartItem.orderQty}</Td>
                  <Td textAlign="right">${(cartItem.unitPrice * cartItem.orderQty).toFixed(2)}</Td>
                </Tr>
              })
                :
                <Tr><Td colSpan={4} textAlign="center">Cart is empty</Td></Tr>
              }
              <Tr><Td colSpan={2}></Td><Td colSpan={1} textAlign="center">Total</Td><Td colSpan={1} textAlign="right">${Object.keys(cartItems).reduce((acc, id) => (acc + cartItems[id].unitPrice * cartItems[id].orderQty), 0).toFixed(2)}</Td></Tr>
              <Tr><Td colSpan={4} textAlign="center"><Button onClick={(ev) => handlePlaceOrder(ev)}>Place Order</Button></Td></Tr>
            </Tbody>
          </Table>
        </Flex>
      </Flex>
    </>
  )
}
