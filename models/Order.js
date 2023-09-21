import mongoose from 'mongoose';
const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'refModel',
    },
    refModel: {
        type: String,
        required: true,
        enum: ['User', 'Store'],
    },
    expected_delivery_time: {
        type: String,
        required: true,
    },
    deliveryCode: {
        type: String,
    },
    isCod: {
        type: Boolean,
        required: true,
        default: false,
    },
    shippingLogs: [
        {
            status: String,
            updated_date: String,
        },
    ],
    productsList: [
        {
            name: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
            },
            quantity: Number,
            weight: Number,
        },
    ],
    VNPay: {
        vnp_Amount: {
            type: Number,
        },
        vnp_BankCode: {
            type: String,
        },
        vnp_BankTranNo: {
            type: String,
        },
        vnp_OrderInfo: {
            type: String,
        },
        vnp_PayDate: {
            type: Number,
        },
        vnp_TransactionNo: {
            type: String,
        },
        vnp_CardType: {
            type: String,
        },
        vnp_ResponseCode: {
            type: Number,
        },
        vnp_TransactionStatus: {
            type: Number,
        },
    },
}, { timestamps: true });
const Order = mongoose.model('Order', orderSchema);
export default Order;
