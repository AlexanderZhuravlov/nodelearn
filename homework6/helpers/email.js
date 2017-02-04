/**
 * Email Sender
 */
const nodemailer = require('nodemailer');
const ejs = require('ejs');
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
  let emailTo, data, subject;
  if(type == email.managerType){
    emailTo = email.managerEmail;
    subject = `Order ${orderInfo.ID}. ${orderInfo.fname} ${orderInfo.lname}`;
    data = {
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
    emailTo = orderInfo.email;
    subject = `Your order ${orderInfo.ID} accepted`;
    data = {
      product: orderInfo.product,
      orderID: orderInfo.ID,
      date: orderInfo.date
    }
  }

  return getEmailHTML(type.template, data)
  .then( html => {

    const mailOptions = {
      from: email.user,
      to: emailTo,
      subject: subject,
      html: html
    };

    return sendingMail(transport, mailOptions).then(result => { return result });
  })
  .then(result => { return result })
  .catch(error => { return error });
}

module.exports = {
  createTransport,
  sendEmail
};
