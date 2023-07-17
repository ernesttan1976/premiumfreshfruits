"use client"
import styles from './page.module.css'
import { useState, useEffect } from "react"
import {Spinner, Button, Flex, Text} from './chakra/chakra'

import { Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, TableContainer } from './chakra/chakra'
import { NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper } from './chakra/chakra'
import { useRouter } from 'next/navigation'

import dayjs from "dayjs"

// export const metadata = {
//   title: 'Premium Fresh Fruits',
//   description: 'Point of Sale Application',
// }

export default function Home({children}) {

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [loading2, setLoading2] = useState(false)
  const [cartItems, setCartItems] = useState({})
  const [toggleReload, setToggleReload] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setLoading(true)
    const loadProducts = async () => {
      const result = await fetch("/api/products",
      {
        method: 'GET',
        cache: 'reload'
      }
      )
      
      if (result.ok) {
        const data = await result.json()
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

  // Call this function whenever you want to
  // refresh props!
  const refreshData = () => {
    router.replace(router.asPath);
  }

  function handleReload(){
    setTimeout(() => {
      setToggleReload(!toggleReload)
    }, 500);
    
  }

  const handlePlaceOrder = async (ev) => {
    ev.preventDefault()
    setLoading2(true)
    //console.log(cartItems)
    try {
      const result = await fetch("/api/orders",
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(cartItems),
        }
      )
      
      if (result.ok) {
        const data = await result.json()
        const id = data._id
  
        setTimeout(() => {
          router.push("/orders/"+id)
        }, 3000);

        setCartItems([])
        setLoading2(false)
        setToggleReload(!toggleReload)          

      } else {
        console.log("Error in POST: /api/orders "+JSON.stringify(result))
      }

    } catch (err) {
      console.log(err)
    }
  };

  return (
    <>
      {/* <Flex p={0} m={0} direction="row" width="100vw" align="center" justify="center" overflow="none">
        <Flex mx={4} px={8} direction="column" width="40vw" height="40px" align="center" justify="center">
                  </Flex>
        <Flex mx={4} px={8} direction="column" width="35vw" height="40px" align="center" justify="center">
        </Flex>
      </Flex> */}
      <Flex p={0} m={0} direction="row" width="100vw" height="100%" align="flex-start" justify="center" overflow="none">
        <Flex m={4} p={8} direction="column" borderRadius="16px" boxShadow="2px 3px 10px 3px #888888" overflow="hidden">
        <Text mb={8} fontSize="lg" fontWeight="bold" textAlign="center">Product List</Text>
        <Flex direction="column" width="40vw" height="50vh" align="center" justify="flex-start" overflowY="scroll">
          {loading ? <Spinner size='xl' /> :
            <>
              <Table className="table" size="sm" variant='striped' colorScheme="whatsapp" >
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
                        <NumberInput width="100px" size='sm' min={0} max={product.stockQty} default={0} onChange={(value) => handleChange(value, product._id)}>
                          <NumberInputField />
                          <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                          </NumberInputStepper>
                        </NumberInput>
                      </Td>
                    </Tr>
                  })}
                  <Tr><Td colSpan={4} textAlign="center"><Button size="md" onClick={(ev) => handleReload(ev)}>Reload Data</Button></Td></Tr>
                </Tbody>
              </Table>
            </>
          }
        </Flex>
        </Flex>

        <Flex m={4} p={8} direction="column" borderRadius="16px" boxShadow="2px 3px 10px 3px #888888" overflow="auto">
        <Text mb={8} fontSize="lg" fontWeight="bold" textAlign="center">Shopping Cart</Text>
        <Flex direction="column" width="35vw" height="50vh" align="center" justify="flex-start" overflowY="scroll">
          <Table className="table" size="sm" variant='striped' colorScheme="whatsapp">
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
              <Tr><Td colSpan={4} textAlign="center"><Button onClick={(ev) => handlePlaceOrder(ev)}> Place Order {loading2 && <Spinner size='sm' />}</Button></Td></Tr>
            </Tbody>
          </Table>
          </Flex>
        </Flex>
      </Flex>
    </>
  )
}
