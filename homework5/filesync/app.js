#!/usr/bin/env node

'use strict';
const command = require('commander');
const promptly = require('promptly');
const chalk = require('chalk');
const cloud = require('./cloudClient');
const co = require('co');

const PASSWORD_MIN_LENGTH = 6;

command
  .arguments('<file>')
  .option('-u, --username <username>', 'Enter username:')
  .action(file => {
    co(function*() {
      let password = yield promptly.prompt('Enter password:', {validator: validator, silent: true});
      yield cloud.upload(file, command.username, password);
      console.log('File synced', file);
      process.exit(0);
    })
    .catch(exitWithError)
  })
  .parse(process.argv);

function exitWithError(err) {
  console.error(chalk.red(err.message));
  process.exit(1);
}

function validator (value) {
  if (value.length < PASSWORD_MIN_LENGTH) {
    throw new Error('Password should have length more than ' + PASSWORD_MIN_LENGTH);
  }
  return value;
}
