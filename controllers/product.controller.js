const db = require('../config/database');

// Mengambil semua produk
const getAllProducts = (req, res) => {
    const query = "SELECT * FROM products";
    db.query(query, (err, results) => {
        if (err) {
            // Jika ada error dari database, kirim status 500
            return res.status(500).json({ message: "Error fetching products", error: err });
        }
        // Jika berhasil, kirim data produk
        res.status(200).json(results);
    });
};

// Mengambil satu produk berdasarkan ID (opsional, tapi ada di repo Anda)
const getProductById = (req, res) => {
    const { id } = req.params;
    const query = "SELECT * FROM products WHERE id = ?";
    db.query(query, [id], (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Error fetching product", error: err });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(results[0]);
    });
};

module.exports = {
    getAllProducts,
    getProductById
};