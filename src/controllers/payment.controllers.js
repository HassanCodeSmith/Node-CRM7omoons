// import dotenv from "dotenv";
// import Stripe from "stripe";
// import { ApiResponce } from "../utils/apiResponce.util.js";
// import { PaymentModel } from "../models/payment.model.js";
// import { ConflictException } from "../errors/index.js";

// dotenv.config();
// const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

// /* __________ Creat Payment __________ */
// export const createPayment = async (req, res) => {
//   const isCustomerExists = await PaymentModel.findOne({
//     email: req.body.email,
//   });

//   if (isCustomerExists) {
//     throw new ConflictException("Customer already exists.", {
//       data: { id: isCustomerExists.customerPaymentId },
//     });
//   }

//   const newCustomer = await stripeInstance.customers.create({
//     name: req.body.name,
//     email: req.body.email,
//     phone: req.body.phone,
//     metadata: { company: req.body.company },
//   });

//   const session = await stripeInstance.checkout.sessions.create({
//     customer: newCustomer.id,
//     payment_method_types: ["card"],
//     success_url: "https://example.com/success",
//     currency: "usd",
//     line_items: [
//       {
//         price_data: {
//           currency: "usd",
//           product_data: {
//             name: "Invoice Payment",
//           },
//           unit_amount: parseFloat(req.body.amount) * 100,
//         },
//         quantity: 1,
//       },
//     ],
//     mode: "payment",
//   });

//   await PaymentModel.create({
//     email: req.body.email,
//     customerPaymentId: newCustomer.id,
//   });

//   return res.status(200).json(
//     new ApiResponce({
//       message: "Payment created successfully.",
//       data: newCustomer,
//       session,
//     })
//   );
// };
