import { connect, disconnect } from "../../../config/database";
import Order from "../../../models/Orders";
import Product from "../../../models/Products";
import { NextResponse } from 'next/server'

export async function GET() {

  connect();

  try {
    const orders = await Order.find({}).populate({
      path: "lines.product",
      select: "name unitPrice"
    }).select('date lines total').sort("-date")
    

    // const order = await Order.findById(id).select('date lines total').populate({
    //   path: "lines.product",
    //   select: "name unitPrice"
    // })
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
  console.info("POST received productIds:",productIds)

  try {
    let lines=[]

    for (const productId in productIds){
      let productFound = await Product.findById(productId)
      const newLine = {
        product: productId,
        orderQty: parseInt(productIds[productId].orderQty),
      }  

      lines.push(newLine)
      productFound.stockQty -= parseInt(productIds[productId].orderQty)
      await productFound.save()
    }
    
    const newOrder = {
      date: new Date(),
      lines: lines,
    }

    console.info("newOrder:",newOrder)
    const result = await Order.create(newOrder)
    console.info("result:",result)
    await result.save()


    
    return NextResponse.json(result);
  } catch (err) {
    console.info(err.message)
    return new NextResponse(null, {
      status: 500,
      statusText: 'Internal Server Error',
      body: "Error in POST: /api/orders" + err.message,
    })

  }
}