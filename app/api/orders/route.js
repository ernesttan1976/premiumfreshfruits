import { connect, disconnect } from "../../../config/database";
import Order from "../../../models/Orders";
import Product from "../../../models/Products";
import { NextResponse } from 'next/server'

export async function GET() {

  connect();

  try {
    const orders = await Order.find({}).select('date lines total').sort("-date").populate({
      path: "lines.product",
      select: "name unitPrice"
    })
    //console.info(orders)
    
    return NextResponse.json(orders);
  } catch (err) {
    console.error(err.message)
    return new NextResponse(null, {
      status: 500,
      statusText: 'Internal Server Error',
      body: "Error in GET: /api/orders" + err.message,
    })

  }
}

export async function POST(req, res) {

  connect();

  const productIds = await req.json()
  console.info(productIds)

  try {
    let lines=[]

    for (const productId in productIds){
      const productFound = await Product.findById(productId)
      const newLine = {
        product: productFound,
        orderQty: parseInt(productIds[productId].orderQty),
      } 
      lines.push(newLine)
      productFound.stockQty -= parseInt(productIds[productId].orderQty)
      productFound.save()
    }
    
    const newOrder = {
      date: new Date(),
      lines: lines,
    }
    const result = await Order.create(newOrder)
    result.save()

    console.info(result)
    
    return NextResponse.json(result);
  } catch (err) {
    return new NextResponse(null, {
      status: 500,
      statusText: 'Internal Server Error',
      body: "Error in POST: /api/orders" + err,
    })

  }
}