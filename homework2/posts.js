const path = require('path');
const fs = require('fs');

function walk(dir, done) {
    let results = [];
    fs.readdir(dir, function(err, list) {
        if (err) return done(err);
        let pending = list.length;
        if (!pending) return done(null, results);
        list.forEach(function(file) {
            file = path.resolve(dir, file);
            fs.stat(file, function(err, stat) {
                if (stat && stat.isDirectory()) {
                    walk(file, function(err, res) {
                        results = results.concat(res);
                        if (!--pending) done(null, results);
                    });
                } else {
                    results.push(file);
                    if (!--pending) done(null, results);
                }
            });
        });
    });
}

function getFileJSON(options) {
    let filePath = 'api/posts/'+options+'/get.json';
    filePath = path.join(__dirname, filePath);

    return new Promise(function (resolve, reject) {
        fs.stat(filePath, function (err) {
            if (err) {
                reject(err);
            }

            fs.readFile(filePath, 'utf8', function (err, data) {
                if (err) {
                    reject(err);
                }
                data = JSON.parse(data);
                resolve(data);
            });
        });
    });
}

function getFolderJSON() {
    let folderPath = 'api/posts/';

    return new Promise(function (resolve, reject) {

        let files = new Promise(function (resolve, reject) {
            walk(folderPath, function(err, results) {
                if (err) reject(err);
                resolve(results);
            });
        });

        files.then(files => {



        });
    })
}

module.exports = {
    getData: function (options) {
        if(!options){
            return getFolderJSON().then(data => { return data; });
        }
        else{
            return getFileJSON(options).then(data => { return data; });
        }
    }
};