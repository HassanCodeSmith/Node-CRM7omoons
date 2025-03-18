import { ForbiddenException } from "../errors/index.js";

export const adminAuth = async (req, res, next) => {
  if (req.userRole !== "Admin") {
    console.error("Invalid role.");
    throw new ForbiddenException("Invalid role");
  }

  next();
};
