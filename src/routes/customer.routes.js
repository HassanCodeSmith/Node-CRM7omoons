import { Router } from "express";
import { trimBodyObject } from "../middlewares/trimBodyObject.middleware.js";
import { checkRequiredFields } from "../middlewares/checkRequiredFields.middleware.js";
import {
  addCustomer,
  changeStatus,
  getInputFieldsContent,
  getAllCustomers,
  getCustomer,
  updateCustomer,
} from "../controllers/customer.controllers.js";
import { emailValidator } from "../middlewares/emailValidation.middleware.js";
import { agentAuth } from "../middlewares/agentAuth.middleware.js";

const customerRouter = Router();

// Add Customer
customerRouter
  .route("/add-customer")
  .post(
    agentAuth,
    trimBodyObject,
    checkRequiredFields([
      "companyName",
      "clientName",
      "phone",
      "email",
      "city",
      "address",
      "state",
      "zipCode",
    ]),
    emailValidator,
    addCustomer
  );

// Get All Customers
customerRouter.route("/get-all-customers").get(getAllCustomers);

// Get Customer
customerRouter.route("/get-customer/:customerId").get(getCustomer);

// Update Customer
customerRouter
  .route("/update-customer/:customerId")
  .patch(
    agentAuth,
    trimBodyObject,
    checkRequiredFields([
      "companyName",
      "clientName",
      "phone",
      "email",
      "city",
      "address",
      "state",
      "zipCode",
    ]),
    emailValidator,
    updateCustomer
  );

// Change Status
customerRouter
  .route("/change-status/:customerId")
  .patch(agentAuth, changeStatus);

// Get All Companies Name
customerRouter
  .route("/get-inputFields-content")
  .get(agentAuth, getInputFieldsContent);

export { customerRouter };
