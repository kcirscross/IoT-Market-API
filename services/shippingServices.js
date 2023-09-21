import axios from 'axios';
import User from '../models/User.js';
import Store from '../models/Store.js';
import { getProductInfoService } from './productServices.js';
import { createError } from '../errors/errors.js';
export const calculateShippingFeeService = async (userId, productToBuy) => {
    //Get User
    const user = await User.findById({ _id: userId });
    if (user.phoneNumber === '' ||
        user.address.city === '' ||
        user.address.district === '' ||
        user.address.ward === '' ||
        user.address.street === '')
        throw createError(403, 'User do not have phone or address');
    //Get Product detail
    const productList = await Promise.all(productToBuy.map(async (product) => {
        const productDetail = await getProductInfoService(product.productId);
        return {
            productId: productDetail,
            quantity: product.quantity,
            isStore: productDetail.isStore,
        };
    }));
    //Calculate total product cost
    const totalProductCost = productList.reduce((sum, product) => (sum += parseInt(product.productId.price) * product.quantity), 0);
    //Group product by store
    const productListInCartGroupedByStore = productList.reduce((r, a) => {
        r[a.productId.ownerId] = r[a.productId.ownerId] || [];
        r[a.productId.ownerId].push({
            productId: a.productId._id,
            ownerId: a.productId.ownerId,
            weight: a.productId.weightAfterBoxing * a.quantity,
            height: a.productId.heightAfterBoxing,
            length: a.productId.lengthAfterBoxing,
            width: a.productId.widthAfterBoxing,
            quantity: a.quantity,
            isStore: a.isStore,
        });
        return r;
    }, Object.create(null));
    // Calculate Shipping Fee
    const shippingFeeList = await Promise.all(Object.keys(productListInCartGroupedByStore).map(async (store) => {
        let ownerOfProduct_Address = await Store.findById({
            _id: store,
        }).select('address_ID ghnShopId');
        if (!ownerOfProduct_Address)
            ownerOfProduct_Address = await User.findById({ _id: store }).select('address_ID ghnShopId');
        const totalSize = productListInCartGroupedByStore[store].reduce((totalSize, product) => {
            totalSize.weight += product.weight;
            if (totalSize.height < product.height)
                totalSize.height = product.height;
            if (totalSize.length < product.length)
                totalSize.length = product.length;
            if (totalSize.width < product.width)
                totalSize.width = product.width;
            return {
                height: totalSize.height,
                length: totalSize.length,
                weight: totalSize.weight,
                width: totalSize.width,
            };
        }, {
            height: 0,
            length: 0,
            weight: 0,
            width: 0,
        });
        let response = await axios({
            url: `${process.env.ghn_Url_prod}/v2/shipping-order/available-services`,
            method: 'get',
            headers: {
                Token: process.env.ghn_token_prod,
            },
            data: {
                shop_id: parseInt(process.env.ghn_shopID_prod),
                from_district: ownerOfProduct_Address.address_ID.DistrictID,
                to_district: user.address_ID.DistrictID,
            },
        });
        const service_id = response.data.data[0].service_id;
        response = await axios({
            url: `${process.env.ghn_Url_prod}/v2/shipping-order/fee`,
            method: 'get',
            headers: {
                Token: process.env.ghn_token_prod,
                ShopId: parseInt(process.env.ghn_shopID_prod),
            },
            data: {
                service_id: service_id,
                insurance_value: 0,
                coupon: null,
                from_district_id: ownerOfProduct_Address.address_ID.DistrictID,
                to_ward_code: user.address_ID.wardCode,
                to_district_id: user.address_ID.DistrictID,
                weight: Math.round(totalSize.weight),
                length: Math.round(totalSize.length),
                width: Math.round(totalSize.width),
                height: Math.round(totalSize.height),
            },
        });
        return {
            service_id: service_id,
            storeId: store,
            ghnShopId: ownerOfProduct_Address.ghnShopId,
            shippingFee: response.data.data.total,
            isStore: productListInCartGroupedByStore[store][0].isStore,
            productList: productListInCartGroupedByStore[store],
            totalSize: totalSize,
        };
    }));
    const totalShippingFee = shippingFeeList.reduce((sum, fee) => (sum += fee.shippingFee), 0);
    return { shippingFeeList, totalShippingFee, totalProductCost };
};
export const trackingShippingService = async (deliveryCode) => {
    const response = await axios({
        url: `${process.env.ghn_Url}/v2/shipping-order/detail`,
        method: 'get',
        headers: {
            Token: process.env.ghn_token,
        },
        data: {
            order_code: deliveryCode,
        },
    });
    if (!response.data.data.log) {
        const shippingLog = [
            {
                status: response.data.data.status,
                updated_date: response.data.data.updated_date,
            },
        ];
        return shippingLog;
    }
    return response.data.data.log;
};
