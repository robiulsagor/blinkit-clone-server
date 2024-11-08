import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    orderId: {
        type: String,
        required: [true, "Provide orderId"],
        unique: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    productDetails: {
        name: String,
        image: Array
    },
    paymentId: String,
    payment_status: String,
    delivery_address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address'
    },
    subTotalAmt: Number,
    totalAmt: Number,
    invoice_receipt: String
},
    { timestamps: true })

const OrderModel = mongoose.model('Order', orderSchema);

export default OrderModel