/* Require modules */
const express = require('express');
const bodyParser = require('body-parser');
const apiVersion = require('./package').version;

const constants = require('./constants');
const model = require('./model');
const schema = require('./schemas');

/* App settings */
let app = express();
app.set('port', constants.APP_PORT);
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

/* App start */
app.listen(app.get('port'), function() {
    console.log('Node app is running on http://localhost:' + app.get('port') );
});

/* Default Home Route */
app.get('/', function (req, res) {
    res.send('<html><body><h1>My web app http API! Version ' + apiVersion + '</h1></body></html>');
});

/* POSTS Routes */
app.route('/api/:apiVersion/posts/')
    .get(function (req, res) {
        model.getContent('posts').then(data => res.json(data)).catch(error => res.status(400).json(error));
    })
    .post(function (req, res) {
        if(schema.validatePost(req.body)){
            model.addContent('posts', req.body).then(data => res.json(data)).catch(error => res.status(409).json(error));
        }
        else{
            res.status(409).json({status: 'fail', message: 'Request JSON data is invalid'});
        }
    });
app.route('/api/:apiVersion/posts/:postId/')
    .get(function (req, res) {
        model.getContent('posts', req.params.postId).then(data => res.json(data)).catch(error => res.status(400).json(error));
    })
    .post(function (req, res) {

        res.json(req.body);
    })
    .delete(function (req, res) {
        model.deleteContent('posts', req.params.postId).then(data => res.json(data)).catch(error => res.status(400).json(error));
    })
    .put(function (req, res) {
        res.send(req.params)
    });

/* USERS Routes */
app.route('/api/:apiVersion/users/')
    .get(function (req, res) {
        model.getContent('users').then(data => res.json(data)).catch(error => res.status(400).json(error));
    })
    .post(function (req, res) {
        if(schema.validateUser(req.body)){
            model.addContent('users', req.body).then(data => res.json(data)).catch(error => res.status(409).json(error));
        }
        else{
            res.status(409).json({status: 'fail', message: 'Request JSON data is invalid'});
        }
    });
app.route('/api/:apiVersion/users/:postId/')
    .get(function (req, res) {
        model.getContent('users', req.params.postId).then(data => res.json(data)).catch(error => res.status(400).json(error));
    })
    .post(function (req, res) {
        res.send(req.params)
    })
    .delete(function (req, res) {
        model.deleteContent('users', req.params.postId).then(data => res.json(data)).catch(error => res.status(400).json(error));
    })
    .put(function (req, res) {
        res.send(req.params)
    });

/* Default Not Found Route */
app.all('/api/*', function (req, res) {
    res.status(404).json({status: 'fail', message: 'Not Found'});
});