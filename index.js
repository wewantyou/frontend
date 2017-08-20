var express = require('express');
var app = express();
var util = require('util');
const axios = require('axios');

var bodyParser = require('body-parser');

// app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('portraiture'))

app.get('/create_form', function(req, res) {
    res.render('create_form');
});

app.get('/fill_form/:id', function(req, res) {
    res.render('form_to_complete', {id: req.params.id, email: req.query.email});
});

app.get('/show_profile', function(req, res) {
    res.render('show_profile');
});

app.get('/show_form/:id', function(req, res) {
	//include the email also in the query string
	axios.get(`https://wilkmaia.xyz/forms/${req.params.id}`)
	.then(function (response) {
		res.json({
			error: false,
			message: response.data
		})
	})
	.catch(function (error) {
		res.json({
			error: false,
			message: error
		})
	});
});

app.post('/send_form', function(req, res){
	axios.post('https://wilkmaia.xyz/forms', {block: req.body})
	.then((err) => {
		res.render('success')
	})
});

app.post('/answer_form', function(req, res){
	let params = {
		name: req.body.name,
		email: req.body.email,
		github: req.body.github,
		linkedin: req.body.linkedin
	}
	delete req.body.name;
	delete req.body.email;
	delete req.body.github;
	delete req.body.linkedin;

	axios.post('https://wilkmaia.xyz/candidates', {
		name: params.name,
		email: params.email,
		form: req.body,
		github: params.github,
		linkedin: params.linkedin
	})
	.then((candidate) => {
		if(candidate.data.error)
			res.render('form_to_complete')
		else
			res.render('success')
	})
	.catch(()=>{
		res.render('form_to_complete')
	})
});


app.post('/send_like', function(req, res){
    axios.post(`https://wilkmaia.xyz/candidates/${req.body.id}/like`, {
	author: req.body.author,
    })
	.then((response) => {
	    res.send(response.data)
	})
	.catch((err) => {
	    res.send(err.response.data)
	})
})

app.listen(3000);
