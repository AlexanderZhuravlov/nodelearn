'use strict';
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const path = require('path');
const agent = require('superagent');
const progressBar = require('progress-bar');
const co = require('co');

const CLOUD_URL = 'localhost:3000/upload';

module.exports = {
  upload: postFileToCloud
};

function postFileToCloud(filePath, username, password) {
  return co(function*() {
    let stats = yield fs.statAsync(filePath);
    console.log('Trying to sync file', filePath, 'with size', stats.size);
    let bar = progressBar.create(process.stdout);
    let fileStream = fs.createReadStream(filePath);
    let uploadUrl = generateUploadUrl(filePath);
    return agent
      .post(uploadUrl)
      .auth(username, password)
      .type('form')
      .on('progress', e => {
        let percentDone = Math.floor((e.loaded / e.total) * 100);
        bar.update(percentDone / 100);
      })
      .attach('syncfile', fileStream)
      .set('Accept', 'application/json');
  })
  .catch(function(err) {
    console.error(err.stack);
  });
}

function generateUploadUrl(filePath) {
  let filePathQuery = encodeURI(path.resolve(filePath));
  console.log('filePathQuery generated', filePathQuery);
  return CLOUD_URL + '?filePath=' + filePathQuery;
}
