import { Schema, model } from "mongoose";

const paymentSchema = new Schema(
  {
    clientId: {
      type: Number,
      required: [true],
    },
    email: {
      type: String,
      trim: true,
      required: [true, "Email is required."],
      unique: [true, "Email already taken."],
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Invalid email format",
      ],
    },

    customerPaymentId: {
      type: String,
      trim: true,
      required: [true, "Customer payment id is required."],
    },
  },
  { timestamps: true, collection: "Payments" }
);

export const PaymentModel = model("Payment", paymentSchema);
