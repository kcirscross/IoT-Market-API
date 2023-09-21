import mongoose from 'mongoose';
const reviewSchema = new mongoose.Schema({
    reviewerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Please provide reviewer Id'],
        ref: 'User',
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Please provide product Id'],
        ref: 'Product',
    },
    content: {
        type: String,
        required: [true, 'Please provide review content'],
    },
    starPoints: {
        type: Number,
        required: [true, 'Please provide point for this review'],
        default: 5,
    },
    images: {
        type: [String],
    },
    videos: {
        type: [String],
    },
}, { timestamps: true });
const Review = mongoose.model('Review', reviewSchema);
export default Review;
