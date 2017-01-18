const postsModel = require('./posts');
const usersModel = require('./users');

module.exports = {
    APP_PORT: 3333,
    AVAILABLE_PARAMS:{
        posts: postsModel,
        users: usersModel
    }
};