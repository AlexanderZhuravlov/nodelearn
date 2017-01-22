/* Require modules */
const express = require('express');
const path = require('path');
const fs = require('fs');
const url = require('url');
const apiVersion = require('./package').version;

const constants = require('./constants');
const model = require('./model');

/* App settings */
let app = express();
app.set('port', constants.APP_PORT);

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
        model.getContent('posts').then(data => res.json(data)).catch(error => res.json(error));
    })
    .post(function (req, res) {
        res.send(req.params)
    });
app.route('/api/:apiVersion/posts/:postId/')
    .get(function (req, res) {
        model.getContent('posts', req.params.postId).then(data => res.json(data)).catch(error => res.json(error));
    })
    .post(function (req, res) {
        res.send(req.params)
    })
    .delete(function (req, res) {
        res.send(req.params)
    })
    .put(function (req, res) {
        res.send(req.params)
    });

/* USERS Routes */
app.route('/api/:apiVersion/users/')
    .get(function (req, res) {
        model.getContent('users').then(data => res.json(data)).catch(error => res.json(error));
    })
    .post(function (req, res) {
        res.send(req.params)
    });
app.route('/api/:apiVersion/users/:postId/')
    .get(function (req, res) {
        model.getContent('users', req.params.postId).then(data => res.json(data)).catch(error => res.json(error));
    })
    .post(function (req, res) {
        res.send(req.params)
    })
    .delete(function (req, res) {
        res.send(req.params)
    })
    .put(function (req, res) {
        res.send(req.params)
    });


/* Default Not Found Route */
app.all('/api/*', function (req, res) {
    res.sendStatus(404);
});