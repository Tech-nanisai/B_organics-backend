const Product = require("../models/Product");

const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).json(products);
    } catch (error) {
        console.error("Fetch Products Error:", error.message);
        res.status(500).json({ message: "Server error fetching products" });
    }
};

const getProductsByCategory = async (req, res) => {
    const { category } = req.params;
    try {
        const products = await Product.find({ category: { $regex: new RegExp(`^${category}$`, "i") } });
        res.status(200).json(products);
    } catch (error) {
        console.error("Fetch Category Error:", error.message);
        res.status(500).json({ message: "Server error fetching category products" });
    }
};

const searchProducts = async (req, res) => {
    const { query } = req.query;
    try {
        if (!query) return res.status(400).json({ message: "Missing search query" });
        const regex = new RegExp(query, "i");
        const products = await Product.find({ name: { $regex: regex } });
        res.status(200).json(products);
    } catch (error) {
        console.error("Search Products Error:", error.message);
        res.status(500).json({ message: "Server error searching products" });
    }
};

const createProduct = async (req, res) => {
    try {
        const { name, category, price, discount, quantity, description } = req.body;

        const productData = {
            name,
            category,
            price: price ? Number(price) : 0,
            discount: discount ? Number(discount) : 0,
            quantity: quantity || '',
            description: description || ''
        };

        // Main Image Upload
        if (req.files && req.files.image) {
            productData.image = `http://localhost:5678/uploads/${req.files.image[0].filename}`;
        } else {
            productData.image = req.body.image;
        }

        // Gallery Images Upload
        if (req.files && req.files.images) {
            const galleryImages = req.files.images.map(file => `http://localhost:5678/uploads/${file.filename}`);
            productData.images = galleryImages;
        }

        const product = new Product(productData);
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        console.error("Create Product Error:", error);
        res.status(500).json({ message: error.message || "Server error creating product" });
    }
};

const updateProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const { name, category, price, discount, quantity, description, existingImages } = req.body;

        const productData = {
            name,
            category,
            price: price ? Number(price) : 0,
            discount: discount ? Number(discount) : 0,
            quantity: quantity || '',
            description: description || ''
        };

        // Main Image Upload
        if (req.files && req.files.image) {
            productData.image = `http://localhost:5678/uploads/${req.files.image[0].filename}`;
        } else if (req.body.image) {
            productData.image = req.body.image;
        }

        // Handle Gallery Images (Merge Existing + New)
        let finalGallery = [];
        if (existingImages) {
            finalGallery = Array.isArray(existingImages) ? existingImages : [existingImages];
        }
        if (req.files && req.files.images) {
            const newGallery = req.files.images.map(file => `http://localhost:5678/uploads/${file.filename}`);
            finalGallery = [...finalGallery, ...newGallery];
        }

        productData.images = finalGallery;

        const product = await Product.findByIdAndUpdate(id, productData, { new: true });
        if (!product) return res.status(404).json({ message: "Product not found" });
        res.status(200).json(product);
    } catch (error) {
        console.error("Update Product Error:", error);
        res.status(500).json({ message: error.message || "Server error updating product" });
    }
};

const deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findByIdAndDelete(id);
        if (!product) return res.status(404).json({ message: "Product not found" });
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error("Delete Product Error:", error.message);
        res.status(500).json({ message: "Server error deleting product" });
    }
};

module.exports = {
    getAllProducts,
    getProductsByCategory,
    searchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
};
