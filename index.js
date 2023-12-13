import dontenv from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import swaggerUI from 'swagger-ui-express';
import YAML from 'yamljs';
import 'express-async-errors';
import { connectDB } from './database/connectDb.js';
import { notFoundMiddleware, errorHandlerMiddleware, } from './middlewares/index.js';
import { authRouter, userRouter, reviewRouter, productRouter, adminRouter, categoryRouter, storeRouter, subcategoryRouter, orderRouter, shippingRouter, notiRouter, } from './routes/index.js';
dontenv.config();
const swaggerDoc = YAML.load('./swagger.yaml');
const PORT = process.env.PORT || 3000;
const app = express();
app.set('trust proxy', 1);
app.use(cookieParser());
app.use(express.json());
app.use(cors());
app.get('/', (req, res) => {
    res.send('<h1>Jobs API</h1><a href="/api-docs">Documentation</a>');
});
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDoc));
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/review', reviewRouter);
app.use('/api/v1/product', productRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/category', categoryRouter);
app.use('/api/v1/subcategory', subcategoryRouter);
app.use('/api/v1/store', storeRouter);
app.use('/api/v1/order', orderRouter);
app.use('/api/v1/shipping', shippingRouter);
app.use('/api/v1/noti', notiRouter);
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);
const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(PORT, () => console.log(' Connected to DB' + ` and is listening on port ${PORT}...`));
    }
    catch (error) {
        console.log(error);
    }
};
start();
