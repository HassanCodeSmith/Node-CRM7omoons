import { Router } from "express";
import { trimBodyObject } from "../middlewares/trimBodyObject.middleware.js";
import { checkRequiredFields } from "../middlewares/checkRequiredFields.middleware.js";
import { adminAuth } from "../middlewares/adminAuth.middleware.js";
import {
  addProduct,
  deleteProduct,
  getAllProducts,
  getProduct,
  updateProduct,
} from "../controllers/product.controllers.js";
import { upload } from "../middlewares/upload.middleware.js";

const productRouter = Router();

// Add Product
productRouter
  .route("/add-product")
  .post(
    adminAuth,
    upload.single("image"),
    trimBodyObject,
    checkRequiredFields(["name", "price", "quantity"]),
    addProduct
  );

// Get All Products
productRouter.route("/get-all-products").get(getAllProducts);

// Get Product By Id
productRouter.route("/get-product/:id").get(getProduct);

// Update Product
productRouter
  .route("/update-product/:id")
  .patch(
    adminAuth,
    upload.single("image"),
    trimBodyObject,
    checkRequiredFields(["name", "price", "quantity"]),
    updateProduct
  );

// Delete Product
productRouter.route("/delete-product/:id").delete(adminAuth, deleteProduct);

export { productRouter };
