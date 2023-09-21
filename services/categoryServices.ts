import Category, { ICategory } from '../models/Category.js';

import { createError } from '../errors/errors.js';

export const getAllCategoryServices = async (): Promise<ICategory[]> => {
  const categories: ICategory[] = await Category.find();
  return categories;
};

export const addCategoryServices = async (
  categoryData: ICategory
): Promise<ICategory> => {
  const newCategory: ICategory = await Category.create({ ...categoryData });
  if (!newCategory)
    throw createError(400, 'Can not create new category in database');
  return newCategory;
};

export const editCategoryServices = async (
  categoryId: string,
  categoryData: ICategory
): Promise<ICategory> => {
  const updatedCategory: ICategory = await Category.findByIdAndUpdate(
    { _id: categoryId },
    { ...categoryData },
    { new: true, runValidators: true }
  );
  if (!updatedCategory)
    throw createError(400, 'Can not create new category in database');
  return updatedCategory;
};
