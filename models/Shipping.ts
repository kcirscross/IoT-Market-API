import mongoose from 'mongoose';

export interface IProductList {
  productId: string;
  ownerId: string;
  weight: number;
  height: number;
  length: number;
  width: number;
  quantity: number;
  isStore: boolean;
}

export interface IShippingFeeList {
  service_id: number;
  storeId: string;
  ghnShopId: number;
  shippingFee: number;
  isStore: boolean;
  productList: IProductList[];
  totalSize: {
    weight: number;
    height: number;
    length: number;
    width: number;
  };
}

export interface IShipping {
  _id?: mongoose.Types.ObjectId;
  status: string;
  shippingFeeList: IShippingFeeList[];
  totalShippingFee: number;
  totalProductCost: number;
  save();
}

const shippingSchema = new mongoose.Schema<IShipping>(
  {
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
  },
  { timestamps: true }
);

const Shipping = mongoose.model('Shipping', shippingSchema);
export default Shipping;
