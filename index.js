// File: index.js (Versi Final)
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// --- SEMUA REQUIRE SUDAH DISERAGAMKAN ---
const productRoutes = require('./routes/product.routes');
const authRoutes = require('./routes/auth.routes');
const orderRoutes = require('./routes/order.routes');
const adminRoutes = require('./routes/admin.routes');
const pelangganRoutes = require('./routes/pelanggan.routes');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// --- SEMUA ROUTE SUDAH DISERAGAMKAN ---
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/pelanggan', pelangganRoutes);

// Rute dasar untuk health check
app.get('/', (req, res) => {
  res.status(200).send('Tokokopi API is running!');
});

app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});
