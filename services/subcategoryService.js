import Subcategory from '../models/Subcategory.js';
import { createError } from '../errors/errors.js';
export const addSubcategoryServices = async (subcategoryData) => {
    const newSubcategory = await Subcategory.create(Object.assign({}, subcategoryData));
    if (!newSubcategory)
        throw createError(400, 'Can not create new category in database');
    return newSubcategory;
};
export const getSubcategoryByCategoryIdServices = async (categoryId) => {
    const subcategories = await Subcategory.find({ categoryId });
    if (!subcategories)
        throw createError(400, 'Can not get subcategories in database');
    return subcategories;
};
