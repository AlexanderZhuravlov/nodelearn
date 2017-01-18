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

/* Default Routes */
app.get('/', function (req, res) {
    res.send('<html><body><h1>My web app http API! Version ' + apiVersion + '</h1></body></html>');
});

app.post('/post', function (req, res) {
    res.send('<html><body><h1>Post body' + req + '</h1></body></html>');
});

/* API GET Method */
app.get('/api/:apiVersion/*', function (req, res) {
    res.type('json');
    helpers.getData(req.path).then(data => {
        res.json(data);
    }).catch(error =>{
        res.json(error);
    });
});