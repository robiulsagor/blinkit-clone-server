import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
    address_line: String,
    city: String,
    state: String,
    pincode: String,
    country: String,
    mobile: Number,
    status: {
        type: Boolean,
        default: true
    },
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'user'
    }
}, {
    timestamps: true
})

const AddressModel = mongoose.model("Address", addressSchema)

export default AddressModel;