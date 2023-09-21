import express from 'express';
import { addSubcategory, getSubcategoryByCategoryId } from '../controllers/subcategoryController.js';
import { adminAuthentication } from '../middlewares/index.js';

const router = express.Router();

router.post('/', adminAuthentication, addSubcategory);
router.get('/:categoryId', getSubcategoryByCategoryId)
export const subcategoryRouter = router;
