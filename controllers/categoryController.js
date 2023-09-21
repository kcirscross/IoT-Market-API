import { addCategoryServices, editCategoryServices, getAllCategoryServices, } from '../services/categoryServices.js';
export const getAllCategory = async (req, res, next) => {
    try {
        const categories = await getAllCategoryServices();
        if (categories) {
            return res
                .status(200)
                .json({ message: 'Get all categories successfully', categories });
        }
    }
    catch (err) {
        next(err);
    }
};
export const addCategory = async (req, res, next) => {
    const categoryData = req.body;
    try {
        const newCategory = await addCategoryServices(categoryData);
        if (newCategory) {
            return res
                .status(200)
                .json({ message: 'Add new categories successfully', newCategory });
        }
    }
    catch (err) {
        next(err);
    }
};
export const editCategory = async (req, res, next) => {
    const categoryData = req.body;
    const { categoryId } = req.params;
    try {
        const updatedCategory = await editCategoryServices(categoryId, categoryData);
        if (updatedCategory) {
            return res
                .status(200)
                .json({ message: 'Edit categories successfully', updatedCategory });
        }
    }
    catch (err) {
        next(err);
    }
};
