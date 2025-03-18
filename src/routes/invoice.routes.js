import { Router } from "express";
import { trimBodyObject } from "../middlewares/trimBodyObject.middleware.js";
import { checkRequiredFields } from "../middlewares/checkRequiredFields.middleware.js";
import { adminAuth } from "../middlewares/adminAuth.middleware.js";
import { agentAuth } from "../middlewares/agentAuth.middleware.js";
import {
  changeInvoiceStatus,
  changeOrderStatus,
  createInvoice,
  getAllInvoicesByAdmin,
  getAllInvoices,
  getInvoiceByAdmin,
  getInvoiceByAgent,
  updateInvoice,
} from "../controllers/invoice.controllers.js";

const invoiceRouter = Router();

/* ------------------------------------------------------
                    AGENT Routes 
-------------------------------------------------------*/
// Create Invoice By Agent
invoiceRouter
  .route("/create-invoice")
  .post(
    agentAuth,
    trimBodyObject,
    checkRequiredFields([
      "customer",
      "order.products",
      "subTotal",
      "discount",
      "shippingFee",
      "total",
    ]),
    createInvoice
  );

// Get All Invoices
invoiceRouter.route("/get-all-invoices").get(getAllInvoices);

// Get Invoice By Agent
invoiceRouter
  .route("/get-invoice-by-agent/:id")
  .get(agentAuth, getInvoiceByAgent);

// Update Invoice By Agent
invoiceRouter
  .route("/update-invoice/:id")
  .put(
    agentAuth,
    trimBodyObject,
    checkRequiredFields([
      "customer",
      "date",
      "order.products",
      "subTotal",
      "shippingFee",
      "total",
    ]),
    updateInvoice
  );

// Change Invoice Status
invoiceRouter
  .route("/change-invoice-status/:id")
  .patch(agentAuth, changeInvoiceStatus);

// Change Invoice Order Status
invoiceRouter
  .route("/change-order-status/:id")
  .patch(agentAuth, changeOrderStatus);

/* ------------------------------------------------------
                    Admin Routes 
---------------------------------------------------------*/
// Get All Invoices By Admin
invoiceRouter
  .route("/get-all-invoices-by-admin/:id")
  .get(adminAuth, getAllInvoicesByAdmin);

// Get Invoice By Admin
invoiceRouter
  .route("/get-invoice-by-admin/:id")
  .get(adminAuth, getInvoiceByAdmin);
export { invoiceRouter };
