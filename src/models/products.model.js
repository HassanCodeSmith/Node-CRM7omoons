import { Schema, model } from "mongoose";

const productSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Product name is required."],
    },
    price: {
      type: Number,
      required: [true, "Product price is required."],
    },
    quantity: {
      type: Number,
      required: [true, "Product quantity is required."],
    },
    image: {
      type: String,
      trim: true,
      required: [true, "Product image is required."],
    },
  },
  { timestamps: true, collection: "Products" }
);

export const ProductModel = model("Product", productSchema);
