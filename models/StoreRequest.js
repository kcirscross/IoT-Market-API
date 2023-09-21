import mongoose from 'mongoose';
const storeRequestSchema = new mongoose.Schema({
    requesterId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'A store must has owner'],
        ref: 'User',
    },
    status: {
        type: String,
        required: true,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending',
    },
    phoneNumber: {
        type: String,
        default: '',
        trim: true,
        lowercase: true,
        match: [
            /^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/,
            'Please provide correct phone number',
        ],
    },
    reasonForReject: {
        type: String,
    },
    displayName: {
        type: String,
        minlength: 6,
        required: [true, 'Store must have display name'],
    },
    description: {
        type: String,
        minlength: 15,
        required: [true, 'Store must has basic description'],
    },
    shopImage: {
        type: String,
        default: '',
    },
    address: {
        street: {
            type: String,
            default: '',
        },
        district: {
            type: String,
            default: '',
        },
        ward: {
            type: String,
            default: '',
        },
        city: {
            type: String,
            default: '',
        },
    },
}, { timestamps: true });
const StoreRequest = mongoose.model('StoreRequest', storeRequestSchema);
export default StoreRequest;
