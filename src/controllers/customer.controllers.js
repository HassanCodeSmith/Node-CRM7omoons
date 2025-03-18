import {
  ConflictException,
  ForbiddenException,
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException,
} from "../errors/index.js";
import { CustomerModel } from "../models/customer.model.js";
import { ApiResponce } from "../utils/apiResponce.util.js";

/* __________ Add Customer __________ */
export const addCustomer = async (req, res) => {
  const { phone, email } = req.body;

  const isPhoneExist = await CustomerModel.findOne({ phone });

  if (isPhoneExist) {
    throw new ConflictException("Phone is already taken");
  }

  const isEmailExist = await CustomerModel.findOne({ email });

  if (isEmailExist) {
    throw new ConflictException("Email is already taken");
  }

  const newCustomer = await CustomerModel.create({
    ...req.body,
    agentId: req?.userId,
    repName: req?.loggedInUser?.name,
  });

  return res.status(201).json(
    new ApiResponce({
      statusCode: 200,
      message: "Customer added successfully.",
      data: newCustomer,
    })
  );
};

/* __________ Get All Customer __________ */
export const getAllCustomers = async (req, res) => {
  const { agentId } = req.query;

  let allCustomers;
  if (req.userRole === "Admin") {
    if (!agentId) {
      throw new NotFoundException("Respected admin kindly provide agentId.");
    }
    allCustomers = await CustomerModel.find({ agentId });
  } else {
    allCustomers = await CustomerModel.find({ agentId: req.userId });
  }

  const message =
    allCustomers.length > 0
      ? "Customers collection fetched successfully."
      : "Customers collection is empty";

  const data = allCustomers.length > 0 ? allCustomers : [];

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message,
      data,
    })
  );
};

/* __________ Get Customer __________ */
export const getCustomer = async (req, res) => {
  const { agentId } = req.query;
  const { customerId } = req.params;

  if (!customerId) {
    throw new NotFoundException("Please provide customer id.");
  }

  const findCustomer = await CustomerModel.findOne({ _id: customerId });

  if (!findCustomer) {
    throw new NotFoundException("Customer not found.");
  }

  let customer;
  if (req.userRole === "Admin") {
    if (!agentId) {
      throw new NotFoundException("Respected admin kindly provide agentId.");
    }

    if (findCustomer.agentId.toString() !== agentId) {
      throw new ForbiddenException("Invalid agent");
    }
    customer = await CustomerModel.findOne({
      agentId,
      _id: customerId,
    });
  } else {
    if (findCustomer.agentId.toString() !== req?.userId?.toString()) {
      throw new ForbiddenException("Invalid agent");
    }

    customer = await CustomerModel.findOne({
      agentId: req?.userId,
      _id: customerId,
    });
  }

  if (!customer) {
    throw new InternalServerErrorException("Something went wrong.");
  }

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message: "Customer fetched successfully.",
      data: customer,
    })
  );
};

/* __________ Update Customer __________ */
export const updateCustomer = async (req, res) => {
  const { customerId } = req.params;

  if (!customerId) {
    throw new NotFoundException("Please provide customer id.");
  }

  const findCustomer = await CustomerModel.findOne({ _id: customerId });

  if (!findCustomer) {
    throw new NotFoundException("Customer not found.");
  }

  if (findCustomer.agentId.toString() !== req?.userId?.toString()) {
    throw new ForbiddenException("Invalid agent");
  }

  const updatedCustomer = await CustomerModel.findOneAndUpdate(
    {
      agentId: req.userId,
      _id: customerId,
    },
    { $set: req.body },
    { new: true, runValidators: true }
  );

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message: "Customer updated successfully.",
      data: updatedCustomer,
    })
  );
};

/* __________ Change Status __________ */
export const changeStatus = async (req, res) => {
  const { status } = req?.query;
  const { customerId } = req.params;

  if (!customerId) {
    throw new NotFoundException("Please provide customer id.");
  }

  const validStatuses = ["Active", "InActive"];

  if (status) {
    if (!validStatuses.includes(status)) {
      throw new NotAcceptableException("Please provde correct status value");
    }
  }

  const findCustomer = await CustomerModel.findOne({ _id: customerId });

  if (!findCustomer) {
    throw new NotFoundException("Customer not found.");
  }

  if (findCustomer.agentId.toString() !== req?.userId?.toString()) {
    throw new ForbiddenException("Invalid agent");
  }

  const updatedCustomer = await CustomerModel.findOneAndUpdate(
    {
      agentId: req?.userId,
      _id: customerId,
    },
    { $set: { status: status } },
    { new: true, runValidators: true }
  );

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message: "Customer status updated successfully.",
      data: updatedCustomer,
    })
  );
};

/* __________ Get Input Fields Content __________ */
export const getInputFieldsContent = async (req, res) => {
  const { companyName, customerName } = req.query;

  let filteredCustomers;
  let filteredCompanies;
  let allCompanies;
  let allClients;
  let data;

  if (companyName) {
    filteredCustomers = await CustomerModel.find({
      agentId: req.userId,
      companyName: companyName,
    });
    data = filteredCustomers;
  } else if (customerName) {
    filteredCompanies = await CustomerModel.find({
      agentId: req.userId,
      clientName: customerName,
    });
    data = filteredCompanies;
  } else {
    allCompanies = await CustomerModel.distinct("companyName", {
      agentId: req.userId,
    });

    allClients = await CustomerModel.find({ agentId: req.userId });
    data = { allCompanies, allClients };
  }

  return res.status(200).json(
    new ApiResponce({
      message: "Data fetched successfully.",
      data,
    })
  );
};
