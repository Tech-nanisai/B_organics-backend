const express = require("express");
const router = express.Router();
const {
    getAllProducts,
    getProductsByCategory,
    searchProducts,
    createProduct,
    updateProduct,
    deleteProduct
} = require("../controllers/productController");
const { verifyToken, verifyAdmin } = require("../middleware/auth");

const upload = require("../middleware/upload");

router.get("/", getAllProducts);
router.get("/search", searchProducts);
router.get("/category/:category", getProductsByCategory);

// Admin Routes
router.post("/", verifyToken, verifyAdmin, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'images', maxCount: 10 }]), createProduct);
router.put("/:id", verifyToken, verifyAdmin, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'images', maxCount: 10 }]), updateProduct);
router.delete("/:id", verifyToken, verifyAdmin, deleteProduct);

module.exports = router;
