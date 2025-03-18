import dotenv from "dotenv";
import { UserModel } from "../models/user.model.js";

dotenv.config();

const name = process.env.ADMIN_NAME;
const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;

export const createUser = async () => {
  const isAdminExist = await UserModel.findOne({ userRole: "Admin" });

  if (!isAdminExist) {
    try {
      await UserModel.create({
        name,
        email,
        password,
        userRole: "Admin",
      });
    } catch (error) {
      console.error("An error occurred while creating admin.\n", error);
    }
  }
};
