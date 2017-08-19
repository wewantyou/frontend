var express = require('express');
var app = express();
var util = require('util');

var bodyParser = require('body-parser');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/create_form', function(req, res) {
    res.render('create_form');
});

app.get('/show_profile', function(req, res) {
    res.render('show_profile');
});

app.listen(3000);