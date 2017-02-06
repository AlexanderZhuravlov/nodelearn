/**
 * Email config
 */
const path = require('path');

module.exports = {
  service: 'Gmail',
  user: 'test@gmail.com',
  password: '********',
  managerEmail: 'alexandr.zhuravlov@gmail.com',
  managerType: { type: 'manager', template: path.resolve('./views/email/manager.ejs') },
  clientType: { type: 'client', template: path.resolve('./views/email/client.ejs') }
};
