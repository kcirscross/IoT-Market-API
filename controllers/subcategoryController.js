import { addSubcategoryServices, getSubcategoryByCategoryIdServices, } from '../services/subcategoryService.js';
export const addSubcategory = async (req, res, next) => {
    const subcategoryData = req.body;
    try {
        const newSubcategory = await addSubcategoryServices(subcategoryData);
        if (newSubcategory) {
            return res.status(200).json({
                message: 'Add new subcategories successfully',
                newSubcategory,
            });
        }
    }
    catch (err) {
        next(err);
    }
};
export const getSubcategoryByCategoryId = async (req, res, next) => {
    const { categoryId } = req.params;
    try {
        const subcategories = await getSubcategoryByCategoryIdServices(categoryId);
        if (subcategories) {
            return res.status(200).json({
                message: 'Get subcategories successfully',
                subcategories,
            });
        }
    }
    catch (err) {
        next(err);
    }
};
