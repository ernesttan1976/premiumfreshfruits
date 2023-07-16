import { NextResponse } from "next/server";
import { connect, disconnect } from "../../../../config/database";
import Product from "../../../../models/Products";

const productArray = [
  {
    name: "Apple",
    stockQty: 100,
    unitPrice: 2.00,
  },
  {
    name: "Banana",
    stockQty: 200,
    unitPrice: 1.50,
  },
  {
    name: "Pear",
    stockQty: 80,
    unitPrice: 2.30,
  },
  {
    name: "Orange",
    stockQty: 60,
    unitPrice: 1.80,
  },

]

export async function GET() {

    connect();

    try {
      
      await Product.deleteMany({})

      const result = await Product.create(productArray)
      return NextResponse.json({ result });
    } catch (err) {
      return NextResponse.json({ message: "Error in GET: /api/products/seed" + err })
    }

}