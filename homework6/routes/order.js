/**
 * Require modules
 */
const express = require('express');
const router = express.Router();
const co = require('co');
const errors = require('../config/errors');
const text = require('../config/text');
const configEmail = require('../config/email');
const helper = require('../helpers/general');
const senderEmail = require('../helpers/email');
const validator = require('../helpers/validator');

/**
 * POST orders.
 */
router.post('/', (req, res, next) => {
  co(function*() {
    // Validate params
    yield validator.validateOrder(req);

    // Prepare Order Info
    let orderInfo = req.body;
    orderInfo.ID = helper.getRandomInt(1, 9999);
    orderInfo.date = new Date();

    // Create mail transport
    const transport = senderEmail.createTransport();

    // Send emails promises
    let managerEmail = senderEmail.sendEmail(configEmail.managerType, transport, orderInfo);
    let clientEmail = senderEmail.sendEmail(configEmail.clientType, transport, orderInfo);

    // Result of sending emails
    yield [managerEmail, clientEmail];

    // Show success order page
    res.render('orders/success', {title: text.orderPageTitle, orderID: orderInfo.ID});
  })
  .catch(err => {

    console.error(err);
    res.render('orders/error', {title: text.orderPageTitle, errors: err});
  });
});
/*
  // Validate request params
  req.checkBody('fname', 'First Name should be a string').notEmpty().withMessage('First Name is required').isAlpha();
  req.checkBody('lname', 'Last Name should be a string').notEmpty().withMessage('Last Name is required').isAlpha();
  req.checkBody('phone', 'Phone should be a number').notEmpty().withMessage('Phone is required').isInt();
  req.checkBody('email', 'Email should be a valid email').notEmpty().withMessage('Email is required').isEmail();
  req.checkBody('product', 'Product should be specified').notEmpty().withMessage('Product is required').isIn(products.productsArray);

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
      return new Promise(function (resolve, reject) {
        let orderInfo = req.body;
        orderInfo.ID = helper.getRandomInt(1,9999);
        orderInfo.date = new Date();

        // Create transport
        const transport = senderEmail.createTransport();

        let managerEmail = senderEmail.sendEmail(configEmail.managerType, transport, orderInfo);
        let clientEmail = senderEmail.sendEmail(configEmail.clientType, transport, orderInfo);

        Promise.all([managerEmail,clientEmail])
          .then(result => {
            resolve(result);
          })
          .catch(error => {
            reject(errors.emailError);
          });
      });
    })
    .then(result => {
      // Render success page
      console.log(result);
      res.render('orders/success', { title: text.orderPageTitle, orderID: orderInfo.ID });
    })
    .catch(messages => {
      // Render error page
      console.error(messages);
      res.render('orders/error', { title: text.orderPageTitle, errors: messages });
    });
    */

/**
 * Handle error if processing GET request
 */
router.get('/', function(req, res, next) {
  let err = new Error(errors.notFound.message);
  err.status = errors.notFound.code;
  next(err);
});

module.exports = router;
