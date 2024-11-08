import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: Array,
        default: []
    },
    categoryId: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'category',
        }
    ],
    sub_categoryId: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'subcategory',
        }
    ],
    unit: {
        type: String
    },
    stock: {
        type: Number,
        default: null
    },
    price: Number,
    discount: Number,
    description: String,
    more_details: String,
    published: {
        type: Boolean,
        default: true
    }
},
    { timestamps: true })

const ProductModel = mongoose.model("Model", productSchema)

export default ProductModel