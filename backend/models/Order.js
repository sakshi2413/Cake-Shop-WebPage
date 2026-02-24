const db = require('../config/database');

class Order {
    // Create new order
    static async create(orderData) {
        const connection = await db.getConnection();
        
        try {
            await connection.beginTransaction();

            const { customer_name, phone, delivery_address, total_amount, items } = orderData;

            // Insert order
            const [orderResult] = await connection.query(
                'INSERT INTO orders (customer_name, phone, delivery_address, total_amount, status) VALUES (?, ?, ?, ?, ?)',
                [customer_name, phone, delivery_address, total_amount, 'pending']
            );

            const orderId = orderResult.insertId;

            // Insert order items
            for (const item of items) {
                await connection.query(
                    'INSERT INTO order_items (order_id, product_id, product_name, quantity, price) VALUES (?, ?, ?, ?, ?)',
                    [orderId, item.product_id, item.product_name, item.quantity, item.price]
                );
            }

            await connection.commit();
            return orderId;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    // Get all orders
    static async getAll() {
        try {
            const [rows] = await db.query(`
                SELECT o.*, 
                    GROUP_CONCAT(
                        CONCAT(oi.product_name, ' x', oi.quantity) 
                        SEPARATOR ', '
                    ) as items
                FROM orders o
                LEFT JOIN order_items oi ON o.id = oi.order_id
                GROUP BY o.id
                ORDER BY o.created_at DESC
            `);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    // Get order by ID with items
    static async getById(id) {
        try {
            const [orders] = await db.query('SELECT * FROM orders WHERE id = ?', [id]);
            
            if (orders.length === 0) {
                return null;
            }

            const [items] = await db.query('SELECT * FROM order_items WHERE order_id = ?', [id]);
            
            return {
                ...orders[0],
                items: items
            };
        } catch (error) {
            throw error;
        }
    }

    // Update order status
    static async updateStatus(id, status) {
        try {
            const [result] = await db.query(
                'UPDATE orders SET status = ? WHERE id = ?',
                [status, id]
            );
            return result.affectedRows;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Order;
