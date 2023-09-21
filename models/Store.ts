import mongoose from 'mongoose';
import axios from 'axios';

import { createError } from '../errors/errors.js';

export interface IStore {
  _id?: mongoose.Types.ObjectId;
  ownerId: mongoose.Types.ObjectId;
  displayName: string;
  numberOfProduct?: number;
  rating?: number;
  description: string;
  shopImage?: string;
  products?: mongoose.Types.ObjectId[];
  address: {
    street: string;
    district: string;
    ward: string;
    city: string;
  };
  address_ID?: {
    street?: string;
    DistrictID?: number;
    wardCode?: string;
    ProvinceID?: number;
  };
  phoneNumber?: string;
  followers?: mongoose.Types.ObjectId[];
  status: string;
  ghnShopId?: number;
  updateAddressId(): void;
  save();
}

const storeSchema = new mongoose.Schema<IStore>(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      unique: true,
      required: [true, 'Store must have owner'],
      ref: 'User',
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
    displayName: {
      type: String,
      minlength: 6,
      required: [true, 'Store must have display name'],
    },

    numberOfProduct: {
      type: Number,
      default: 0,
    },

    rating: {
      type: Number,
      default: 0,
    },

    followers: {
      type: [mongoose.Schema.Types.ObjectId],
    },

    description: {
      type: String,
      default: '',
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
    address_ID: {
      street: {
        type: String,
        default: '',
      },
      DistrictID: {
        type: Number,
        default: 0,
      },
      wardCode: {
        type: String,
        default: '',
      },
      ProvinceID: {
        type: Number,
        default: 0,
      },
    },
    products: {
      type: [mongoose.Schema.Types.ObjectId],
    },

    status: {
      type: String,
      required: true,
      enum: ['Active', 'Banned', 'Deactive'],
      default: 'Active',
    },

    ghnShopId: Number,
  },
  { timestamps: true }
);

storeSchema.methods.updateAddressId = async function () {
  this.address_ID.street = this.address.street;

  //Find City/Province ID
  let response = await axios({
    url: `${process.env.ghn_Url}/master-data/province`,
    method: 'get',
    headers: {
      Token: process.env.ghn_token,
    },
  });
  const provinceList = response.data.data;
  const provinceId = provinceList.find((element) => {
    if (
      element.NameExtension.find((provinceName) =>
        this.address.city.includes(provinceName)
      )
    )
      return true;
  }).ProvinceID;
  this.address_ID.ProvinceID = provinceId;

  //Find District ID
  response = await axios({
    url: `${process.env.ghn_Url}/master-data/district`,
    method: 'get',
    headers: {
      Token: process.env.ghn_token,
    },
    data: {
      province_id: provinceId,
    },
  });
  const districtList = response.data.data;
  const districtId = districtList.find((element) => {
    if (
      element.NameExtension.find((districtName) =>
        this.address.district.includes(districtName)
      )
    )
      return true;
  }).DistrictID;
  this.address_ID.DistrictID = districtId;

  //Find Ward Code
  response = await axios({
    url: `${process.env.ghn_Url}/master-data/ward`,
    method: 'get',
    headers: {
      Token: process.env.ghn_token,
    },
    params: {
      district_id: districtId,
    },
  });
  const wardList = response.data.data;
  const wardCode = wardList.find((element) => {
    if (
      element.NameExtension.find((wardName) =>
        this.address.ward.includes(wardName)
      )
    )
      return true;
  }).WardCode;

  this.address_ID.wardCode = wardCode;

  response = await axios({
    url: `${process.env.ghn_Url}/v2/shop/register`,
    method: 'get',
    headers: {
      Token: process.env.ghn_token,
    },
    data: {
      district_id: districtId,
      ward_code: wardCode,
      name: this.displayName,
      phone: this.phoneNumber,
      address: this.address.street,
    },
  });
  this.ghnShopId = response.data.data.shop_id;

  await this.save();
};

const Store = mongoose.model('Store', storeSchema);
export default Store;
