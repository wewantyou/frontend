var mysql = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '454561',
  database : 'myBank'
});

connection.connect(function(err) {
    if (err) throw err;
});

module.exports = connection;