/**
 * Email Sender
 */
const nodemailer = require('nodemailer');
const ejs = require('ejs');
const co = require('co');
const email = require('../config/email');

function createTransport() {
  return nodemailer.createTransport({
    service: email.service,
    auth: {
      user: email.user,
      pass: email.password
    }
  });
}

function prepareEmailData(type, orderInfo) {
  let object = {};
  if(type == email.managerType){
    object.emailTo = email.managerEmail;
    object.subject = `Order ${orderInfo.ID}. ${orderInfo.fname} ${orderInfo.lname}`;
    object.data = {
      firstname: orderInfo.fname,
      lastname: orderInfo.lname,
      phone: orderInfo.phone,
      email: orderInfo.email,
      product: orderInfo.product,
      orderID: orderInfo.ID,
      date: orderInfo.date
    }
  }
  else{
    object.emailTo = orderInfo.email;
    object.subject = `Your order ${orderInfo.ID} accepted`;
    object.data = {
      product: orderInfo.product,
      orderID: orderInfo.ID,
      date: orderInfo.date
    }
  }
  return object;
}

function getEmailHTML(template, data) {
  return new Promise(function (resolve,reject) {
    ejs.renderFile(template, data, function(err, str){
      if(err) reject(err);
      resolve(str);
    });
  });
}

function sendingMail(transport, mailOptions) {
  return new Promise(function (resolve,reject) {
    transport.sendMail(mailOptions, function(error, info){
      if(error){
        reject(error);
      }else{
        //console.log('Message sent: ' + info.response);
        resolve(info);
      }
    });
  });
}

function sendEmail(type, transport, orderInfo){
  let {emailTo, data, subject} = prepareEmailData(type, orderInfo);

  co(function*() {
    // Get email html
    let html = yield getEmailHTML(type.template, data);

    // Prepare email options
    const mailOptions = {
      from: email.user,
      to: emailTo,
      subject: subject,
      html: html
    };

    // Sending email
    return yield sendingMail(transport, mailOptions);
  })
  .catch(err => {

    console.error(err);
    return err;
  });
}

module.exports = {
  createTransport,
  sendEmail
};
