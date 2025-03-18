import {
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException,
  NotImplementedException,
} from "../errors/index.js";
import { InvoiceModel } from "../models/invoice.model.js";
import { ApiResponce } from "../utils/apiResponce.util.js";
import { invoiceTemplate } from "../Templates/invoice.template.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import puppeteer from "puppeteer";
import { CustomerModel } from "../models/customer.model.js";
import { ProductModel } from "../models/products.model.js";

// Define __dirname manually for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ------------------------------------------------------
                    AGENT CONTROLLERS  
-------------------------------------------------------*/
/* __________ Create Invoice __________ */
export const createInvoice = async (req, res) => {
  req.body.createdBy = req.userId;
  const isCustomerFind = await CustomerModel.findOne({
    _id: req.body.customer,
  });

  if (!isCustomerFind) {
    throw new NotFoundException("Customer not found.");
  }
  console.log("Agent Id: ", isCustomerFind.agentId);
  console.log("LoggedIn User Id: ", req.userId);

  if (isCustomerFind.agentId.toString() !== req.userId.toString()) {
    throw new NotImplementedException("Invalid agent.");
  }

  const newInvoice = await InvoiceModel.create(req.body);

  const invoice = await InvoiceModel.findOne({ _id: newInvoice._id })
    .populate("customer")
    .populate("order.products.product");

  const invoiceHTML = invoiceTemplate({
    invoiceNo: invoice.invoiceNo,
    customerId: invoice.customer.customerId,
    date: invoice.date,
    agentName: invoice.customer.repName,
    customerName: invoice.customer.clientName,
    customerPhone: invoice.customer.phone,
    customerEmail: invoice.customer.email,
    customerCompany: invoice.customer.companyName,
    customerAddress: invoice.customer.address,
    customerCity: invoice.customer.city,
    customerState: invoice.customer.state,
    customerZipCode: invoice.customer.zipCode,
    customerStr: invoice.customer.str || "?",
    tr: invoice.order.products
      .map(
        (item, index) => `
      <tr>
          <td>${index + 1}.</td>
          <td>${item.product.name}</td> 
          <td>${item.quantity}</td> 
          <td>$${item.salePrice}</td> 
          <td>$${item.totalPrice}</td> 
      </tr>
    `
      )
      .join(""),
    subTotal: invoice.subTotal,
    discount: invoice?.discount,
    discountAmount: invoice?.discountAmount,
    shippingFee: invoice.shippingFee,
    total: invoice.total,
  });

  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  await page.setContent(invoiceHTML, { waitUntil: "load" });

  const invoicesDir = path.join(__dirname, "../../public/invoices");
  if (!fs.existsSync(invoicesDir)) {
    fs.mkdirSync(invoicesDir, { recursive: true });
  }

  const timestamp = Date.now();
  const sanitizedClientName = invoice.customer.clientName.replace(/\s+/g, "_");
  const pdfFilename = `${sanitizedClientName}_invoice_${timestamp}.pdf`;
  const pdfPath = path.join(invoicesDir, pdfFilename);

  await page.pdf({
    path: pdfPath,
    format: "A4",
    printBackground: true,
    margin: { top: "10px", right: "20px", bottom: "20px", left: "20px" },
  });

  await browser.close();

  invoice.pdfUrl = `/public/invoices/${pdfFilename}`;

  await invoice.save();

  return res.status(201).json(
    new ApiResponce({
      statusCode: 201,
      message: "Invoice created successfully.",
      data: {
        ...invoice.toObject(),
        pdfUrl: `/public/invoices/${pdfFilename}`, // Return the PDF URL
      },
    })
  );
};

/* __________ Get All Invoices __________ */
export const getAllInvoices = async (req, res) => {
  const { status = "All" } = req.query;
  // const page = parseInt(req.query.page) || 1;
  // const limit = parseInt(req.query.limit) || 10;
  // const skip = (page - 1) * limit;

  const validStatus = ["Pending", "Paid", "Cancel", "All"];

  if (!validStatus.includes(status)) {
    throw new NotAcceptableException("Please provide valid status");
  }

  let allAgentInvoices;
  let totalInvoices;

  if (status === "Pending" || status === "Paid" || status === "Cancel") {
    let findQuery;
    if (req.userRole === "Admin" && req?.query?.userId) {
      findQuery = {
        createdBy: req.query.userId,
        invoiceStatus: status,
      };
    } else {
      findQuery = {
        createdBy: req?.userId,
        invoiceStatus: status,
      };
    }
    allAgentInvoices = await InvoiceModel.find(findQuery)
      .populate("customer")
      .populate({
        path: "order.products.product",
        model: "Product",
        select: "name price",
      })
      .sort({ invoiceNo: -1 });
    // .lean()
    // .skip(skip)
    // .limit(limit);

    // totalInvoices = await InvoiceModel.countDocuments({
    //   createdBy: req?.userId,
    //   invoiceStatus: status,
    // });
  } else {
    let findQuery;
    if (req.userRole === "Admin" && req?.query?.userId) {
      findQuery = {
        createdBy: req.query.userId,
      };
    } else {
      findQuery = {
        createdBy: req?.userId,
      };
    }
    allAgentInvoices = await InvoiceModel.find(findQuery)
      .populate("customer")
      .populate({
        path: "order.products.product",
        model: "Product",
        select: "name price",
      })
      .sort({ invoiceNo: -1 });
    // .lean()
    // .sort({ date: 1 })
    // .skip(skip)
    // .limit(limit);

    // totalInvoices = await InvoiceModel.countDocuments({
    //   createdBy: req?.userId,
    // });
  }

  // const totalPages = Math.ceil(totalInvoices / limit);

  const message =
    allAgentInvoices?.length > 0
      ? `Agent ${req?.loggedInUser?.name}'s all ${
          status !== "All" ? status : ""
        } invoices are fetched successfully.`
      : `Agent ${req?.loggedInUser?.name} has no ${status} invoices`;

  const data = allAgentInvoices?.length > 0 ? allAgentInvoices : [];

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message,
      // pagination: {
      //   page,
      //   limit,
      //   totalPages,
      //   totalInvoices,
      // },
      data,
    })
  );
};

/* __________ Get Invoice By Agent __________ */
export const getInvoiceByAgent = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new NotFoundException("Please provide invoice id.");
  }

  const invoice = await InvoiceModel.findOne({
    _id: id,
    createdBy: req.userId,
  })
    .populate("customer")
    .populate("order.products.product", "name price");

  if (!invoice) {
    throw new NotFoundException("Invoice not found.");
  }

  if (invoice?.createdBy?.toString() !== req?.userId?.toString()) {
    throw new BadRequestException("Invalid agent.");
  }

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      messag: "Invoice fetched successfully.",
      data: invoice,
    })
  );
};

/* __________ Update Invoice __________ */
export const updateInvoice = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new NotFoundException("Please invoice id.");
  }

  const findInvoice = await InvoiceModel.findOne({ _id: id });

  if (!findInvoice) {
    throw new BadRequestException("Invoice not found.");
  }

  if (findInvoice.createdBy.toString() !== req.userId.toString()) {
    throw new ForbiddenException("Invalid agent");
  }

  const updatedInvoice = await InvoiceModel.findOneAndUpdate(
    { _id: id, createdBy: req.userId },
    req.body,
    { new: true, runValidators: true, upsert: true }
  );

  return res.status(201).json(
    new ApiResponce({
      statusCode: 201,
      message: "Invoice Updated successfully.",
      data: updatedInvoice,
    })
  );
};

/* __________ Update Invoice Status __________ */
export const changeInvoiceStatus = async (req, res) => {
  const { invoiceStatus } = req.query;
  const { id } = req.params;

  if (!id) {
    throw new NotFoundException("Invoice id is required");
  }

  if (!invoiceStatus) {
    throw new NotFoundException("Order status is required.");
  }

  const validStatuses = ["Pending", "Paid", "Cancel"];

  if (!validStatuses.includes(invoiceStatus)) {
    throw new NotAcceptableException("Please provide valid status.");
  }

  const findInvoice = await InvoiceModel.findOne({ _id: id }).populate(
    "order.products.product"
  );

  if (!findInvoice) {
    throw new BadRequestException("Invoice not found.");
  }

  if (findInvoice.createdBy.toString() !== req.userId.toString()) {
    throw new ForbiddenException("Invalid agent.");
  }

  let updatedInvoice;
  if (invoiceStatus === "Paid") {
    for (let item of findInvoice.order.products) {
      const product = await ProductModel.findById(item.product._id);
      if (product) {
        product.quantity -= item.quantity;
        await product.save();
      }
    }

    updatedInvoice = await InvoiceModel.findOneAndUpdate(
      { _id: id, createdBy: req.userId },
      { $set: { invoiceStatus: invoiceStatus } },
      { new: true, runValidators: true }
    );
  } else {
    updatedInvoice = await InvoiceModel.findOneAndUpdate(
      { _id: id, createdBy: req.userId },
      { $set: { invoiceStatus: invoiceStatus } },
      { new: true, runValidators: true }
    );
  }

  if (!updatedInvoice) {
    throw new InternalServerErrorException("Something went wrong");
  }

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message: "Invoice status updated successfully.",
      data: updatedInvoice,
    })
  );
};

/* __________ Update Invoice Order Status __________ */
export const changeOrderStatus = async (req, res) => {
  const { status } = req.query;
  const { id } = req.params;

  if (!id) {
    throw new NotFoundException("Invoice id is required");
  }

  if (!status) {
    throw new NotFoundException("Order status is required.");
  }

  const validStatuses = ["Pending", "InProcess", "Shipped", "Delivered"];

  if (!validStatuses.includes(status)) {
    throw new NotAcceptableException("Please provide valid status.");
  }

  const findInvoice = await InvoiceModel.findOne({ _id: id });

  if (!findInvoice) {
    throw new BadRequestException("Invoice not found.");
  }

  if (findInvoice.createdBy.toString() !== req.userId.toString()) {
    throw new ForbiddenException("Invalid agent.");
  }

  if (
    findInvoice.invoiceStatus === "Pending" ||
    findInvoice.invoiceStatus === "Cancel"
  ) {
    throw new ForbiddenException(
      "You cannot update the order status while the invoice status is not become paid"
    );
  }

  const updatedInvoice = await InvoiceModel.findOneAndUpdate(
    { _id: id, createdBy: req.userId },
    { $set: { "order.orderStatus": status } },
    { new: true }
  );

  if (!updatedInvoice) {
    throw new InternalServerErrorException("Something went wrong");
  }

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message: "Order status updated successfully.",
      data: updatedInvoice,
    })
  );
};

/* ------------------------------------------------------
                    ADMIN CONTROLLERS 
-------------------------------------------------------*/
/* __________ Get All Invoices By Admin __________ */
export const getAllInvoicesByAdmin = async (req, res) => {
  const { id } = req.params;
  // const { status = "All" } = req.query;
  // const page = parseInt(req.query.page) || 1;
  // const limit = parseInt(req.query.limit) || 10;

  if (!id) {
    throw new NotFoundException("Agent id is required.");
  }

  // const skip = (page - 1) * limit;

  const validStatus = ["Pending", "Paid", "Cancel", "All"];

  if (!validStatus.includes(status)) {
    throw new NotAcceptableException("Please provide valid status");
  }

  let allAgentInvoices;
  let totalInvoices;

  if (status === "Pending" || status === "Paid" || status === "Cancel") {
    allAgentInvoices = await InvoiceModel.find({
      createdBy: id,
      invoiceStatus: status,
    }).populate("order.products.product", "name price");
    // .sort({ date: 1 })
    // .skip(skip)
    // .limit(limit);

    totalInvoices = await InvoiceModel.countDocuments({
      createdBy: id,
      invoiceStatus: status,
    });
  } else {
    allAgentInvoices = await InvoiceModel.find({ createdBy: id }).populate(
      "order.products.product",
      "name price"
    );
    //   .sort({ date: 1 })
    //   .skip(skip)
    //   .limit(limit);
    // totalInvoices = await InvoiceModel.countDocuments({
    //   createdBy: req?.userId,
    // });
  }

  // const totalPages = Math.ceil(totalInvoices / limit);

  const message =
    allAgentInvoices?.length > 0
      ? `${status} Invoices fetched successfully.`
      : `Have no any ${status} invoice`;

  const data = allAgentInvoices?.length > 0 ? allAgentInvoices : [];

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message,
      // pagination: {
      //   page,
      //   limit,
      //   totalPages,
      //   totalInvoices,
      // },
      data,
    })
  );
};

/* __________ Get Invoice By Admin __________ */
export const getInvoiceByAdmin = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new NotFoundException("Please provide invoice id.");
  }

  const invoice = await InvoiceModel.findOne({
    _id: id,
  }).populate("order.products.product", "name price");

  if (!invoice) {
    throw new NotFoundException("Invoice not found.");
  }

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      messag: "Invoice fetched successfully.",
      data: invoice,
    })
  );
};
