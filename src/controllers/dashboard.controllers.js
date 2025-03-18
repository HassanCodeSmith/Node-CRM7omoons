import { InvoiceModel } from "../models/invoice.model.js";
import { ProductModel } from "../models/products.model.js";
import { UserModel } from "../models/user.model.js";
import { ApiResponce } from "../utils/apiResponce.util.js";
import mongoose from "mongoose";
const { ObjectId } = mongoose.Types;

/* __________ Get All Order Details __________ */
export const getOrderDetails = async (req, res) => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  let matchStage;

  if (req.userRole === "Admin" && req?.query?.userId) {
    matchStage = {
      date: { $gte: startOfMonth, $lte: endOfMonth },
      createdBy: new ObjectId(req.query.userId),
    };
  } else if (req.userRole === "Admin") {
    matchStage = {
      date: { $gte: startOfMonth, $lte: endOfMonth },
    };
  } else {
    matchStage = {
      date: { $gte: startOfMonth, $lte: endOfMonth },
      createdBy: req.userId,
    };
  }

  const result = await InvoiceModel.aggregate([
    {
      $match: matchStage,
    },
    {
      $group: {
        _id: "$order.orderStatus",
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        status: "$_id",
        count: 1,
        _id: 0,
      },
    },
  ]);

  const counts = { Pending: 0, InProcess: 0, Shipped: 0, Delivered: 0 };

  result.forEach((item) => {
    counts[item.status] = item.count;
  });

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message: "Current month's order details fetched successfully.",
      data: counts,
    })
  );
};

/* __________ Get All Invoices Details By Start and End Date __________ */
export const getInvoicesDetailsByStartAndEndDates = async (req, res) => {
  let { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    const now = new Date();
    startDate = new Date(now.getFullYear(), now.getMonth(), 1)
      .toISOString()
      .split("T")[0];
    endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0)
      .toISOString()
      .split("T")[0];
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return res.status(415).json({
      statusCode: 415,
      message: "Invalid date format. Use valid ISO format (YYYY-MM-DD).",
    });
  }

  const utcStart = new Date(
    Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate())
  );
  const utcEnd = new Date(
    Date.UTC(
      end.getUTCFullYear(),
      end.getUTCMonth(),
      end.getUTCDate(),
      23,
      59,
      59,
      999
    )
  );

  let matchStage = { date: { $gte: utcStart, $lte: utcEnd } };

  if (req.userRole === "Admin" && req.query.userId) {
    matchStage.createdBy = new ObjectId(req.query.userId);
  } else if (req.userRole !== "Admin") {
    matchStage.createdBy = req.userId;
  }

  const result = await InvoiceModel.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: "$invoiceStatus",
        count: { $sum: 1 },
        totalSale: { $sum: "$total" },
      },
    },
    {
      $project: {
        status: "$_id",
        count: 1,
        totalSale: 1,
        _id: 0,
      },
    },
  ]);

  // Default structure for response
  const counts = {
    Pending: { totalInvoices: 0, totalSale: 0 },
    Paid: { totalInvoices: 0, totalSale: 0 },
    Cancel: { totalInvoices: 0, totalSale: 0 },
  };

  result.forEach((item) => {
    if (counts.hasOwnProperty(item.status)) {
      counts[item.status].totalInvoices = item.count;
      counts[item.status].totalSale = item.totalSale;
    }
  });

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message: "Invoices details fetched successfully.",
      data: counts,
    })
  );
};

/* __________ Get Total Sale  __________ */
export const getTotalSale = async (req, res) => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  let matchStage;

  if (req.userRole === "Admin" && req?.query?.userId) {
    matchStage = {
      createdBy: new ObjectId(req.query.userId),
      invoiceStatus: "Paid",
      date: { $gte: startOfMonth, $lte: endOfMonth },
    };
  } else if (req.userRole === "Admin") {
    matchStage = {
      invoiceStatus: "Paid",
      date: { $gte: startOfMonth, $lte: endOfMonth },
    };
  } else {
    matchStage = {
      createdBy: req.userId,
      invoiceStatus: "Paid",
      date: { $gte: startOfMonth, $lte: endOfMonth },
    };
  }

  const result = await InvoiceModel.aggregate([
    {
      $match: matchStage,
    },
    {
      $group: {
        _id: null,
        totalSale: { $sum: "$total" },
        totalInvoices: { $sum: 1 },
      },
    },
  ]);

  const data = result.length > 0 ? result[0] : [];
  const message =
    result.length > 0
      ? "Total sale fetched successfully."
      : "This month sale is zero.";

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message,
      data,
    })
  );
};

/* __________ Invoice Stats _________ */
export const getInvoiceStats = async (req, res) => {
  let { month } = req.query;

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  if (!month || !months.includes(month)) {
    month = months[new Date().getMonth()];
  }

  const monthIndex = months.indexOf(month);
  const prevMonth = monthIndex === 0 ? null : months[monthIndex - 1];

  let matchStage;

  if (req.userRole === "Admin" && req?.query?.userId) {
    matchStage = {
      createdBy: new ObjectId(req.query.userId),
      $expr: {
        $or: [
          { $eq: [{ $dateToString: { format: "%B", date: "$date" } }, month] },
          {
            $eq: [
              { $dateToString: { format: "%B", date: "$date" } },
              prevMonth,
            ],
          },
        ],
      },
    };
  } else if (req.userRole === "Admin") {
    matchStage = {
      $expr: {
        $or: [
          { $eq: [{ $dateToString: { format: "%B", date: "$date" } }, month] },
          {
            $eq: [
              { $dateToString: { format: "%B", date: "$date" } },
              prevMonth,
            ],
          },
        ],
      },
    };
  } else {
    matchStage = {
      createdBy: req.userId,
      $expr: {
        $or: [
          { $eq: [{ $dateToString: { format: "%B", date: "$date" } }, month] },
          {
            $eq: [
              { $dateToString: { format: "%B", date: "$date" } },
              prevMonth,
            ],
          },
        ],
      },
    };
  }

  const response = await InvoiceModel.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: { $dateToString: { format: "%B", date: "$date" } },
        totalInvoices: { $sum: 1 },
      },
    },
  ]);

  let currentMonthInvoices =
    response.find((r) => r._id === month)?.totalInvoices || 0;
  let prevMonthInvoices =
    response.find((r) => r._id === prevMonth)?.totalInvoices || 0;

  let obj = {};
  if (currentMonthInvoices > prevMonthInvoices) {
    obj.greaterValue = currentMonthInvoices;
    obj.smallerValue = prevMonthInvoices;
    obj.status = "High";
  } else if (prevMonthInvoices > currentMonthInvoices) {
    obj.greaterValue = prevMonthInvoices;
    obj.smallerValue = currentMonthInvoices;
    obj.status = "Low";
  } else if (currentMonthInvoices === prevMonthInvoices) {
    obj.status = "Nutral";
  }

  let percentageChange =
    prevMonthInvoices && obj.greaterValue !== obj.smallerValue
      ? ((obj.greaterValue - obj.smallerValue) / obj.greaterValue) * 100
      : 0;

  res.status(200).json(
    new ApiResponce({
      month,
      prevMonth: prevMonth || null,
      currentMonthInvoices,
      prevMonthInvoices,
      status: obj.status,
      percentageChange: percentageChange.toFixed(2) + "%",
    })
  );
};

/* __________ Invoice Analytics __________ */
export const getInvoiceAnalytics = async (req, res) => {
  const { startMonth = "January", endMonth = "December" } = req.query;
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const startMonthIndex = monthNames.indexOf(startMonth) + 1;
  const endMonthIndex = monthNames.indexOf(endMonth) + 1;

  if (startMonthIndex === 0 || endMonthIndex === 0) {
    return res.status(400).json({ message: "Invalid month name provided." });
  }

  let matchStage = {
    invoiceStatus: "Paid",
    $expr: {
      $and: [
        { $gte: [{ $month: "$date" }, startMonthIndex] },
        { $lte: [{ $month: "$date" }, endMonthIndex] },
      ],
    },
  };

  if (req.userRole === "Admin" && req?.query?.userId) {
    matchStage.createdBy = new ObjectId(req.query.userId);
  } else if (req.userRole !== "Admin") {
    matchStage.createdBy = req.userId;
  }

  const response = await InvoiceModel.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: { $dateToString: { format: "%B", date: "$date" } },
        totalSale: { $sum: "$total" },
        totalInvoices: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.status(200).json(
    new ApiResponce({
      message: "Invoices Analytics fetched successfully.",
      data: response,
    })
  );
};

/* ------------------------------------------------------
                ADMIN DASHBOARD CONTROLLERS  
-------------------------------------------------------*/
/* __________ Dashboard Sales + Products + Staff Detials __________ */
export const adminDashboardSaleDetails = async (req, res) => {
  const now = new Date();

  // Current Month Sale
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
    23,
    59,
    59,
    999
  );

  // Today Sale
  const startOfDay = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    0,
    0,
    0,
    0
  );
  const endOfDay = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23,
    59,
    59,
    999
  );

  const totalSale = await InvoiceModel.aggregate([
    {
      $match: {
        invoiceStatus: "Paid",
        date: { $gte: startOfMonth, $lte: endOfMonth },
      },
    },
    {
      $group: {
        _id: null,
        totalSale: { $sum: "$total" },
      },
    },
  ]);

  const todaySale = await InvoiceModel.aggregate([
    {
      $match: {
        invoiceStatus: "Paid",
        date: { $gte: startOfDay, $lte: endOfDay },
      },
    },
    {
      $group: {
        _id: null,
        todaySale: { $sum: "$total" },
      },
    },
  ]);

  const totalProducts = await ProductModel.countDocuments();
  const totalStaff = await UserModel.countDocuments({
    userRole: { $ne: "Admin" },
  });

  // Handle Empty Aggregation Result
  const totalMonthSale = totalSale[0]?.totalSale || 0;
  const totalTodaySale = todaySale[0]?.todaySale || 0;

  console.log("Total Sale This Month: ", totalMonthSale);
  console.log("Total Sale Today: ", totalTodaySale);

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message: "Sales details fetched successfully.",
      data: {
        totalMonthSale,
        totalTodaySale,
        totalProducts,
        totalStaff,
      },
    })
  );
};
