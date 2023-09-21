import mongoose from 'mongoose';

export interface ISubcategory {
  _id: mongoose.Types.ObjectId;
  categoryId: mongoose.Types.ObjectId;
  subcategoryName: string;
  numberOfGoodsInSubcategory: number;
}

const subcategorySchema = new mongoose.Schema<ISubcategory>(
  {
    subcategoryName: {
      type: String,
      required: [true, 'Subcategories must have name!'],
      unique: true,
    },

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'Subcategories must belong to a category!'],
      ref: 'Category',
    },
    numberOfGoodsInSubcategory: {
      type: Number,
      default: 0,
      required: true,
    },
  },
  { timestamps: true }
);

const Subcategory = mongoose.model('Subcategory', subcategorySchema);
export default Subcategory;
