import mongoose from 'mongoose';
const shippingSchema = new mongoose.Schema({
    status: {
        type: String,
        required: true,
        default: 'Cancelled',
        enum: ['Cancelled', 'Done'],
    },
    shippingFeeList: [
        {
            service_id: {
                type: Number,
                required: true,
            },
            storeId: {
                type: String,
                required: true,
            },
            ghnShopId: {
                type: Number,
                required: true,
            },
            shippingFee: {
                type: Number,
                required: true,
            },
            isStore: {
                type: Boolean,
                required: true,
            },
            totalSize: {
                height: {
                    type: Number,
                    required: true,
                },
                length: {
                    type: Number,
                    required: true,
                },
                weight: {
                    type: Number,
                    required: true,
                },
                width: {
                    type: Number,
                    required: true,
                },
            },
            productList: [
                {
                    productId: {
                        type: mongoose.Schema.Types.ObjectId,
                        required: true,
                        ref: 'Product',
                    },
                    ownerId: {
                        type: mongoose.Schema.Types.ObjectId,
                        required: true,
                    },
                    weight: {
                        type: Number,
                        required: true,
                    },
                    height: {
                        type: Number,
                        required: true,
                    },
                    length: {
                        type: Number,
                        required: true,
                    },
                    width: {
                        type: Number,
                        required: true,
                    },
                    quantity: {
                        type: Number,
                        required: true,
                    },
                    isStore: {
                        type: Boolean,
                        required: true,
                    },
                },
            ],
        },
    ],
    totalShippingFee: {
        type: Number,
        required: true,
    },
    totalProductCost: {
        type: Number,
        required: true,
    },
}, { timestamps: true });
const Shipping = mongoose.model('Shipping', shippingSchema);
export default Shipping;
