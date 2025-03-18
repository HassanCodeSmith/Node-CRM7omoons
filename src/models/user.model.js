import { model, Schema } from "mongoose";
import jwt from "jsonwebtoken";

/* __________ Invoice Counter Schema for Auto-Increment __________ */
const userCounterSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    sequenceValue: {
      type: Number,
      default: 0,
    },
  },
  { collection: "UserCounter" }
);

const UserCounter = model("UserCounter", userCounterSchema);

const userSchema = new Schema(
  {
    userNo: {
      type: Number,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      trim: true,
      required: [true, "Name is required."],
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

    phone: {
      type: String,
      trim: true,
      unique: [true, "Phone no already taken."],
    },

    password: {
      type: String,
      required: true,
    },

    userRole: {
      type: String,
      enum: ["Admin", "Agent"],
      default: "Agent",
    },
  },
  { timestamps: true, collection: "Users" }
);

/** __________ Increase User Count __________ */
userSchema.pre("validate", async function (next) {
  if (this.isNew) {
    try {
      const userCounter = await UserCounter.findOneAndUpdate(
        { name: "userNo" },
        { $inc: { sequenceValue: 1 } },
        { new: true, upsert: true }
      );

      this.userNo = userCounter.sequenceValue;
    } catch (error) {
      return next(error);
    }
  }
  next();
});

/** __________ Generate JWT Token __________ */
userSchema.methods.generateJWT = function () {
  try {
    return jwt.sign(
      {
        userId: this._id,
      },
      process.env.JWT_SECRET || "QWERTY!@#$%^",
      { expiresIn: process.env.JWT_EXPIRY || "1h" }
    );
  } catch (error) {
    console.error("An error occurred while generating JWT token.", error);
    throw new Error("Failed to generate JWT token.");
  }
};

export const UserModel = model("User", userSchema);
