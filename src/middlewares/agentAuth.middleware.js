import { ForbiddenException } from "../errors/index.js";

export const agentAuth = async (req, res, next) => {
  if (req.userRole !== "Agent") {
    console.error("Invalid role.");
    throw new ForbiddenException("Invalid role");
  }

  next();
};
