const products = require('../config/products');

function validateOrder(req) {
  return new Promise(function (resolve,reject) {

    // Validate request params
    req.checkBody('fname', 'First Name should be a string').notEmpty().withMessage('First Name is required').isAlpha();
    req.checkBody('lname', 'Last Name should be a string').notEmpty().withMessage('Last Name is required').isAlpha();
    req.checkBody('phone', 'Phone should be a number').notEmpty().withMessage('Phone is required').isInt();
    req.checkBody('email', 'Email should be a valid email').notEmpty().withMessage('Email is required').isEmail();
    req.checkBody('product', 'Product should be specified').notEmpty().withMessage('Product is required').isIn(products.productsArray);

    req.getValidationResult().then(result => {
      if (!result.isEmpty()) {
        let messages = result.array().map(function (item) {
          return item.msg;
        });
        reject(messages);
      }
      resolve();
    });
  });
}

module.exports = {
  validateOrder
};