require('../../bin/www');
const app = require('../../app');
const request = require('supertest');
const debug = require('debug')('test');
const requestInstance = request(app);

before(() => {
  debug('>>>>>>>>>>>>>Global setup<<<<<<<<<<<<<<<<<<<<<<<');
});

after(() => {
  debug('>>>>>>>>>>>>>Global teardown<<<<<<<<<<<<<<<<<<<<<<<');
});

module.exports.request = requestInstance;
