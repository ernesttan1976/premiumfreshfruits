import mongoose from "mongoose";
const { Schema } = mongoose;

if (!mongoose.models.Order){

  const linesSchema = new Schema(
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
      orderQty: Number,
    },
  )

  linesSchema.pre("find", async function (next) {
    await this.populate("product");
    next();
  });

  linesSchema.pre("findOne", async function (next) {
    await this.populate("product");
    next();
  });

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

  
  ordersSchema.pre("find", async function (next) {
    await this.populate("lines.product");
    next();
  });

  ordersSchema.pre("findOne", async function (next) {
    await this.populate("lines.product");
    next();
  });

  ordersSchema.virtual("total").get(function () {
    let total = 0
    this.lines.forEach((line) => {
      if (line.product && line.product.unitPrice){
        total += +line.product.unitPrice * +line.orderQty
      }
    })
    return parseFloat(total.toFixed(2))
  })

  mongoose.model('Order', ordersSchema)

}

export default mongoose.models.Order



