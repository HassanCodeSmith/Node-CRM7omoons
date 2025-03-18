import { Router } from "express";

/* __________ Middlewares __________ */
import { trimBodyObject } from "../middlewares/trimBodyObject.middleware.js";
import { checkRequiredFields } from "../middlewares/checkRequiredFields.middleware.js";
import { loginAuth } from "../middlewares/loginAuth.middleware.js";
import { agentAuth } from "../middlewares/agentAuth.middleware.js";
import { adminAuth } from "../middlewares/adminAuth.middleware.js";
import { emailValidator } from "../middlewares/emailValidation.middleware.js";

/* __________ Utils __________ */
import { ApiResponce } from "../utils/apiResponce.util.js";

/* __________ Models __________ */
import { UserModel } from "../models/user.model.js";

/* __________ Errors __________ */
import { NotFoundException } from "../errors/notFoundException.error.js";
import { BadRequestException } from "../errors/badRequestException.error.js";

/* __________ Routers __________ */
import { agentRouter } from "./agent.routes.js";
import { customerRouter } from "./customer.routes.js";
import { productRouter } from "./product.routes.js";
import { invoiceRouter } from "./invoice.routes.js";
import { dashboardRouter } from "./dashboard.routes.js";
// import { paymentRouter } from "./payment.routes.js";

const router = Router();

// Login
router.post(
  "/login",
  trimBodyObject,
  checkRequiredFields(["email", "password"]),
  emailValidator,
  async (req, res) => {
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user) {
      console.error("Wrong credentials.");
      throw new NotFoundException("Wrong credentials.");
    }

    if (req?.body?.password !== user.password) {
      console.error("Wrong email or password");
      throw new BadRequestException("Wrong email or password");
    }

    const token = user.generateJWT();

    return res.status(200).json(
      new ApiResponce({
        statusCode: 200,
        message: "Login successfull.",
        data: {
          name: user.name,
          email: user.email,
          userRole: user.userRole,
        },

        token,
      })
    );
  }
);

router.use("/agent", loginAuth, adminAuth, agentRouter);

router.use("/customer", loginAuth, customerRouter);

router.use("/product", loginAuth, productRouter);

router.use("/invoice", loginAuth, invoiceRouter);

router.use("/dashboard", loginAuth, dashboardRouter);

// router.use("/payment", loginAuth, paymentRouter);

export { router };
