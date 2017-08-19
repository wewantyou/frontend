var express = require('express');
var app = express();
var util = require('util');

var bodyParser = require('body-parser');
var db = require('./db.js');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/create_form', function(req, res) {
    res.render('create_form');
});






app.get('/', function(req, res) {
    res.render('login', {error: ''});
});

app.post('/create_customer_account_links', function(req, res) {
	var uid = req.body.uid;
	var name = req.body.name;
	var pwd = req.body.pwd;

	var query1;
	query1 = "INSERT INTO Customer (customer_uid, customer_name, customer_pwd) VALUES ('",
	query1 += uid,
	query1 += "', '",
	query1 += name,
	query1 += "', '",
	query1 += pwd,
	query1 += "')",

	db.query(query1, function (error, result) {
  		if (error) throw error;
  		console.log('Success1');
	});

	var agency = "58998";

	var query2;
	query2 = "INSERT INTO Account (account_agency) VALUES ('",
	query2 += agency,
	query2 += "')",

	db.query(query2, function (error, result) {
  		if (error) throw error;
  		console.log('Success2');
  		var aid = result.insertId;

  		console.log('Here: ' + aid);

  		var query3;
		query3 = "INSERT INTO Links (customer_uid, account_id) VALUES ('",
		query3 += uid,
		query3 += "', '",
		query3 += aid,
		query3 += "')",

		db.query(query3, function (error, result) {
	  		if (error) throw error;
	  		console.log('Success3');

    		res.render('info', {name: name, uid: uid, aid: aid, agency: agency});
		});
	});
});

app.post('/show_dashboard', function(req, res) {
	var aid = req.body.aid;
	var pwd = req.body.pwd;

	console.log(aid + ' ' + pwd);

	var query1;
	query1 = "SELECT customer_uid FROM Links WHERE account_id='",
	query1 += aid;
	query1 += "'";

	db.query(query1, function (error, result) {
  		if (error) throw error;
  		var uid = result[0].customer_uid;
  		console.log('uid: ' + uid);

  		var query2;
		query2 = "SELECT customer_name, customer_pwd FROM Customer WHERE customer_uid='",
		query2 += uid;
		query2 += "'";

  		db.query(query2, function (error, result) {
	  		if (error) throw error;
	  		var pwd_db = result[0].customer_pwd;

	  		console.log('pwd: ' + pwd_db);

	  		if(pwd === pwd_db){
	  			var name = result[0].customer_name;

	  			var query3;
				query3 = "SELECT account_amount, account_agency FROM Account WHERE account_id='",
				query3 += aid;
				query3 += "'";

				db.query(query3, function (error, result) {
			  		if (error) throw error;
			  		var amount = result[0].account_amount;
			  		var agency = result[0].account_agency;

			  		console.log('amount: ' + amount);
			  		console.log('agency: ' + agency);

		    		res.render('dashboard', {name: name, uid: uid, aid: aid, agency: agency, amount: amount});
				});
	  		}else{
	  			res.render('login', {error: 'Invalid'});
	  		}
		});
	});
});

app.post('/show_deposit_page', function(req, res) {
	var aid = req.body.aid;
	res.render('deposit', {aid: aid});
});

app.post('/deposit', function(req, res) {
	var aid = req.body.aid;

	var query1;
	query1 = "SELECT account_amount FROM Account WHERE account_id='",
	query1 += aid;
	query1 += "'";

	db.query(query1, function (error, result) {
  		if (error) throw error;
  		var current_amount = result[0].account_amount;
  		console.log('current_amount ' + current_amount);

		var amount = req.body.amount;

		if(amount > 0){
			var query2;
			query2 = "UPDATE Account SET account_amount = '"
			query2 += parseInt(current_amount) + parseInt(amount);
			query2 += "' WHERE account_id='";
			query2 += aid,
			query2 += "'";

			db.query(query2, function (error, result) {
		  		if (error) throw error;
				console.log('Total Success');
			});

		    res.render('done', {aid: aid});
		}else{
			console.log('No Success' + ' ' + amount);
		}
	})
});

app.post('/show_withdraw_page', function(req, res) {
	var aid = req.body.aid;
	res.render('withdraw', {aid: aid});
});

app.post('/withdraw', function(req, res) {
	var aid = req.body.aid;

	var query1;
	query1 = "SELECT account_amount FROM Account WHERE account_id='",
	query1 += aid;
	query1 += "'";

	db.query(query1, function (error, result) {
  		if (error) throw error;
  		var current_amount = result[0].account_amount;
  		console.log('current_amount ' + current_amount);

		var amount = req.body.amount;

		if(amount > 0){
			var query2;
			query2 = "UPDATE Account SET account_amount = '"
			query2 += parseInt(current_amount) - parseInt(amount);
			query2 += "' WHERE account_id='";
			query2 += aid,
			query2 += "'";

			db.query(query2, function (error, result) {
		  		if (error) throw error;
				console.log('Total Success');
			});

		    res.render('done', {aid: aid});
		}else{
			console.log('No Success' + ' ' + amount);
		}
	})
});

// app.post('/go_back_dashboard', function(req, res) {
// 	var aid = req.body.aid;

// 	var query1;
// 	query1 = "SELECT customer_uid FROM Links WHERE account_id='",
// 	query1 += aid;
// 	query1 += "'";

// 	db.query(query1, function (error, result) {
//   		if (error) throw error;
//   		var uid = result[0].customer_uid;
//   		console.log('uid: ' + uid);

//   		var query2;
// 		query2 = "SELECT customer_name FROM Customer WHERE customer_uid='",
// 		query2 += uid;
// 		query2 += "'";

//   		db.query(query2, function (error, result) {
// 	  		if (error) throw error;
//   			var name = result[0].customer_name;
//   			console.log('name: ' + name);

//   			var query3;
// 			query3 = "SELECT account_amount, account_agency FROM Account WHERE account_id='",
// 			query3 += aid;
// 			query3 += "'";

// 			db.query(query3, function (error, result) {
// 		  		if (error) throw error;
// 		  		var amount = result[0].account_amount;
// 		  		var agency = result[0].account_agency;

// 		  		console.log('amount: ' + amount);
// 		  		console.log('agency: ' + agency);

// 	    		res.render('dashboard', {name: name, uid: uid, aid: aid, agency: agency, amount: amount});
// 			});
// 		});
// 	});
// });

app.post('/show_transfer_page', function(req, res) {
	var aid = req.body.aid;
	res.render('transfer', {aid: aid});
});

app.post('/transfer', function(req, res) {
	var aid = req.body.aid;
	var oaid = req.body.oaid;

	console.log('Aid aqui ' + aid + ' Oaid aqui ' + oaid)

	var query1;
	query1 = "SELECT account_amount FROM Account WHERE account_id='",
	query1 += aid;
	query1 += "'";

	db.query(query1, function (error, result1) {
  		if (error) throw error;
  		var current_amount = result1[0].account_amount;
  		console.log('current_amount ' + current_amount);

  		var query2;
		query2 = "SELECT account_amount FROM Account WHERE account_id='",
		query2 += oaid;
		query2 += "'";

		db.query(query2, function (error, result2) {
	  		if (error) throw error;
	  		var current_other_amount = result2[0].account_amount;
	  		console.log('current_other_amount ' + current_other_amount);

			var amount = req.body.amount;

			if(amount > 0 && current_amount >= amount){
				var query3;
				query3 = "UPDATE Account SET account_amount = '"
				query3 += parseInt(current_amount) - parseInt(amount);
				query3 += "' WHERE account_id='";
				query3 += aid,
				query3 += "'";

				db.query(query3, function (error, result) {
			  		if (error) throw error;
					console.log('Total Success1');

					var query3;
					query3 = "UPDATE Account SET account_amount = '"
					query3 += parseInt(current_other_amount) + parseInt(amount);
					query3 += "' WHERE account_id='";
					query3 += oaid,
					query3 += "'";

					db.query(query3, function (error, result) {
				  		if (error) throw error;
						console.log('Total Success2');
						res.render('done', {aid: aid});
					});
				});
			}else{
				console.log('No Success' + ' ' + amount);
			}
		})
	})
});

app.post('/go_back_dashboard', function(req, res) {
	var aid = req.body.aid;

	var query1;
	query1 = "SELECT customer_uid FROM Links WHERE account_id='",
	query1 += aid;
	query1 += "'";

	db.query(query1, function (error, result) {
  		if (error) throw error;
  		var uid = result[0].customer_uid;
  		console.log('uid: ' + uid);

  		var query2;
		query2 = "SELECT customer_name FROM Customer WHERE customer_uid='",
		query2 += uid;
		query2 += "'";

  		db.query(query2, function (error, result) {
	  		if (error) throw error;
  			var name = result[0].customer_name;
  			console.log('name: ' + name);

  			var query3;
			query3 = "SELECT account_amount, account_agency FROM Account WHERE account_id='",
			query3 += aid;
			query3 += "'";

			db.query(query3, function (error, result) {
		  		if (error) throw error;
		  		var amount = result[0].account_amount;
		  		var agency = result[0].account_agency;

		  		console.log('amount: ' + amount);
		  		console.log('agency: ' + agency);

	    		res.render('dashboard', {name: name, uid: uid, aid: aid, agency: agency, amount: amount});
			});
		});
	});
});

app.listen(3000);