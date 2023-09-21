import mongoose from 'mongoose';

export interface IProduct {
  _id: mongoose.Types.ObjectId;
  ownerId: mongoose.Types.ObjectId;
  thumbnailImage: string;
  productName: string;
  description: string;
  categoryId: mongoose.Types.ObjectId;
  subcategoryId: mongoose.Types.ObjectId;
  detailImages?: string[];
  video?: string;
  weight: number;
  height: number;
  width: number;
  length: number;
  weightAfterBoxing: number;
  heightAfterBoxing: number;
  widthAfterBoxing: number;
  lengthAfterBoxing: number;
  price: string;
  numberInStock: number;
  rating: {
    ratingValue: number;
    ratingCount: number;
    oneStarCount: number;
    twoStarCount: number;
    threeStarCount: number;
    fourStarCount: number;
    fiveStarCount: number;
  };
  peopleFavoriteThisProduct?: mongoose.Types.ObjectId[];
  soldCount: number;
  condition: string;
  isStore?: boolean;
  save();
  countAverageRating();
}

const productSchema = new mongoose.Schema<IProduct>(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'Product must have owner ID'],
      ref: 'User',
    },

    thumbnailImage: {
      type: String,
      required: [true, 'Product must have thumbnail images'],
    },

    productName: {
      type: String,
      required: [true, 'Product must have name'],
    },

    description: {
      type: String,
      required: [true, 'Product must have description'],
    },

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'Product must belongs to one category'],
      ref: 'Category',
    },

    subcategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'Product must belongs to one subcategory'],
      ref: 'Subcategory',
    },

    detailImages: {
      type: [String],
    },

    video: {
      type: String,
    },

    weight: {
      type: Number,
      required: [true, 'Product must have weight'],
    },

    height: {
      type: Number,
      required: [true, 'Product must have height'],
    },

    width: {
      type: Number,
      required: [true, 'Product must have width'],
    },

    length: {
      type: Number,
      required: [true, 'Product must have length'],
    },

    weightAfterBoxing: {
      type: Number,
      required: [true, 'Product must have weight after boxing'],
    },

    heightAfterBoxing: {
      type: Number,
      required: [true, 'Product must have height after boxing'],
    },

    widthAfterBoxing: {
      type: Number,
      required: [true, 'Product must have width after boxing'],
    },

    lengthAfterBoxing: {
      type: Number,
      required: [true, 'Product must have length after boxing'],
    },

    price: {
      type: String,
      required: [true, 'Product must have price'],
    },

    numberInStock: {
      type: Number,
      required: [true, 'Product must have number in stock'],
      default: 1,
    },

    rating: {
      ratingValue: {
        type: Number,
        default: 0,
      },
      ratingCount: {
        type: Number,
        default: 0,
      },
      oneStarCount: {
        type: Number,
        default: 0,
      },
      twoStarCount: {
        type: Number,
        default: 0,
      },
      threeStarCount: {
        type: Number,
        default: 0,
      },
      fourStarCount: {
        type: Number,
        default: 0,
      },
      fiveStarCount: {
        type: Number,
        default: 0,
      },
    },

    peopleFavoriteThisProduct: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'User',
    },

    soldCount: {
      type: Number,
      default: 0,
      required: true,
    },

    condition: {
      type: String,
      required: true,
      enum: ['New', 'Used - Like New', 'Used - Good', 'Used - Fair'],
    },

    isStore: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

productSchema.methods.countAverageRating = async function () {
  const oneTotal: number = this.rating.oneStarCount * 1;
  const twoTotal: number = this.rating.twoStarCount * 2;
  const threeTotal: number = this.rating.threeStarCount * 3;
  const fourTotal: number = this.rating.fourStarCount * 4;
  const fiveTotal: number = this.rating.fiveStarCount * 5;
  const totalStars: number =
    oneTotal + twoTotal + threeTotal + fourTotal + fiveTotal;

  let averageStar: number = totalStars / this.rating.ratingCount;

  averageStar = Number(averageStar.toPrecision(2));

  this.rating.ratingValue = averageStar;
  await this.save();
};
const Product = mongoose.model('Product', productSchema);
export default Product;
