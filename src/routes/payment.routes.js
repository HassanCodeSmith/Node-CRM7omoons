import { Router } from "express";
import { trimBodyObject } from "../middlewares/trimBodyObject.middleware.js";
import { checkRequiredFields } from "../middlewares/checkRequiredFields.middleware.js";
import { createPayment } from "../controllers/payment.controllers.js";
import { emailValidator } from "../middlewares/emailValidation.middleware.js";

const paymentRouter = Router();

paymentRouter
  .route("/create-payment")
  .post(
    trimBodyObject,
    checkRequiredFields(["name", "email", "phone", "company", "amount"]),
    emailValidator,
    createPayment
  );

export { paymentRouter };
