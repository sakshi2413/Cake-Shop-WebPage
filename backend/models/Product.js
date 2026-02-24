const db = require('../config/database');

class Product {
    // Get all products
    static async getAll() {
        try {
            const [rows] = await db.query('SELECT * FROM products ORDER BY created_at DESC');
            return rows;
        } catch (error) {
            throw error;
        }
    }

    // Get products by category
    static async getByCategory(category) {
        try {
            const [rows] = await db.query('SELECT * FROM products WHERE category = ? ORDER BY created_at DESC', [category]);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    // Get single product by ID
    static async getById(id) {
        try {
            const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    // Create new product
    static async create(productData) {
        try {
            const { name, category, price, image, description } = productData;
            const [result] = await db.query(
                'INSERT INTO products (name, category, price, image, description) VALUES (?, ?, ?, ?, ?)',
                [name, category, price, image, description]
            );
            return result.insertId;
        } catch (error) {
            throw error;
        }
    }

    // Update product
    static async update(id, productData) {
        try {
            const { name, category, price, image, description } = productData;
            const [result] = await db.query(
                'UPDATE products SET name = ?, category = ?, price = ?, image = ?, description = ? WHERE id = ?',
                [name, category, price, image, description, id]
            );
            return result.affectedRows;
        } catch (error) {
            throw error;
        }
    }

    // Delete product
    static async delete(id) {
        try {
            const [result] = await db.query('DELETE FROM products WHERE id = ?', [id]);
            return result.affectedRows;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Product;
