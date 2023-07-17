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
      const result = await fetch("/api/orders/" + id,
        {
          method: "GET",
          cache: 'no-store'
        }
      )
      //console.log(data)
      if (result.ok === true) {
        const data = await result.json()
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
      <Flex m={0} p={0} direction="row" width="80vw" height="100%" align="flex-start" justify="center" overflow="none">
        <Flex m={8} p={6} direction="column" borderRadius="16px" boxShadow="2px 3px 10px 3px #888888" overflow="hidden">
        <Text mb={8} fontSize="lg" fontWeight="bold" textAlign="center">Order Detail</Text>
        <Flex direction="column" width="50vw" height="55vh" align="center" justify="flex-start" overflowY="scroll">
          {loading ? <Spinner size='xl' /> :
            <>
              <Table className="table" size="sm" variant='striped' colorScheme="whatsapp">
                <Thead>
                  <Tr height="32px">
                    <Th colSpan={2}>Date-Time</Th>
                    <Th colSpan={2} textAlign="left">{dayjs(order.date).format('DD/MM/YYYY HH:MM')}</Th>
                  </Tr>
                  <Tr height="32px">
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
                    </>
                  }
                </Tbody>
                <Tfoot>
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
                </Tfoot>
              </Table>
            </>
          }
          </Flex>
        </Flex>
      </Flex>
    </>
  )
}
