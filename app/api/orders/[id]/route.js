import { connect, disconnect } from "../../../../config/database";
import Order from "../../../../models/Orders";
import Product from "../../../../models/Products";
import { NextResponse } from 'next/server'

export async function GET(request, {params}) {

  connect();
  const id = params.id
  
  try {
    const order = await Order.findById(id).populate({
      path: "lines.product",
      select: "name unitPrice"
    }).select('date lines total')
    console.info(order)
    
    return NextResponse.json(order);
  } catch (err) {
    console.error(err.message)
    return new NextResponse(null, {
      status: 500,
      statusText: 'Internal Server Error',
      body: "Error in GET: /api/orders/[id]" + err.message,
    })

  }
}

export async function DELETE(request, {params}) {

  connect();
  const id = params.id
  
  try {
    const order = await Order.findById(id).exec()
    console.info(order)

    if (order) await order.deleteOne().exec()
    
    return NextResponse.json(order);
  } catch (err) {
    console.error(err.message)
    return new NextResponse(null, {
      status: 500,
      statusText: 'Internal Server Error',
      body: "Error in GET: /api/orders/[id]" + err.message,
    })

  }
}

