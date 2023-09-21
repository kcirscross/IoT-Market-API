import Product, { IProduct } from "../models/Product.js";
import { createError } from "../errors/errors.js";
import Category from "../models/Category.js";
import Subcategory from "../models/Subcategory.js";
import User from "../models/User.js";
import { IProductListOrder } from "../models/Order.js";
import ContentBasedRecommender from "content-based-recommender";

export const getAllProductServices = async (
  sortBy: string
): Promise<IProduct[]> => {
  let products: IProduct[];

  switch (sortBy) {
    case "pop":
      products = await Product.find({ numberInStock: { $gte: 1 } })
        .select(
          "_id ownerId thumbnailImage productName price soldCount condition isStore"
        )
        .sort({ "rating.ratingValue": -1 });
      return products;
    case "new":
      products = await Product.find({ numberInStock: { $gte: 1 } })
        .select(
          "_id ownerId thumbnailImage productName price soldCount condition isStore"
        )
        .sort({ updatedAt: -1 });
      return products;
    case "sale":
      products = await Product.find({ numberInStock: { $gte: 1 } })
        .select(
          "_id ownerId thumbnailImage productName price soldCount condition isStore"
        )
        .sort({ soldCount: -1 });
      return products;
    case "pricedesc":
      products = await Product.find({ numberInStock: { $gte: 1 } })
        .select(
          "_id ownerId thumbnailImage productName price soldCount condition isStore"
        )
        .sort({ price: -1 });
      return products;
    case "priceacs":
      products = await Product.find({ numberInStock: { $gte: 1 } })
        .select(
          "_id ownerId thumbnailImage productName price soldCount condition isStore"
        )
        .sort({ price: 1 });
      return products;
    default:
      products = await Product.find({ numberInStock: { $gte: 1 } })
        .select(
          "_id ownerId thumbnailImage productName price soldCount condition isStore"
        )
        .sort({ "rating.ratingValue": -1 });
      return products;
  }
};

export const getRecommendServices = async (
  productId: string
): Promise<IProduct[]> => {
  let products: IProduct[];
  let productProfiles = [];

  products = await Product.find().select("_id description");

  products.forEach((product) => {
    productProfiles.push({
      id: product._id,
      content: product.description,
    });
  });

  let recommend = new ContentBasedRecommender({
    minScore: 0.1,
    maxSimilarDocuments: 100,
  });

  recommend.train(productProfiles);

  var similarDocuments = recommend.getSimilarDocuments(productId, 0, 10);

  let tempArr = [];
  similarDocuments.forEach((item) => {
    tempArr.push(item.id);
  });

  const resultProduct = await Product.find({ _id: { $in: tempArr } });

  return resultProduct;
};

export const getProductByCategoryServices = async (
  categoryId: string,
  sortBy: string
): Promise<IProduct[]> => {
  if (!categoryId) throw createError(400, "Please provide category ID!");
  let products: IProduct[];

  switch (sortBy) {
    case "pop":
      products = await Product.find({ categoryId, numberInStock: { $gte: 1 } })
        .select(
          "_id ownerId thumbnailImage productName price soldCount condition isStore"
        )
        .sort({ "rating.ratingValue": -1 });
      return products;
    case "new":
      products = await Product.find({ categoryId, numberInStock: { $gte: 1 } })
        .select(
          "_id ownerId thumbnailImage productName price soldCount condition isStore"
        )
        .sort({ updatedAt: -1 });
      return products;
    case "sale":
      products = await Product.find({ categoryId, numberInStock: { $gte: 1 } })
        .select(
          "_id ownerId thumbnailImage productName price soldCount condition isStore"
        )
        .sort({ soldCount: -1 });
      return products;
    case "pricedesc":
      products = await Product.find({ categoryId, numberInStock: { $gte: 1 } })
        .select(
          "_id ownerId thumbnailImage productName price soldCount condition isStore"
        )
        .sort({ price: -1 });
      return products;
    case "priceacs":
      products = await Product.find({ categoryId, numberInStock: { $gte: 1 } })
        .select(
          "_id ownerId thumbnailImage productName price soldCount condition isStore"
        )
        .sort({ price: 1 });
      return products;
    default:
      products = await Product.find({ categoryId, numberInStock: { $gte: 1 } })
        .select(
          "_id ownerId thumbnailImage productName price soldCount condition isStore"
        )
        .sort({ "rating.ratingValue": -1 });
      return products;
  }
};

export const getProductBySubcategoryServices = async (
  subcategoryId: string,
  sortBy: string
): Promise<IProduct[]> => {
  if (!subcategoryId) throw createError(400, "Please provide subcategory ID!");
  let products: IProduct[];

  switch (sortBy) {
    case "pop":
      products = await Product.find({
        subcategoryId,
        numberInStock: { $gte: 1 },
      })
        .select(
          "_id ownerId thumbnailImage productName price soldCount condition isStore"
        )
        .sort({ "rating.ratingValue": -1 });
      return products;
    case "new":
      products = await Product.find({
        subcategoryId,
        numberInStock: { $gte: 1 },
      })
        .select(
          "_id ownerId thumbnailImage productName price soldCount condition isStore"
        )
        .sort({ updatedAt: -1 });
      return products;
    case "sale":
      products = await Product.find({
        subcategoryId,
        numberInStock: { $gte: 1 },
      })
        .select(
          "_id ownerId thumbnailImage productName price soldCount condition isStore"
        )
        .sort({ soldCount: -1 });
      return products;
    case "pricedesc":
      products = await Product.find({
        subcategoryId,
        numberInStock: { $gte: 1 },
      })
        .select(
          "_id ownerId thumbnailImage productName price soldCount condition isStore"
        )
        .sort({ price: -1 });
      return products;
    case "priceacs":
      products = await Product.find({
        subcategoryId,
        numberInStock: { $gte: 1 },
      })
        .select(
          "_id ownerId thumbnailImage productName price soldCount condition isStore"
        )
        .sort({ price: 1 });
      return products;
    default:
      products = await Product.find({
        subcategoryId,
        numberInStock: { $gte: 1 },
      })
        .select(
          "_id ownerId thumbnailImage productName price soldCount condition isStore"
        )
        .sort({ "rating.ratingValue": -1 });
      return products;
  }
};

export const getProductByUserServices = async (
  ownerId: string,
  sortBy: string
): Promise<IProduct[]> => {
  if (!ownerId) throw createError(400, "Please provide User ID or Store ID!");
  let products: IProduct[];

  switch (sortBy) {
    case "pop":
      products = await Product.find({ ownerId, numberInStock: { $gte: 1 } })
        .select(
          "_id ownerId thumbnailImage productName price soldCount condition isStore rating"
        )
        .sort({ "rating.ratingValue": -1 });
      return products;
    case "new":
      products = await Product.find({ ownerId, numberInStock: { $gte: 1 } })
        .select(
          "_id ownerId thumbnailImage productName price soldCount condition isStore rating"
        )
        .sort({ updatedAt: -1 });
      return products;
    case "sale":
      products = await Product.find({ ownerId, numberInStock: { $gte: 1 } })
        .select(
          "_id ownerId thumbnailImage productName price soldCount condition isStore rating"
        )
        .sort({ soldCount: -1 });
      return products;
    case "pricedesc":
      products = await Product.find({ ownerId, numberInStock: { $gte: 1 } })
        .select(
          "_id ownerId thumbnailImage productName price soldCount condition isStore rating"
        )
        .sort({ price: -1 });
      return products;
    case "priceacs":
      products = await Product.find({ ownerId, numberInStock: { $gte: 1 } })
        .select(
          "_id ownerId thumbnailImage productName price soldCount condition isStore rating"
        )
        .sort({ price: 1 });
      return products;
    default:
      products = await Product.find({ ownerId, numberInStock: { $gte: 1 } })
        .select(
          "_id ownerId thumbnailImage productName price soldCount condition isStore rating"
        )
        .sort({ "rating.ratingValue": -1 });
      return products;
  }
};

export const getMyProductService = async (
  userId: string,
  sortBy: string
): Promise<IProduct[]> => {
  if (!userId) throw createError(400, "Please provide User ID!");
  let products: IProduct[];

  switch (sortBy) {
    case "pop":
      products = await Product.find({ ownerId: userId }).sort({
        "rating.ratingValue": -1,
      });
      return products;
    case "new":
      products = await Product.find({ ownerId: userId }).sort({
        updatedAt: -1,
      });
      return products;
    case "sale":
      products = await Product.find({ ownerId: userId }).sort({
        soldCount: -1,
      });
      return products;
    case "pricedesc":
      products = await Product.find({ ownerId: userId }).sort({ price: -1 });
      return products;
    case "priceacs":
      products = await Product.find({ ownerId: userId }).sort({ price: 1 });
      return products;
    default:
      products = await Product.find({ ownerId: userId }).sort({
        "rating.ratingValue": -1,
      });
      return products;
  }
};

export const getProductInfoService = async (
  productId: string
): Promise<IProduct> => {
  if (!productId) throw createError(400, "Please provide Product ID!");

  const product: IProduct = await Product.findById({ _id: productId });
  return product;
};

export const getProductInfoAdminService = async (
  productId: string
): Promise<IProduct> => {
  if (!productId) throw createError(400, "Please provide Product ID!");

  const product: IProduct = await Product.findById({ _id: productId }).populate(
    "subcategoryId categoryId"
  );
  return product;
};

export const addProductServices = async (
  userId: string,
  roles: Array<string>,
  data: IProduct
): Promise<IProduct> => {
  let isStore = false;

  const owner = await User.findById({ _id: userId });
  if (owner) {
    if (
      !owner.phoneNumber ||
      owner.phoneNumber === "" ||
      owner.address.city === "" ||
      owner.address.district === "" ||
      owner.address.district === ""
    )
      throw createError(
        400,
        "User must update phone number and address before upload product"
      );
  }

  if (roles.includes("Store")) isStore = true;
  const newProduct: IProduct = await Product.create({
    ...data,
    ownerId: userId,
    isStore,
  });

  if (!newProduct) {
    throw createError(400, "Can not create new product in database");
  }

  await Subcategory.findOneAndUpdate(
    { _id: data.subcategoryId, categoryId: data.categoryId },
    { $inc: { numberOfGoodsInSubcategory: 1 } }
  );

  await Category.findOneAndUpdate(
    { _id: data.categoryId },
    { $inc: { numberOfGoodsInCategory: 1 } }
  );

  return newProduct;
};

export const editProductServices = async (
  ownerId: string,
  productId: string,
  updateData: IProduct
): Promise<IProduct> => {
  const product: IProduct = await Product.findById(productId);
  if (product.ownerId.toString() != ownerId)
    throw createError(403, "You can only edit your products!");

  const updatedProduct: IProduct = await Product.findByIdAndUpdate(
    { _id: productId },
    updateData,
    { new: true, runValidators: true }
  );
  if (!updatedProduct) {
    throw createError(400, "Can not update product in database");
  }

  return updatedProduct;
};

export const deleteProductServices = async (
  ownerId: string,
  productId: string
): Promise<IProduct> => {
  const product: IProduct = await Product.findById(productId);
  if (product.ownerId.toString() != ownerId)
    throw createError(403, "You can only delete your products!");

  const deletedProduct: IProduct = await Product.findByIdAndDelete({
    _id: productId,
  });
  if (!deletedProduct) {
    throw createError(400, "Can not delete product in database");
  }

  await Subcategory.findOneAndUpdate(
    {
      _id: deletedProduct.subcategoryId,
      categoryId: deletedProduct.categoryId,
    },
    { $inc: { numberOfGoodsInSubcategory: -1 } }
  );

  await Category.findOneAndUpdate(
    { _id: deletedProduct.categoryId },
    { $inc: { numberOfGoodsInCategory: -1 } }
  );

  return deletedProduct;
};

export const updateProductQuantityAfterBuyingServices = async (
  items: {
    name: string;
    quantity: number;
    weight: number;
  }[]
) => {
  const updated = items.forEach(async (item) => {
    await Product.findByIdAndUpdate(
      { _id: item.name },
      {
        $inc: { numberInStock: -item.quantity, soldCount: item.quantity },
      }
    );
  });
  return updated;
};
