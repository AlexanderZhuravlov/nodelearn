/**
 * Require modules
 */
const express = require('express');
const router = express.Router();
const util = require('util');
const nodemailer = require('nodemailer');
const errors = require('../config/errors');
const products = require('../config/products');
const text = require('../config/text');
const helper = require('../helpers/general');

/**
 * POST orders.
 */
router.post('/', function(req, res, next) {
  // Validate request params
  req.checkBody('fname', 'Invalid First Name').notEmpty().withMessage('First Name is required').isAlpha();
  req.checkBody('lname', 'Invalid Last Name').notEmpty().withMessage('Last Name is required').isAlpha();
  req.checkBody('phone', 'Invalid Phone').notEmpty().withMessage('Phone is required').isInt();
  req.checkBody('email', 'Invalid Email').notEmpty().withMessage('Email is required').isEmail();
  req.checkBody('product', 'Invalid Product').notEmpty().withMessage('Product is required').isIn(products.productsArray);

  req.getValidationResult()
    .then(result => {
      // Check validation result
      return new Promise(function (resolve, reject) {
        if (!result.isEmpty()) {
          let messages = result.array().map(function (item) {
            return item.msg;
          });
          reject(messages);
        }
        resolve();
      });
    })
    .then(() => {
      // Send email
      return new Promise(function (resolve, reject) {

        console.log(req.body);

        // reject(['Email can not be sent'])

        resolve();
      });
    })
    .then(() =>{
      // Render success page
      res.render('orders/success', { title: text.orderPageTitle, orderID: helper.getRandomInt(1,9999) });
    })
    .catch(messages => {
      // Render error page
      res.render('orders/error', { title: text.orderPageTitle, errors: messages });
    });
});

/**
 * Handle error if processing GET request
 */
router.get('/', function(req, res, next) {
  let err = new Error(errors.notFound.message);
  err.status = errors.notFound.code;
  next(err);
});

module.exports = router;
