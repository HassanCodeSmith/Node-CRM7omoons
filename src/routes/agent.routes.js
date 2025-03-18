import { Router } from "express";
import { loginAuth } from "../middlewares/loginAuth.middleware.js";
import { adminAuth } from "../middlewares/adminAuth.middleware.js";
import { trimBodyObject } from "../middlewares/trimBodyObject.middleware.js";
import { checkRequiredFields } from "../middlewares/checkRequiredFields.middleware.js";
import {
  createAgent,
  getAgentById,
  getAllAgents,
  updateAgent,
} from "../controllers/agent.controllers.js";
import { emailValidator } from "../middlewares/emailValidation.middleware.js";

const agentRouter = Router();

// Create Agent
agentRouter
  .route("/create-agent")
  .post(
    loginAuth,
    adminAuth,
    trimBodyObject,
    checkRequiredFields(["name", "email", "phone", "password"]),
    emailValidator,
    createAgent
  );

// Get All Agents
agentRouter.route("/get-all-agents").get(getAllAgents);

// Get Agent By Id
agentRouter.route("/get-agent/:id").get(getAgentById);

// Update Agent
agentRouter.route("/update-agent/:id").put(updateAgent);

export { agentRouter };
