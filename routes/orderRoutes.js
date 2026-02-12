const express = require("express");
const router = express.Router();
const { createOrder, getUserOrders, deleteUserOrder, getAllOrders, updateOrderStatus, getOrderStats } = require("../controllers/orderController");
const { verifyToken, verifyAdmin } = require("../middleware/auth");

// Customer + Admin route
router.post("/create", verifyToken, createOrder);
router.get("/user", verifyToken, getUserOrders);
router.delete("/user/:id", verifyToken, deleteUserOrder);

// All routes below this line are Admin only
router.use(verifyToken, verifyAdmin);

router.get("/", getAllOrders);
router.get("/stats", getOrderStats);
router.put("/:id/status", updateOrderStatus);

module.exports = router;
