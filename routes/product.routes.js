const express = require('express');
const { getAllProducts } = require('../controllers/product.controller');

const router = express.Router();

// Rute ini akan menghasilkan endpoint /api/products
router.get('/products', getAllProducts);

module.exports = router;