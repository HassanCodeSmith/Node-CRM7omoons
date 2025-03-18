import { NotAcceptableException } from "../errors/index.js";

export const emailValidator = async (req, res, next) => {
  req.body.email = req.body.email.toLowerCase();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!emailRegex.test(req.body.email)) {
    throw new NotAcceptableException("Invalid email formate");
  }

  next();
};
