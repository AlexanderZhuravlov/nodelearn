const constants = require('./constants');

/* Remove slashes from start and end in path */
function removeSlashFromPath(path) {
    if (path.charAt(0) == "/") path = path.substr(1);
    if (path.charAt(path.length - 1) == "/") path = path.substr(0, path.length - 1);
    return path;
};

/* Split Request params to array */
function parsePath(path) {
    if(path.length > 0){
        return removeSlashFromPath(path).split('/');
    }
    else return false;
}

function getRequestDataType(path){
    const pathParameters = parsePath(path);
    if(!pathParameters) return false;

    const paramArrayLength = pathParameters.length;
    let dataType = [];

    for (let parameter in constants.AVAILABLE_PARAMS){
        let positionParam = pathParameters.indexOf(parameter);
        switch(positionParam){
            case (paramArrayLength-1):
                dataType.push(constants.AVAILABLE_PARAMS[parameter],false);
                break;
            case (paramArrayLength-2):
                dataType.push(constants.AVAILABLE_PARAMS[parameter],pathParameters[paramArrayLength-1]);
                break;
        }
    }
    return dataType;
}

module.exports = {
    getData: function (path) {
        let dataType = getRequestDataType(path);
        return new Promise(function(resolve,reject){
            if(dataType.length == 0){
                reject({success: false, message: 'No data available for this request'});
            }
            resolve(dataType[0].getData(dataType[1]).then(data => { return data }));
        });
    }
};