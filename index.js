// File: index.js (Versi Diagnostik)

const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Kita tetap butuh koneksi DB untuk tes query langsung
const db = require('./config/db'); 

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());


// =======================================================
// MULAI RUTE DIAGNOSTIK
// =======================================================

// Tes 1: Rute paling dasar
app.get('/', (req, res) => {
    res.status(200).json({ 
        status: 'success',
        message: 'Server is running and responding from index.js!' 
    });
});

// Tes 2: Rute produk yang dibuat langsung di sini
app.get('/api/products', async (req, res) => {
    try {
        const query = "SELECT * FROM products";
        const [results] = await db.query(query);
        res.status(200).json({
            message: "SUCCESS: Products fetched directly from index.js!",
            count: results.length,
            data: results
        });
    } catch (error) {
        // Jika ini gagal, masalahnya ada di koneksi/query database
        res.status(500).json({
            message: "FAILED: Database query from index.js failed!",
            error: error.message
        });
    }
});


// =======================================================
// AKHIR RUTE DIAGNOSTIK
// (Semua rute lama kita abaikan sementara)
// =======================================================


app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
