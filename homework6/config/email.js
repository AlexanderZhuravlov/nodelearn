/**
 * Email config
 */
const path = require('path');

module.exports = {
  service: 'Gmail',
  user: 'test25686@gmail.com',
  password: 'djpro2mx400',
  managerEmail: 'alexandr.zhuravlov@gmail.com',
  managerType: { type: 'manager', template: path.resolve('./views/email/manager.ejs') },
  clientType: { type: 'client', template: path.resolve('./views/email/client.ejs') }
};