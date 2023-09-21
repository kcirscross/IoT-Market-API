import express from 'express';
import { addCategory, editCategory, getAllCategory, } from '../controllers/categoryController.js';
import { adminAuthentication } from '../middlewares/index.js';
const router = express.Router();
router.get('/', getAllCategory);
router.post('/', adminAuthentication, addCategory);
router.patch('/:categoryId', adminAuthentication, editCategory);
export const categoryRouter = router;
