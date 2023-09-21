import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import axios from 'axios';
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        trim: true,
        lowercase: true,
        match: [
            /^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/,
            'Please fill a valid email address',
        ],
        unique: true,
    },
    password: {
        type: String,
        minlength: 6,
    },
    fullName: {
        type: String,
        required: [true, 'Full Name of user is required'],
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
    gender: {
        type: String,
        default: 'Male',
        enum: ['Male', 'Female'],
    },
    onlineStatus: {
        type: String,
        default: 'Online',
    },
    accountStatus: {
        type: String,
        default: 'Active',
    },
    roles: {
        type: [String],
        enum: ['User', 'Store', 'Admin'],
        default: ['User'],
        required: true,
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
    ghnShopId: Number,
    cart: {
        content: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product',
                },
                quantity: {
                    type: Number,
                },
            },
        ],
        totalPrice: {
            type: String,
            default: '0',
        },
    },
    notifies: {
        type: [mongoose.Schema.Types.ObjectId],
    },
    orders: {
        type: [mongoose.Schema.Types.ObjectId],
    },
    products: {
        type: [mongoose.Schema.Types.ObjectId],
    },
    bankingAccount: {
        bankName: {
            type: String,
            default: '',
        },
        accountOwner: {
            type: String,
            default: '',
        },
        accountNumber: {
            type: String,
            default: '',
        },
    },
    storeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Store',
    },
    chats: {
        type: [String],
    },
    tickets: {
        type: [mongoose.Schema.Types.ObjectId],
    },
    fromGoogle: {
        type: Boolean,
        default: false,
    },
    deviceToken: {
        type: String,
        default: '',
    },
    deviceTokenFCM: {
        type: String,
        default: '',
    },
    follows: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Store',
    },
    favorites: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Product',
    },
    isReview: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Product',
    },
    avatar: {
        type: String,
        default: 'https://firebasestorage.googleapis.com/v0/b/iotmarket-10501.appspot.com/o/logo.jpg?alt=media&token=ed49f7ba-f12d-469f-9467-974ddbdbaf74',
    },
}, { timestamps: true });
userSchema.methods.createJWT = async function () {
    const token = jwt.sign({
        userId: this._id,
        email: this.email,
        roles: this.roles,
        storeId: this.storeId,
    }, process.env.JWT_SECRET, { expiresIn: '30d' });
    this.deviceToken = token;
    this.onlineStatus = 'Online';
    await this.save();
    return token;
};
userSchema.methods.comparePassword = async function (password) {
    const isMatch = await bcrypt.compare(password, this.password);
    return isMatch;
};
userSchema.methods.logout = async function () {
    this.deviceToken = '';
    this.onlineStatus = 'Offline';
    await this.save();
};
userSchema.methods.createPasswordToken = function () {
    const token = jwt.sign({ userId: this._id, email: this.email }, process.env.JWT_SECRET, { expiresIn: '1d' });
    return token;
};
userSchema.methods.updateAddressId = async function () {
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
        if (element.NameExtension.find((provinceName) => this.address.city.includes(provinceName)))
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
        if (element.NameExtension.find((districtName) => this.address.district.includes(districtName)))
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
        if (element.NameExtension.find((wardName) => this.address.ward.includes(wardName)))
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
            name: this.fullName,
            phone: this.phoneNumber,
            address: this.address.street,
        },
    });
    this.ghnShopId = response.data.data.shop_id;
    await this.save();
};
const User = mongoose.model('User', userSchema);
export default User;
