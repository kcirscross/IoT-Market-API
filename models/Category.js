import mongoose from 'mongoose';
const categorySchema = new mongoose.Schema({
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
}, { timestamps: true });
const Category = mongoose.model('Category', categorySchema);
export default Category;
