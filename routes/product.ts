import express from "express";

import {
  addProduct,
  deleteProduct,
  editProduct,
  getAllProduct,
  getMyProduct,
  getProductByCategory,
  getProductBySubcategory,
  getProductByUser,
  getProductInfo,
  getProductInfoAdmin,
  getRecommend,
} from "../controllers/productController.js";
import {
  adminAuthentication,
  storeAuthentication,
  userAuthentication,
} from "../middlewares/index.js";

const router = express.Router();

router.get("/", getAllProduct);
router.get("/me", userAuthentication, storeAuthentication, getMyProduct);
router.post(
  "/recommend",
  userAuthentication,
  storeAuthentication,
  getRecommend
);
router.get("/user/:ownerId", getProductByUser);
router.get("/category/:categoryId", getProductByCategory);
router.get("/subcategory/:subcategoryId", getProductBySubcategory);
router.post("/", userAuthentication, storeAuthentication, addProduct);
router.get("/:productId", getProductInfo);
router.get("/admin/:productId", adminAuthentication, getProductInfoAdmin);

router.patch(
  "/:productId",
  userAuthentication,
  storeAuthentication,
  editProduct
);
router.delete(
  "/:productId",
  userAuthentication,
  storeAuthentication,
  deleteProduct
);

export const productRouter = router;
