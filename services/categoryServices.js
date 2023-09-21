import Category from '../models/Category.js';
import { createError } from '../errors/errors.js';
export const getAllCategoryServices = async () => {
    const categories = await Category.find();
    return categories;
};
export const addCategoryServices = async (categoryData) => {
    const newCategory = await Category.create(Object.assign({}, categoryData));
    if (!newCategory)
        throw createError(400, 'Can not create new category in database');
    return newCategory;
};
export const editCategoryServices = async (categoryId, categoryData) => {
    const updatedCategory = await Category.findByIdAndUpdate({ _id: categoryId }, Object.assign({}, categoryData), { new: true, runValidators: true });
    if (!updatedCategory)
        throw createError(400, 'Can not create new category in database');
    return updatedCategory;
};
