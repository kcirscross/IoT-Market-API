import { connect } from 'mongoose';
export const connectDB = (url) => connect(url);
