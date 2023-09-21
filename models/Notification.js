import mongoose from 'mongoose';
const notiSchema = new mongoose.Schema({
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    route: {
        type: String,
    },
    deviceTokenFCM: {
        type: String,
        required: true,
    },
    isRead: {
        type: Boolean,
        required: true,
        default: false,
    },
    title: {
        type: String,
        required: true,
    },
    body: {
        type: String,
    },
}, { timestamps: true });
const Notification = mongoose.model('Notification', notiSchema);
export default Notification;
