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

/**
 * Handle error if processing GET request
 */
router.get('/', function(req, res, next) {
  let err = new Error(errors.notFound.message);
  err.status = errors.notFound.code;
  next(err);
});

module.exports = router;
