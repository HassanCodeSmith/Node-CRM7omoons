import { InternalServerErrorException } from "../errors/internalServerErrorException.error.js";
import { NotFoundException } from "../errors/notFoundException.error.js";
import { UserModel } from "../models/user.model.js";
import { ApiResponce } from "../utils/apiResponce.util.js";

/* __________ Create Agent __________ */
export const createAgent = async (req, res) => {
  await UserModel.create(req.body);
  return res.status(201).json(
    new ApiResponce({
      statusCode: 200,
      message: "Agent created successfully.",
    })
  );
};

/* __________ Get All Agents __________ */
export const getAllAgents = async (req, res) => {
  let allAgents = await UserModel.find({ userRole: { $ne: "Admin" } });

  const message =
    allAgents.length > 0
      ? "All agents fetched successfully"
      : "Agent's collection is empty.";

  const data = allAgents.length > 0 ? allAgents : [];

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message,
      data,
    })
  );
};

/* __________ Get Agent By Id __________ */
export const getAgentById = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new NotFoundException("Agent id is required.");
  }

  let agent = await UserModel.find({ _id: id, userRole: "Agent" });

  if (!agent) {
    throw new NotFoundException("Agent not found with provided id.");
  }

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message: "Agent details fetched successfully.",
      data: agent,
    })
  );
};

/* __________ Update Agent __________ */
export const updateAgent = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new NotFoundException("Agent id is required.");
  }

  const updatedAgent = await UserModel.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
  });

  if (!updatedAgent) {
    throw new NotFoundException("Agent not found.");
  }

  return res.status(200).json(
    new ApiResponce({
      message: "Agent updated successfully",
    })
  );
};
