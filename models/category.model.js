import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: String,
    image: String,
}, {
    timestamps: true
})

const CategoryModel = mongoose.model('Category', categorySchema);

export default CategoryModel;