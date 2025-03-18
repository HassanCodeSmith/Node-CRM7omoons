import { Router } from "express";
import {
  adminDashboardSaleDetails,
  getInvoiceAnalytics,
  getInvoicesDetailsByStartAndEndDates,
  getInvoiceStats,
  getOrderDetails,
  getTotalSale,
} from "../controllers/dashboard.controllers.js";
import { adminAuth } from "../middlewares/adminAuth.middleware.js";

const dashboardRouter = Router();

// Get All Order Details
dashboardRouter.route("/get-order-details").get(getOrderDetails);

// Get All Invoices Dates by Start and End Dates
dashboardRouter
  .route("/invoices-by-dates")
  .get(getInvoicesDetailsByStartAndEndDates);

// Get Total Sale
dashboardRouter.route("/get-total-sale").get(getTotalSale);

// Get Invoice Stats
dashboardRouter.route("/get-invoice-stats").get(getInvoiceStats);

// Get Invoice Analyatics
dashboardRouter.route("/get-invoices-analytics").get(getInvoiceAnalytics);

// Get Admin Dashboard's Sale Details
dashboardRouter
  .route("/sale-details")
  .get(adminAuth, adminDashboardSaleDetails);

export { dashboardRouter };
