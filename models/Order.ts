import mongoose from 'mongoose';

export interface IShippingLogs {
  status: string;
  updated_date: string;
}
export interface IProductListOrder {
  _id?: mongoose.Types.ObjectId;
  name: mongoose.Types.ObjectId;
  quantity: number;
  weight: number;
}

export interface IPaymentInfo {
  vnp_Version: string;
  vnp_Command: string;
  vnp_TmnCode: string;
  vnp_Locale: string;
  vnp_CurrCode: string;
  vnp_TxnRef: string;
  vnp_OrderInfo: string;
  vnp_OrderType: string;
  vnp_Amount: number;
  vnp_ReturnUrl: string;
  vnp_IpAddr: string;
  vnp_CreateDate: string;
  vnp_SecureHashType: string;
  vnp_SecureHash: string;
  vnp_ResponseCode: number;
}

export interface IOrder {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  ownerId: mongoose.Types.ObjectId;
  refModel: string;
  deliveryCode?: string;
  shippingLogs?: IShippingLogs[];
  expected_delivery_time: string;
  isCod: boolean;
  productsList: IProductListOrder[];
  VNPay?: {
    vnp_Amount?: number;
    vnp_BankCode?: string;
    vnp_BankTranNo?: string;
    vnp_OrderInfo?: string;
    vnp_PayDate?: number;
    vnp_TransactionNo?: string;
    vnp_CardType?: string;
    vnp_ResponseCode?: number;
    vnp_TransactionStatus?: number;
  };
  save();
}

const orderSchema = new mongoose.Schema<IOrder>(
  {
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
  },
  { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);
export default Order;
