const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Get all products
router.get('/', productController.getAllProducts);

// Get products by category
router.get('/category/:category', productController.getProductsByCategory);

// Get single product by ID
router.get('/:id', productController.getProductById);

// Create new product
router.post('/', productController.createProduct);

module.exports = router;
