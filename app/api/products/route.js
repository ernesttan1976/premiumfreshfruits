import { connect, disconnect } from "../../../config/database";
import Product from "../../../models/Products";
import { NextResponse } from 'next/server'

export async function GET(request, response) {

  connect();

  try {
    const products = await Product.find({})
    //.sort({ 'createdAt': 'desc' })
    return NextResponse.json(products);
  } catch (err) {
    return new NextResponse(null, {
      status: 500,
      statusText: 'Internal Server Error',
      body: "Error in GET: /api/products" + err,
    })

  }
}