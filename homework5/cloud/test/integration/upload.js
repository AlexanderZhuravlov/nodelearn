const request = require('./test').request;
const expect = require('chai').expect;
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const path = require('path');
const config = require('config');
const debug = require('debug')('test:integration:upload');
const testData = require('./resources/testData').upload;
const DEFAULT_FILES_IN_UPLOAD_FOLDER = 1;
const CORRECT_UPLOAD_URL = '/upload?filePath=' + encodeURI(testData.file);
const FILELIST_PATH = path.resolve(config.filesListPath);
const UPLOAD_FOLDER = path.resolve(config.uploadDestination);
const UPLOAD_FOLDER_EXCLUDE = [ '.gitkeep' ];
const co = require('co');

describe('Upload', () => {

  before(() => {
    debug('Started with config', config);
    return clearUploadFolder();
  });

  after(() => {
    return clearUploadFolder();
  });

  it('should get 400 error without mandatory qs and not upload the file', () => {
    let fileStream = fs.createReadStream(testData.file);
    const wrongUploadUrl = '/upload';
    return request
      .post(wrongUploadUrl)
      .auth(testData.username, testData.password)
      .type('form')
      .attach('syncfile', fileStream)
      .set('Connection', 'keep-alive')
      .expect(400)
      .then(function(){
        return checkUploadResults(0);
      });
  });

  it('should get 401 error with wrong credentials and not upload the file', () => {
    let fileStream = fs.createReadStream(testData.file);
    const wrongPassword = testData.password + 'qwe';
    return request
      .post(CORRECT_UPLOAD_URL)
      .auth(testData.username, wrongPassword)
      .type('form')
      .attach('syncfile', fileStream)
      .set('Connection', 'keep-alive')
      .expect(401)
      .then(function(){
        return checkUploadResults(0);
      });
  });

  it('should upload non-synced file', () => {
    let fileStream = fs.createReadStream(testData.file);
    return request
      .post(CORRECT_UPLOAD_URL)
      .auth(testData.username, testData.password)
      .type('form')
      .attach('syncfile', fileStream)
      .expect(200)
      .then(function(response){
        return Promise.all([
          expect(response.body.duplicate).to.equal(false),
          checkUploadResults(1, true, testData.file)
        ]);
      });
  });

  it('should not upload already synced file but response 200', () => {
    let fileStream = fs.createReadStream(testData.file);
    return request
      .post(CORRECT_UPLOAD_URL)
      .auth(testData.username, testData.password)
      .type('form')
      .attach('syncfile', fileStream)
      .expect(200)
      .then(response => {
        return Promise.all([
          expect(response.body.duplicate).to.equal(true),
          checkUploadResults(1, true, testData.file)
        ]);
      });
  });

});

function clearUploadFolder() {
  return co(function*() {
    yield [
      ensureNoFilesInFolder(),
      ensureNoFilesList()
    ];
    debug('Upload destination cleaned and ready for testing');
  });
}

function ensureNoFilesInFolder() {
  return co(function*() {
    let files = yield fs.readdirAsync(UPLOAD_FOLDER);
    yield removeUnwantedFiles(files);
    files = yield fs.readdirAsync(config.uploadDestination);
    if (files.length !== DEFAULT_FILES_IN_UPLOAD_FOLDER) {
      throw new Error('Wrong default files length in upload folder after cleanup ' + files.length);
    }
  });
}

function removeUnwantedFiles(files) {
  return Promise.all(files.map(function(file) {
    return !UPLOAD_FOLDER_EXCLUDE.includes(file)
      && fs.unlinkAsync(path.join(UPLOAD_FOLDER, file));
  }));
}

function ensureNoFilesList() {
  return fs.statAsync(FILELIST_PATH)
    .catch(function(){
      return false;
    })
    .then(function(stats) {
      return stats && fs.unlinkAsync(FILELIST_PATH);
    });
}

function checkUploadResults(num, filesListExists, lastFilePath) {
  const filesInFolder = DEFAULT_FILES_IN_UPLOAD_FOLDER + num;
  const recordsInFileList = num;
  return fs.readdirAsync(config.uploadDestination)
    .then(function(files) {
      return expect(files.length).to.equal(filesInFolder);
    })
    .then(function() {
      return filesListExists && getFilesList();
    })
    .then(function(filesList){
      return filesList && Promise.all([
        filesListExists && expect(filesList.length).to.equal(recordsInFileList),
        lastFilePath && expect(filesList[filesList.length - 1]).to.equal(lastFilePath)
      ]);
    });
}

function getFilesList() {
  return fs
    .readFileSync(FILELIST_PATH, 'utf8')
    .trim()
    .split(config.filesRecordSplitter);
}
