#!/usr/bin/env node

/*
  The shebang (#!) at the start means execute the script with what follows.
  /bin/env looks at your current node environment.
  Any argument to it not in a 'name=value' format is a command to execute.
*/
'use strict';
const command = require('commander');
const promptly = require('promptly');
const chalk = require('chalk');
const cloud = require('./cloudClient');

const PASSWORD_MIN_LENGTH = 6;

command
  .arguments('<file>')
  .option('-u, --username <username>', 'Enter username:')
  .action(file => promptly.prompt('Enter password:', { validator: validator, silent: true })
    .then(password => cloud.upload(file, command.username, password))//TO-DO: promisify
    .then(() => {
      console.log('File synced', file);
      process.exit(0);
    })
    .catch(exitWithError)
  )
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
