const Product = require('../models/Product');

// Get all products
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.getAll();
        res.json({
            success: true,
            data: products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching products',
            error: error.message
        });
    }
};

// Get products by category
exports.getProductsByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const products = await Product.getByCategory(category);
        res.json({
            success: true,
            data: products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching products',
            error: error.message
        });
    }
};

// Get single product
exports.getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.getById(id);
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching product',
            error: error.message
        });
    }
};

// Create product
exports.createProduct = async (req, res) => {
    try {
        const productId = await Product.create(req.body);
        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: { id: productId }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating product',
            error: error.message
        });
    }
};
