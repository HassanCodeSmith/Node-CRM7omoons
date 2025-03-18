import mongoose from "mongoose";

export const ConnectDb = async () => {
  try {
    const connectionInstance = await mongoose.connect(process.env.DB_URI);

    console.log(
      `==> 🗄️  DB connected | DB host is ${connectionInstance.connection.host} `
    );
  } catch (error) {
    console.error("An error occurred while connecting db", error);
  }
};
