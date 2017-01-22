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
    }
};