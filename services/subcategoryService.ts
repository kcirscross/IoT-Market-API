import Subcategory, { ISubcategory } from '../models/Subcategory.js';
import { createError } from '../errors/errors.js';

export const addSubcategoryServices = async (
  subcategoryData: ISubcategory
): Promise<ISubcategory> => {
  const newSubcategory: ISubcategory = await Subcategory.create({
    ...subcategoryData,
  });
  if (!newSubcategory)
    throw createError(400, 'Can not create new category in database');
  return newSubcategory;
};

export const getSubcategoryByCategoryIdServices = async (
  categoryId: string
): Promise<ISubcategory[]> => {
  const subcategories: ISubcategory[] = await Subcategory.find({ categoryId });
  if (!subcategories)
    throw createError(400, 'Can not get subcategories in database');
  return subcategories;
};
