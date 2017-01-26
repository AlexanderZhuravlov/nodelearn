const path = require('path');
const fs = require('fs');

function walkOnDir(dir, fileType, done) {
    let results = [];
    fs.readdir(dir, function(err, list) {
        if (err) return done(err);
        let pending = list.length;
        if (!pending) return done(null, results);
        list.forEach(function(file) {
            file = path.resolve(dir, file);
            fs.stat(file, function(err, stat) {
                if (stat && stat.isDirectory()) {
                    walkOnDir(file, fileType, function(err, res) {
                        results = results.concat(res);
                        if (!--pending) done(null, results);
                    });
                } else {
                    let currentFileType = path.basename(file, '.json');
                    if(currentFileType == fileType){
                        results.push(file);
                    }
                    if (!--pending) done(null, results);
                }
            });
        });
    });
}

function getAllContent(dirPath) {
    return new Promise(function (resolve, reject) {
        let files = new Promise(function (resolve, reject) {
            walkOnDir(dirPath, 'get', function(err, results) {
                if (err) reject(err);
                resolve(results);
            });
        });
        files.then(files => {
            if(files.length > 0){
                let filesPromises = files.map(filePath => {return getPost(filePath)} );
                Promise.all(filesPromises).then(data => resolve(data)).catch(error => reject(error));
            }
            else{
                reject({success: false, message: 'No content found'});
            }
        }).catch(error => reject(error));
    });
}

function getPost(filePath) {
    return new Promise(function (resolve, reject) {
        fs.stat(filePath, function (err) {
            if (err) {
                reject({success: false, error: err});
                return;
            }
            fs.readFile(filePath, 'utf8', function (err, data) {
                if (err) {
                    reject({success: false, error: err});
                    return;
                }
                data = JSON.parse(data);
                resolve(data);
            });
        });
    });
}

function deleteFile(dir, file) {
    return new Promise(function (resolve, reject) {
        let filePath = path.join(dir, file);
        fs.lstat(filePath, function (err, stats) {
            if (err) {
                return reject(err);
            }
            if (stats.isDirectory()) {
                resolve(deleteDirectory(filePath));
            } else {
                fs.unlink(filePath, function (err) {
                    if (err) {
                        return reject(err);
                    }
                    resolve();
                });
            }
        });
    });
}

function deleteDirectory(dir) {
    return new Promise(function (resolve, reject) {
        fs.access(dir, function (err) {
            if (err) {
                return reject({"status": "fail"});
            }
            fs.readdir(dir, function (err, files) {
                if (err) {
                    return reject(err);
                }
                Promise.all(files.map(function (file) {
                    return deleteFile(dir, file);
                })).then(function () {
                    fs.rmdir(dir, function (err) {
                        if (err) {
                            return reject(err);
                        }
                        resolve({"status": "success"});
                    });
                }).catch(reject);
            });
        });
    });
}

function addDir(dirPath) {
    return new Promise(function(resolve,reject){
        fs.access(dirPath, function (err) {
            if (err) {
                fs.mkdir(dirPath, function (err) {
                    if (err) {
                        return reject({status: 'fail', message: err});
                    }
                    resolve(dirPath);
                });
            }
            else return reject({status: 'fail', message: 'dir exists'});
        });
    });
}

function addFile(dirPath, content) {
    return new Promise(function(resolve,reject){
        fs.writeFile(dirPath + '/get.json', JSON.stringify([content]), function(err){
            if (err) return reject({status: 'fail', message: err});
            resolve({status: 'success'});
        });
    });
}

function checkFile(dirPath) {
    return new Promise(function(resolve,reject){
        fs.access(dirPath, function (err) {
            if (err) {
                return reject({status: 'fail', message: 'dir does not exists'});
            }
            fs.stat(dirPath+'get.json', function (err) {
                if (err) {
                    return reject({status: 'fail', message: 'file does not exists'});
                }
                resolve(dirPath+'get.json');
            });
        });
    });
}

function replaceFile(path, content) {
    return new Promise(function(resolve,reject){
        fs.writeFile(path, JSON.stringify([content]), 'utf8', function (err) {
            if (err) reject({status: 'fail', message: err});
            resolve({status: 'success'});
        });
    });
}

module.exports = {
    getContent: function (type, entityId = false) {
        return new Promise(function(resolve,reject){
            if(!entityId){
                let dirPath = 'api/'+type+'/';
                dirPath = path.join(__dirname, dirPath);
                getAllContent(dirPath).then(data => resolve(data)).catch(error => reject(error));
            }
            else{
                let filePath = 'api/'+type+'/'+entityId+'/get.json';
                filePath = path.join(__dirname, filePath);
                getPost(filePath).then(data => resolve(data)).catch(error => reject(error));
            }
        });
    },
    deleteContent: function (type, entityId) {
        return new Promise(function(resolve,reject){
            let dirPath = 'api/'+type+'/'+entityId+'/';
            dirPath = path.join(__dirname, dirPath);
            deleteDirectory(dirPath).then(result => resolve(result)).catch(error => reject(error));
        });
    },
    addContent: function (type, content) {
        return new Promise(function(resolve,reject){
            let dirPath = 'api/'+type+'/'+content.postId+'/';
            addDir(dirPath)
                .then(dir => { return addFile(dir, content)})
                .then(result => resolve(result))
                .catch(error => reject(error));
        });
    },
    replaceContent: function (type, entityId, content) {
        return new Promise(function(resolve,reject){
            let dirPath = 'api/'+type+'/'+entityId+'/';
            checkFile(dirPath)
                .then(path => { return replaceFile(path, content)})
                .then(result => resolve(result))
                .catch(error => reject(error));
        });
    }
};