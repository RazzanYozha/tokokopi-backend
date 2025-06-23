// File: routes/order.routes.js

const express = require('express');
const { getAllOrders, createOrder } = require('../controllers/order.controller');

const router = express.Router();

// Rute untuk mendapatkan semua pesanan
// GET /api/orders/
router.get('/', getAllOrders);

// Rute untuk membuat pesanan baru
// POST /api/orders/
router.post('/', createOrder);

module.exports = router;