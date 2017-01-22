/* Require modules */
const express = require('express');
const path = require('path');
const fs = require('fs');
const url = require('url');
const apiVersion = require('./package').version;

const helpers = require('./helpers');
const constants = require('./constants');

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
        res.send(req.params)
    })
    .post(function (req, res) {
        res.send(req.params)
    });
app.route('/api/:apiVersion/posts/:postId/')
    .get(function (req, res) {
        res.send(req.params)
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
        res.send(req.params)
    })
    .post(function (req, res) {
        res.send(req.params)
    });
app.route('/api/:apiVersion/users/:postId/')
    .get(function (req, res) {
        res.send(req.params)
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





/* API GET Method */
/*
app.get('/api/:apiVersion/!*', function (req, res) {
    res.type('json');
    helpers.getData(req.path).then(data => {
        res.json(data);
    }).catch(error =>{
        res.json(error);
    });
});*/
