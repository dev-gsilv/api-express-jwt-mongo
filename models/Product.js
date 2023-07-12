import mongoose from "mongoose";
import { userSchema } from './User.js'

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String, 
            index: true,
            unique: true
        },
        description: String,
        category: {
            type: String,
            default: 'other',
            enum: ['anti-aging', 'brush', 'cream', 'cosmeceutical', 'eye-liner', 'eye-shadow', 'gloss', 'powder', 'lip-liner', 'lipstick', 'makeover', 'nail-polisher', 'perfume', 'rouge', 'other']
        },
        available: {
            type: Boolean,
            default: false
        },
        price: {
            value: {
                type: Number,
                min: 1,
                max: 10000
            },
            discount: {
                activeDiscount:
                {
                    type: Boolean,
                    default: false
                },
                discountPercent:
                {
                    type: Number,
                    default: 0
                }
            }
        },
        vendor: {
            type: mongoose.ObjectId,
            ref: 'User',
        }

    },
    { timestamps: true }
)

const Product = mongoose.model('Product', productSchema);

export default Product