// File: config/database.js (Versi final yang bisa untuk lokal & Railway)

const mysql = require('mysql2/promise'); // Menggunakan /promise sesuai file lokal Anda
require('dotenv').config();

let pool;

// Cek apakah variabel DATABASE_URL ada (ini hanya ada di Railway)
if (process.env.DATABASE_URL) {
    // Lingkungan Production (Railway)
    console.log("Connecting to Railway database...");
    pool = mysql.createPool(process.env.DATABASE_URL);
} else {
    // Lingkungan Development (Lokal/XAMPP)
    console.log("Connecting to local XAMPP database...");
    pool = mysql.createPool({
        host: 'localhost',   // Alamat server database lokal Anda
        user: 'root',        // User default XAMPP
        password: '',          // Ganti jika password XAMPP Anda berbeda
        database: 'db_tokokopi'  // Nama database lokal Anda
    });
}

// Cek koneksi (opsional tapi bagus untuk debugging)
pool.getConnection()
    .then(connection => {
        console.log('Database connection successful!');
        connection.release();
    })
    .catch(err => {
        console.error('Error connecting to database:', err);
    });

module.exports = pool;
