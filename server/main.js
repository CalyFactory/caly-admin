import express from 'express';
import mysql from 'mysql';

let dbconfig = require(__dirname+'/../server/config/db-config.json');
let connection = mysql.createConnection(dbconfig);

const app = express();
const port = 3000;

app.use('/', express.static(__dirname + "/../public"));

app.get('/hello', (req, res) => {
	return res.send('Can you hear me?');
});

app.get('/recommend', (req, res) => {
	connection.query('SELECT * FROM RECOMMENDATION', (err, rows) =>{
		if(err) throw err;

		console.log('The recommendation is : ', rows);
		res.send(rows);
	});
});

import posts from './routes/posts';
app.use('/posts', posts);

const server = app.listen(port, () => {
	console.log('Express listening on port', port);
});