"use client"
import { useState, useEffect } from "react"
import { Spinner, Button, Flex, Text } from '@chakra-ui/react'
import { Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, TableContainer } from '@chakra-ui/react'

import dayjs from "dayjs"

export default function OrderShow({ params }) {

  const [order, setOrder] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)

    const loadOrder = async () => {

      const id = params.id
      const result = await fetch("/api/orders/" + id)
      const data = await result.json()
      //console.log(data)
      if (result.ok === true) {
        setOrder(data)
      } else {
        console.log("Error in GET: /api/orders/[id]")
      }
      setLoading(false)
    }

    loadOrder()

  }, [])

  return (
    <>
      <Flex direction="row" width="100vw" height="30px" align="center" justify="center" overflow="none">
        <Flex direction="column" width="60vw" height="30px" align="center" justify="center">
          <Text fontSize="lg" fontWeight="bold" textAlign="center">Order Detail</Text>
        </Flex>
      </Flex>
      <Flex direction="row" width="80vw" height="100%" align="flex-start" justify="center" overflow="none">
        <Flex p={4} direction="column" width="60vw" height="80vh" align="center" justify="flex-start" overflowY="scroll">
          {loading ? <Spinner size='xl' /> :
            <>
              <Table className="table" variant='striped' colorScheme='teal'>
                <TableCaption>Order Detail</TableCaption>
                  <Thead>
                  <Tr>
                      <Th colSpan={2}>Date-Time</Th>
                      <Th colSpan={2} textAlign="left">{dayjs(order.date).format('DD/MM/YYYY HH:MM')}</Th>
                  </Tr>
                  <Tr>
                    <Th colSpan={2}>Item</Th>
                    <Th>Order Qty</Th>
                    <Th>Unit Price</Th>
                  </Tr>
                  </Thead>
                <Tbody>
                  {order &&
                    <>
                      {order?.lines?.map((line, index) => {
                        return <Tr>
                          <Td colSpan={2} textAlign="left">{line.product.name} </Td>
                          <Td>{line.orderQty}</Td>
                          <Td>${line.product.unitPrice.toFixed(2)}</Td>
                          </Tr>
                      })}
                      <Tr>
                        <Td colSpan={3} textAlign="right">Total</Td>
                        <Td>${order.total?.toFixed(2)}</Td>
                      </Tr>
                      <Tr>
                        <Td colSpan={3} textAlign="right">GST</Td>
                        <Td>${(order.total * 0.08).toFixed(2)}</Td>
                      </Tr>
                      <Tr>
                        <Td colSpan={3} textAlign="right">Total with GST</Td>
                        <Td colSpan={2}>${(order.total * 1.08).toFixed(2)}</Td>
                      </Tr>
                    </>
                  }
                </Tbody>
              </Table>
            </>
          }
        </Flex>
      </Flex>
    </>
  )
}
