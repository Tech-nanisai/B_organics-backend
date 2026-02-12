const Order = require("../models/Order");

const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        console.error("Fetch All Orders Error:", error.message);
        res.status(500).json({ message: "Server error fetching orders" });
    }
};

const updateOrderStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const order = await Order.findByIdAndUpdate(
            id,
            { orderStatus: status, updatedAt: Date.now() },
            { new: true }
        );
        if (!order) return res.status(404).json({ message: "Order not found" });
        res.status(200).json(order);
    } catch (error) {
        console.error("Update Order Status Error:", error.message);
        res.status(500).json({ message: "Server error updating order status" });
    }
};

const getOrderStats = async (req, res) => {
    try {
        const stats = await Order.aggregate([
            {
                $group: {
                    _id: "$orderStatus",
                    count: { $sum: 1 }
                }
            }
        ]);
        res.status(200).json(stats);
    } catch (error) {
        console.error("Order Stats Error:", error.message);
        res.status(500).json({ message: "Server error fetching order stats" });
    }
}

const createOrder = async (req, res) => {
    try {
        const { items, totalAmount, shippingAddress, paymentMethod, user } = req.body;

        // Simple order ID generator BORG-XXXXXX
        const orderId = "BORG-" + Math.random().toString(36).substr(2, 6).toUpperCase();

        const newOrder = new Order({
            orderId,
            user,
            items,
            totalAmount,
            shippingAddress,
            paymentMethod,
            orderStatus: "Received"
        });

        await newOrder.save();
        res.status(201).json({ message: "Order placed successfully", order: newOrder });
    } catch (error) {
        console.error("Create Order Error:", error.message);
        res.status(500).json({ message: "Server error placing order" });
    }
};

const getUserOrders = async (req, res) => {
    try {
        // Find orders where user reference matches the logged in user (Resilient search)
        const orders = await Order.find({
            $or: [
                { "user.id": req.user._id },
                { "user.email": req.user.email },
                { "user.nanoid": req.user.nanoid }
            ]
        }).sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        console.error("Fetch User Orders Error:", error.message);
        res.status(500).json({ message: "Server error fetching your orders" });
    }
};

const deleteUserOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // Security check: Match requesting user with order owner (using multiple identifiers for resilience)
        const isOwner =
            (order.user.id && order.user.id.toString() === req.user._id.toString()) ||
            (order.user.email === req.user.email) ||
            (order.user.nanoid && order.user.nanoid === req.user.nanoid);

        if (!isOwner) {
            return res.status(403).json({ message: "Not authorized to delete this order" });
        }

        await Order.findByIdAndDelete(id);
        res.status(200).json({ message: "Order removed successfully" });
    } catch (error) {
        console.error("Delete Order Error:", error.message);
        res.status(500).json({ message: "Server error removing order" });
    }
};

module.exports = {
    createOrder,
    getUserOrders,
    deleteUserOrder,
    getAllOrders,
    updateOrderStatus,
    getOrderStats
};
