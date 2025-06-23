// File: config/db.js (Satu-satunya file konfigurasi database Anda)

const mysql = require('mysql2/promise');
require('dotenv').config();

let pool;

// Cek apakah variabel DATABASE_URL ada (ini hanya akan ada di Railway)
if (process.env.DATABASE_URL) {
    // Lingkungan Production (Railway)
    console.log("Connecting to Railway database...");
    pool = mysql.createPool(process.env.DATABASE_URL);
} else {
    // Lingkungan Development (Lokal/XAMPP)
    console.log("Connecting to local XAMPP database...");
    pool = mysql.createPool({
        host: 'localhost',
        user: 'root',
        password: '', // Sesuaikan jika password XAMPP Anda berbeda
        database: 'db_tokokopi'
    });
}

// Opsional: Cek koneksi untuk debugging saat aplikasi start
pool.getConnection()
    .then(connection => {
        console.log('Database connection pool created successfully!');
        connection.release();
    })
    .catch(err => {
        console.error('Failed to create database connection pool:', err);
    });

module.exports = pool;
