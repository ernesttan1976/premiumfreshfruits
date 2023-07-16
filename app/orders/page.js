"use client"
import { useState, useEffect } from "react"
import { Spinner, Button, Flex, Text } from '@chakra-ui/react'
import { Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, TableContainer } from '@chakra-ui/react'
import { Link } from '@chakra-ui/next-js'

import dayjs from "dayjs"

export default function Orders() {

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)

    const loadOrders = async () => {

      const result = await fetch("/api/orders")
      const data = await result.json()
      //console.log(data)
      if (result.ok === true) {
        setOrders(data)
      } else {
        console.log("Error in GET: /api/orders")
      }
      setLoading(false)
    }
    
    loadOrders()

  }, [])

  return (
    <>
    <Flex direction="row" width="100vw" height="30px" align="center" justify="center" overflow="none">
      <Flex direction="column" width="100vw" height="30px" align="center" justify="center">
      <Text fontSize="lg" fontWeight="bold" textAlign="center">Order History</Text>
      </Flex>
    </Flex>
      <Flex direction="row" width="100vw" height="100%" align="flex-start" justify="center" overflow="none">
        <Flex p={4} direction="column" width="80vw" height="80vh" align="center" justify="flex-start" overflowY="scroll">
        {loading ? <Spinner size='xl' /> :
            <>
              <Table className="table" variant='striped' colorScheme='teal'>
                <TableCaption>View Order History</TableCaption>
                <Thead>
                  <Tr>
                    <Th>Date-Time</Th>
                    <Th>Action</Th>
                    <Th>Items</Th>
                    <Th>Total</Th>
                    <Th>GST</Th>
                    <Th>Total with GST</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {orders.length > 0 && orders?.map((order, index) => {
                    return <Tr key={index + 2000}>
                      <Td>{dayjs(order.date).format('DD/MM/YYYY HH:MM')} </Td>
                      <Td><Button><Link href={"/orders/"+order._id}>Show Detail</Link></Button></Td>
                      <Td>
                        <ol>
                        {order.lines.map((line,index)=>{
                          return <li>{line.product.name} @ ${line.product.unitPrice.toFixed(2)} x {line.orderQty}</li>
                        })}
                        </ol>
                        
                      </Td>
                      <Td>${order.total.toFixed(2)}</Td>
                      <Td>${(order.total*0.08).toFixed(2)}</Td>
                      <Td>${(order.total*1.08).toFixed(2)}</Td>
                    </Tr>
                  })}
                </Tbody>
              </Table>
            </>
          }
        </Flex>
      </Flex>
    </>
  )
}
