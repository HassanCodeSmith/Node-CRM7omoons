import mongoose, { Schema, model } from "mongoose";

/* __________ Invoice Counter Schema for Auto-Increment __________ */
const invoiceCounterSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    sequenceValue: {
      type: Number,
      required: true,
      default: 1999,
    },
  },
  { collection: "InvoiceCounter" }
);

const InvoiceCounter = model("InvoiceCounter", invoiceCounterSchema);

/* __________ Invoice Schema __________ */
const invoiceSchema = new Schema(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },

    invoiceNo: {
      type: Number,
      required: true,
      unique: true,
      index: true,
    },

    date: {
      type: Date,
      default: Date.now,
    },

    order: {
      products: {
        type: [
          {
            product: {
              type: Schema.Types.ObjectId,
              ref: "Product",
              required: [
                true,
                "Product id is required while creating invoice.",
              ],
            },
            salePrice: {
              type: Number,
              required: [
                true,
                "Product salePrice is required while creating invoice.",
              ],
            },
            quantity: {
              type: Number,
              required: [
                true,
                "Product quantity is required while creating invoice.",
              ],
            },
            totalPrice: {
              type: Number,
              required: [
                true,
                "Selected product's total price according to product quantity is missing.",
              ],
            },
          },
        ],
        validate: {
          validator: function (v) {
            return v.length > 0;
          },
          message: "At least one product is required to create an invoice.",
        },
      },
      orderStatus: {
        type: String,
        enum: ["Pending", "InProcess", "Shipped", "Delivered", "Cancel"],
        default: "Pending",
      },
    },

    subTotal: {
      type: Number,
      required: [true, "Invoice sub-total is required."],
    },

    discount: {
      type: String,
      default: "0",
    },

    discountAmount: {
      type: Number,
      default: 0,
    },

    shippingFee: {
      type: Number,
      default: 0.0,
    },

    total: {
      type: Number,
      required: [true, "Invoice final totals are required."],
    },

    invoiceStatus: {
      type: String,
      enum: ["Pending", "Paid", "Cancel"],
      default: "Pending",
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User id who created the invoice is required."],
    },

    pdfUrl: String,
  },
  { timestamps: true, collection: "Invoices" }
);

/** __________ Increase Invoice Count __________ */
invoiceSchema.pre("validate", async function (next) {
  if (this.isNew) {
    try {
      let invoiceCounter = await InvoiceCounter.findOne({ name: "invoiceNo" });

      if (!invoiceCounter) {
        invoiceCounter = await InvoiceCounter.create({
          name: "invoiceNo",
          sequenceValue: 1999,
        });
      }

      const updatedCounter = await InvoiceCounter.findOneAndUpdate(
        { name: "invoiceNo" },
        { $inc: { sequenceValue: 1 } },
        { new: true }
      );

      this.invoiceNo = updatedCounter.sequenceValue;
    } catch (error) {
      return next(error);
    }
  }
  next();
});

export const InvoiceModel = model("Invoice", invoiceSchema);
