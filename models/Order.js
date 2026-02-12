const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    orderId: { type: String, required: true, unique: true },
    user: {
        id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        nanoid: String,
        fullName: String,
        email: String,
        phone: String,
    },
    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
            name: String,
            price: Number,
            qty: Number,
            image: String,
        }
    ],
    totalAmount: { type: Number, required: true },
    shippingAddress: {
        houseNo: String,
        village: String,
        district: String,
        pincode: String,
        state: String,
    },
    paymentMethod: { type: String, enum: ["COD", "UPI", "Card"], default: "COD" },
    paymentStatus: { type: String, enum: ["Pending", "Paid", "Failed"], default: "Pending" },
    orderStatus: {
        type: String,
        enum: ["Received", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled", "Refunded"],
        default: "Received"
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", orderSchema, "orders");
