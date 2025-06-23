const express = require('express');
const { getAllProducts } = require('../controllers/productController');

const router = express.Router();

// Rute ini akan menghasilkan endpoint /api/products
router.get('/products', getAllProducts);

module.exports = router;