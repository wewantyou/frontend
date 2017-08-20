var express = require('express');
var app = express();
var util = require('util');
const axios = require('axios');

var bodyParser = require('body-parser');

app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('portraiture'))

app.get('/create_form', function(req, res) {
    res.render('create_form');
});

app.get('/show_profile', function(req, res) {
    res.render('show_profile');
});

app.post('/send_form', function(req, res){
    axios.post('https://wilkmaia.xyz/forms', {block: req.body})
    .then((err) => {
	    console.log("Wooo")
    })
})

app.listen(3000);
