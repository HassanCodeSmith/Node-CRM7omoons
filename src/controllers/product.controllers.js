import { NotFoundException } from "../errors/index.js";
import { ProductModel } from "../models/products.model.js";
import { ApiResponce } from "../utils/apiResponce.util.js";

/* __________ Add Product __________ */
export const addProduct = async (req, res) => {
  if (!req.file) {
    throw new NotFoundException("Product image is required.");
  }

  req.body.image = req.file.path.replace(/\\/g, "/");

  const newProduct = await ProductModel.create(req.body);

  return res.status(201).json(
    new ApiResponce({
      statusCode: 201,
      message: "New product added successfully.",
      data: newProduct,
    })
  );
};

/* __________ Get All Products __________ */
export const getAllProducts = async (req, res) => {
  const allProducts = await ProductModel.find({});

  const message =
    allProducts.length > 0
      ? "Products collection fetched successfully."
      : "Products collection is empty";

  const data = allProducts.length > 0 ? allProducts : [];

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message,
      data,
    })
  );
};

/* __________ Get Product By Id __________ */
export const getProduct = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new NotFoundException("Product id is required.");
  }

  const productDetails = await ProductModel.findOne({ _id: id });

  if (!productDetails) {
    throw new NotFoundException("Product not found.");
  }

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message: "Product feteched successfully.",
      data: productDetails,
    })
  );
};

/* __________ Update Product By Id __________ */
export const updateProduct = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new NotFoundException("Product id is required.");
  }

  if (req.file) {
    req.body.image = req.file.path.replace(/\\/g, "/");
  }

  const updatedProduct = await ProductModel.findOneAndUpdate(
    { _id: id },
    { $set: req.body },
    { new: true }
  );

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message: "Product updated successfully.",
      data: updatedProduct,
    })
  );
};

/* __________ Delete Product By Id __________ */
export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new NotFoundException("Product id is required.");
  }

  const deletedProduct = await ProductModel.findOneAndDelete({ _id: id });

  if (!deletedProduct) {
    throw new NotFoundException("Product not found.");
  }

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message: "Product deleted successfully.",
      data: deletedProduct,
    })
  );
};
