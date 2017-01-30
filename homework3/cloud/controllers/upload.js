const multer  = require('multer');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const config = require('config');
const log = require('../log');

const uploadMiddleware = multer({
  dest: config.uploadDestination,
  fileFilter: fileFilter
});

const FILES_LIST_PATH = config.filesListPath;
let filesList = {};

try {
  filesList = fs.readFileSync(FILES_LIST_PATH, 'utf8');
  log.info('FileList loaded at start');
} catch (err) {
  fs.writeFile(FILES_LIST_PATH, JSON.stringify(filesList), function(err) {
    if(err) {
      return log.info('Error - ',err);
    }
    log.info('No fileList found at start, created empty FileList');
  });
}

function fileFilter(req, file, cb) {
  let filePath = req.query.filePath;

  fs.statAsync(filePath)
    .then(stat => {
      return stat.mtime;
    })
    .then(modifiedTime => {
      return fs.readFileAsync(FILES_LIST_PATH)
        .then(file => {
          return JSON.parse(file);
        })
        .then(fileList => {
          if((Object.keys(fileList).length === 0) || !(filePath in fileList)){
            saveToFileList(filePath, modifiedTime, function(err) {
              cb(err, true);
            });
          }
          else{
            for (let key in fileList) {
              if(key == filePath){
                let fileDate = new Date(modifiedTime);
                let syncDate = new Date(fileList[key]);
                if(fileDate > syncDate){
                  saveToFileList(filePath, modifiedTime, function(err) {
                    cb(err, true);
                  });
                }
                else{
                  cb(null, false);
                }
              }
            }
          }
        })
        .catch(err => {
          throw new Error(err);
        });
    })
    .catch(err => {
      throw new Error(err);
    });
}

function validateRequest() {
  return function(req, res, next) {
    let filePath = req.query.filePath;
    if (!filePath) {
      let err = new Error('Validation error: filePath parameter is missing');
      err.code = 400;
      return next(err);
    }
    next();
  }
}

function saveToFileList(filePath, mtime, cb) {
  fs.readFileAsync(FILES_LIST_PATH)
    .then(file => {
      let fileList = JSON.parse(file);
      fileList[filePath] = mtime;
      return fileList;
     })
    .then(data => {
      return fs.writeFile(FILES_LIST_PATH, JSON.stringify(data), function(err) {
        if(err) {
          throw new Error(err);
        }
      });
    })
    .then(() => { return cb() })
    .catch(err => { return cb(err) });
}

module.exports = {
  parse: uploadMiddleware,
  validate: validateRequest
};
