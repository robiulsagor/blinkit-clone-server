import mongoose from "mongoose";

const subCategorSchema = new mongoose.Schema({
    name: String,
    image: String,
    categoryId: {
        type: mongoose.Schema.ObjectId,
        ref: "category"
    }
},
    {
        timestamps: true
    })

const SubCategoryModel = mongoose.model("SubCategory", subCategorSchema)

export default SubCategoryModel;