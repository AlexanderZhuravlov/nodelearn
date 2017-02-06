/**
 * Require modules
 */
const express = require('express');
const router = express.Router();
const products = require('../config/products');
const text = require('../config/text');

/**
 * GET home page.
 */
router.get('/', function(req, res, next) {
  res.render('index', { title: text.homePageTitle , products: products.productsArray});
});

module.exports = router;
