import { getRecommendServices } from "./../services/productServices";
import { IProduct } from "../models/Product.js";
import {
  addProductServices,
  deleteProductServices,
  editProductServices,
  getAllProductServices,
  getMyProductService,
  getProductByCategoryServices,
  getProductBySubcategoryServices,
  getProductByUserServices,
  getProductInfoAdminService,
  getProductInfoService,
} from "../services/productServices.js";

export const getAllProduct = async (req, res, next) => {
  const { sortBy } = req.query;
  try {
    const products = await getAllProductServices(sortBy);
    if (products)
      res.status(200).json({ message: "Get products successfully", products });
  } catch (err) {
    next(err);
  }
};

export const getProductByCategory = async (req, res, next) => {
  const { categoryId } = req.params;
  const { sortBy } = req.query;
  try {
    const products = await getProductByCategoryServices(categoryId, sortBy);
    if (products)
      res.status(200).json({ message: "Get products successfully", products });
  } catch (err) {
    next(err);
  }
};

export const getProductBySubcategory = async (req, res, next) => {
  const { subcategoryId } = req.params;
  const { sortBy } = req.query;
  try {
    const products = await getProductBySubcategoryServices(
      subcategoryId,
      sortBy
    );
    if (products)
      res.status(200).json({ message: "Get products successfully", products });
  } catch (err) {
    next(err);
  }
};

export const getProductByUser = async (req, res, next) => {
  const { sortBy } = req.query;
  const { ownerId } = req.params;
  try {
    const products = await getProductByUserServices(ownerId, sortBy);
    if (products)
      res.status(200).json({ message: "Get products successfully", products });
  } catch (err) {
    next(err);
  }
};

export const getMyProduct = async (req, res, next) => {
  const { sortBy } = req.query;
  const { userId } = req.user;
  try {
    const products = await getMyProductService(userId, sortBy);
    if (products)
      res.status(200).json({ message: "Get products successfully", products });
  } catch (err) {
    next(err);
  }
};

export const getProductInfo = async (req, res, next) => {
  const { productId } = req.params;
  try {
    const product = await getProductInfoService(productId);
    if (product)
      res.status(200).json({ message: "Get products successfully", product });
  } catch (err) {
    next(err);
  }
};

export const getProductInfoAdmin = async (req, res, next) => {
  const { productId } = req.params;
  try {
    const product = await getProductInfoAdminService(productId);
    if (product)
      res.status(200).json({ message: "Get products successfully", product });
  } catch (err) {
    next(err);
  }
};

export const addProduct = async (req, res, next) => {
  const { userId, roles }: { userId: string; roles: Array<string> } = req.user;
  const productData: IProduct = req.body;

  try {
    const newProduct = await addProductServices(userId, roles, productData);
    if (newProduct)
      res.status(200).json({ message: "Add product successfully", newProduct });
  } catch (err) {
    next(err);
  }
};

export const editProduct = async (req, res, next) => {
  const { userId }: { userId: string } = req.user;
  const { productId } = req.params;
  const updateData: IProduct = req.body;

  try {
    const updatedProduct = await editProductServices(
      userId,
      productId,
      updateData
    );
    if (updatedProduct)
      res
        .status(200)
        .json({ message: "Updated product successfully", updatedProduct });
  } catch (err) {
    next(err);
  }
};

export const deleteProduct = async (req, res, next) => {
  const { userId }: { userId: string } = req.user;
  const { productId } = req.params;

  try {
    const deletedProduct = await deleteProductServices(userId, productId);
    if (deletedProduct)
      res
        .status(200)
        .json({ message: "Deleted product successfully", deletedProduct });
  } catch (err) {
    next(err);
  }
};

export const getRecommend = async (req, res, next) => {
  const { favorite } = req.body;

  try {
    const product = await getRecommendServices(favorite);

    res.status(200).json({ message: "Get products successfully", product });
  } catch (err) {
    next(err);
  }
};
