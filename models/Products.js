import mongoose from "mongoose";
const { Schema } = mongoose;

if (!mongoose.models.Product) {

  const productsSchema = new Schema(
    {
      name: String,
      stockQty: {
        type: Number,
        min: 0,
      },
      unitPrice: {
        type: Number,
        get: function (v){
          return parseFloat(v).toFixed(2)
        },
        set: function (v){
          return parseFloat(v).toFixed(2)
        }
      },
    },
    {
      timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at",
      },
    }
  );

  mongoose.model("Product", productsSchema);
}

export default mongoose.models.Product;




