"use client"
import { useState, useEffect } from "react"
import { Spinner, Button, Flex, Text } from '@chakra-ui/react'
import { Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, TableContainer } from '@chakra-ui/react'
import { Link } from '@chakra-ui/next-js'

import dayjs from "dayjs"

export default function Orders() {

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [toggleLoad, setToggleLoad] = useState(false)

  useEffect(() => {
    setLoading(true)

    const loadOrders = async () => {

      const result = await fetch("/api/orders")
      
      if (result.ok === true) {
        const data = await result.json()
        console.info(data)
        setOrders(data)
      } else {
        console.log("Error in GET: /api/orders")
      }
      setLoading(false)
    }
    
    loadOrders()

  }, [toggleLoad])

  async function handleDelete(id){

    try {
      const result = await fetch("/api/orders/"+id,
      {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json'
        },
      }
    )

      setToggleLoad(!toggleLoad)

    } catch (err) {
      console.log(err.message)
    }
  }  


  return (
    <>
    <Flex m={0} p={0} direction="row" width="100vw" height="60px" align="center" justify="center" overflow="none">
      <Flex m={0} p={0} direction="column" width="100vw" height="60px" align="center" justify="center">
      <Text m={0} p={0} fontSize="md" fontWeight="bold" textAlign="center">Order History</Text>
      </Flex>
    </Flex>
      <Flex m={0} p={0} direction="row" width="100vw" height="100%" align="flex-start" justify="center" overflow="none">
      <Flex m={0} p={4} borderRadius="16px" boxShadow="2px 3px 10px 3px #888888" overflow="hidden">
        <Flex direction="column" width="80vw" height="55vh" align="center" justify="flex-start" overflowY="scroll">
        {loading ? <Spinner size='xl' /> :
            <>
              <Table className="table" variant='striped' colorScheme='whatsapp'>
                <Thead>
                  <Tr>
                    <Th>Action</Th>
                    <Th>Date-Time</Th>
                    <Th>Items</Th>
                    <Th>Total</Th>
                    <Th>GST</Th>
                    <Th>Total with GST</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {orders.length > 0 ? orders?.map((order, index) => {
                    return <Tr key={index + 2000}>
                      <Td textAlign="center" width="250px">
                        <Button m={1}><Link href={"/orders/"+order._id}>Show</Link></Button>
                        <Button m={1} onClick={()=>handleDelete(order._id)}>Delete</Button>
                      </Td>
                      <Td>{dayjs(order.date).format('DD/MM/YYYY HH:MM')} </Td>
                      <Td width="200px">
                        <ol>
                        {order.lines.map((line,index2)=>{
                          return <li key={index*100+index2}>{line.product?.name} @ ${line.product?.unitPrice.toFixed(2)} x {line.orderQty}</li>
                        })}
                        </ol>
                      </Td>
                      <Td>${order.total.toFixed(2)}</Td>
                      <Td>${(order.total*0.08).toFixed(2)}</Td>
                      <Td>${(order.total*1.08).toFixed(2)}</Td>
                    </Tr>
                  }):<Tr><Td colSpan={6} textAlign="center">No Orders Found</Td></Tr>}
                </Tbody>
              </Table>
            </>
          }
          </Flex>
        </Flex>
      </Flex>
    </>
  )
}
