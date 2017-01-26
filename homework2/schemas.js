const Validator = require('jsonschema').Validator;
let v = new Validator();

const postSchema = {
    'type': 'object',
    'properties': {
        'postId': {'type': 'string'},
        'imgUrl': {'type': 'string'},
        'likeCount': {'type': 'string'},
        'description': {'type': 'string'},
        'userId': {'type': 'string'}
    },
    'required': ['postId', 'imgUrl', 'likeCount', 'description', 'userId']
};

const userSchema = {
    'type': 'object',
    'properties': {
        'id': {'type': 'string'},
        'email': {'type': 'string'},
        'name': {'type': 'string'},
        'image': {'type': 'string'},
        'password': {'type': 'string'},
        'following' : {'$ref': '/followingSchema'}
    },
    'required': ['id', 'email', 'name', 'image', 'password']
};

const followingSchema = {
    'id': '/followingSchema',
    'type': 'object',
    'properties': {
        'tags': {
            'type': 'array',
            'items' : {'type': 'object',
                'properties': {
                    'name': {'type': 'string'},
                    'active' : {'type': 'boolean'},
                }
            },
        },
        'users': {
            'type': 'array',
            'items' : {
                'type': 'object',
                'properties': {
                    'name': {'type': 'string'},
                    'active': {'type': 'boolean'},
                }
            }
        }
    }
};

module.exports = {
    validatePost: function (dataJson) {
        return v.validate(dataJson, postSchema).valid;
    },
    validateUser: function (dataJson) {
        return v.validate(dataJson, userSchema).valid;
    }
};