import mongoose from "mongoose";
const { Schema } = mongoose;
import Product from "./Products"

if (!mongoose.models.Order) {

  const linesSchema = new Schema(
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
      orderQty: Number,
    },
  )

  // linesSchema.pre("find", function (next) {
  //   this.populate("product");
  //   next();
  // });

  // linesSchema.pre("findOne", function (next) {
  //   this.populate("product");
  //   next();
  // });

  const ordersSchema = new Schema(
    {
      date: Date,
      lines: [linesSchema],
    },
    {
      timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at",
      },
      toJSON: {
        virtuals: true
      }
    }
  );

  ordersSchema.virtual("total").get(function () {
    let total = 0
    this.lines.forEach((line) => {
      if (line.product && line.product.unitPrice){
        total += +line.product.unitPrice * +line.orderQty
      }
    })
    return parseFloat(total.toFixed(2))
  })



  mongoose.model("Order", ordersSchema);
}

export default mongoose.models.Order;




