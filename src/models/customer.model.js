import { model, Schema } from "mongoose";

/* __________ Customer Counter Schema for Auto-Increment __________ */
const customerCounterSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    sequenceValue: {
      type: Number,
      required: true,
      default: 200,
    },
  },
  { timestamps: true, collection: "CustomerCounter" }
);

const CustomerCounter = model("CustomerCounter", customerCounterSchema);

/* __________ Customer Schema  __________ */
const customerSchema = new Schema(
  {
    customerId: {
      type: Number,
      required: true,
      unique: true,
      index: true,
    },
    companyName: {
      type: String,
      trim: true,
      required: [true, "Company name is required."],
      index: true,
    },
    clientName: {
      type: String,
      trim: true,
      required: [true, "Client name is required."],
      index: true,
    },
    phone: {
      type: String,
      trim: true,
      required: [true, "Client phone number is required."],
      unique: [true, "Phone number is already taken."],
    },
    email: {
      type: String,
      trim: true,
      required: [true, "Client email is required."],
      lowercase: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Please enter a valid email address.",
      ],
      unique: [true, "Email is already taken."],
      index: true,
    },
    city: {
      type: String,
      trim: true,
      required: [true, "Client city name is required."],
    },
    address: {
      type: String,
      trim: true,
      required: [true, "Client address is required."],
    },
    state: {
      type: String,
      trim: true,
      required: [true, "Client state is required."],
    },
    zipCode: {
      type: String,
      trim: true,
      required: [true, "Client zipcode is required."],
    },
    agentId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Agent ID is required."],
      index: true,
    },
    repName: {
      type: String,
      trim: true,
      required: [true, "Representative name is required."],
    },
    str: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      enum: ["Active", "InActive"],
      default: "Active",
    },
  },
  { timestamps: true, collection: "Customers" }
);

/* Middleware to auto-increment customerId starting from 200 */
customerSchema.pre("validate", async function (next) {
  if (this.isNew) {
    try {
      let counter = await CustomerCounter.findOne({ name: "customerId" });

      if (!counter) {
        counter = await CustomerCounter.create({
          name: "customerId",
          sequenceValue: 199,
        });
      }

      const updatedCounter = await CustomerCounter.findOneAndUpdate(
        { name: "customerId" },
        { $inc: { sequenceValue: 1 } },
        { new: true }
      );

      this.customerId = updatedCounter.sequenceValue;
    } catch (error) {
      return next(error);
    }
  }
  next();
});

export const CustomerCounterModel = CustomerCounter;
export const CustomerModel = model("Customer", customerSchema);
