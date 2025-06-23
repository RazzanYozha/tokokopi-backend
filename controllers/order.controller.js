// File: controllers/order.controller.js

const db = require('../config/db');

// Fungsi untuk mengambil semua pesanan
const getAllOrders = async (req, res) => {
    try {
        const query = `
            SELECT o.id, o.total_amount, o.shipping_address, o.status, o.created_at, u.name as customer_name, u.email as customer_email
            FROM orders o
            JOIN users u ON o.user_id = u.id
            ORDER BY o.created_at DESC
        `;
        const [orders] = await db.query(query);
        res.status(200).json(orders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ message: "Gagal mengambil data pesanan", error: error.message });
    }
};

// Fungsi untuk membuat pesanan baru
const createOrder = async (req, res) => {
    const { user_id, shipping_address, items } = req.body;

    // Validasi input dasar
    if (!user_id || !shipping_address || !items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: "Input tidak lengkap atau tidak valid." });
    }

    let connection;
    try {
        // 1. Memulai koneksi dan transaksi database
        connection = await db.getConnection();
        await connection.beginTransaction();

        // 2. Kalkulasi total harga di server untuk keamanan
        let total_amount = 0;
        const productPrices = {};

        for (const item of items) {
            const [products] = await connection.query('SELECT price FROM products WHERE id = ?', [item.product_id]);
            if (products.length === 0) {
                throw new Error(`Produk dengan ID ${item.product_id} tidak ditemukan.`);
            }
            const price = parseFloat(products[0].price);
            productPrices[item.product_id] = price;
            total_amount += price * item.quantity;
        }

        // 3. Masukkan data ke tabel `orders`
        const orderQuery = 'INSERT INTO orders (user_id, total_amount, shipping_address, status) VALUES (?, ?, ?, ?)';
        const [orderResult] = await connection.query(orderQuery, [user_id, total_amount, shipping_address, 'pending']);
        const newOrderId = orderResult.insertId;

        // 4. Masukkan data ke tabel `order_items`
        const orderItemsQuery = 'INSERT INTO order_items (order_id, product_id, quantity, price_per_item) VALUES ?';
        const orderItemsValues = items.map(item => [
            newOrderId,
            item.product_id,
            item.quantity,
            productPrices[item.product_id] // Gunakan harga dari database
        ]);
        await connection.query(orderItemsQuery, [orderItemsValues]);

        // 5. Jika semua berhasil, commit transaksi
        await connection.commit();

        res.status(201).json({
            message: "Pesanan berhasil dibuat!",
            orderId: newOrderId,
            totalAmount: total_amount
        });

    } catch (error) {
        // 6. Jika ada error, batalkan semua perubahan (rollback)
        if (connection) await connection.rollback();
        console.error("Error creating order:", error);
        res.status(500).json({ message: "Gagal membuat pesanan", error: error.message });
    } finally {
        // 7. Selalu lepaskan koneksi setelah selesai
        if (connection) connection.release();
    }
};

module.exports = {
    getAllOrders,
    createOrder
};