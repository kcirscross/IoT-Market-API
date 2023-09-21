import mongoose from 'mongoose';

export interface ICategory {
  _id: mongoose.Types.ObjectId;
  categoryName: string;
  categoryDescription: string;
  numberOfGoodsInCategory: number;
  image: string;
}

const categorySchema = new mongoose.Schema<ICategory>(
  {
    categoryName: {
      type: String,
      required: [true, 'Categories must have name!'],
      unique: true,
    },
    categoryDescription: {
      type: String,
      required: [true, 'Categories must have description!'],
    },

    numberOfGoodsInCategory: {
      type: Number,
      required: [true, 'Categories must have number of stocks!'],
      default: 0,
    },

    image: {
      type: String,
      required: [true, 'Categories must have image!'],
    },
  },
  { timestamps: true }
);

const Category = mongoose.model('Category', categorySchema);
export default Category;
