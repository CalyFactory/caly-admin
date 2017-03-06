import express from 'express';
import bodyParser from 'body-parser';
import mysql from 'mysql';

let dbconfig = require(__dirname+'/../server/config/db-config.json');
let connection = mysql.createConnection(dbconfig);

const app = express();
const port = 3000;

app.use('/', express.static(__dirname + "/../public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/admin-users', (req, res) => {
	connection.query('select * from USER', (err, rows) => {
		if(err) throw err;

		res.send(rows);
	});
});

// Display composed event with user hash key, calendar id and etc
app.get('/admin-events', (req, res) => {
	connection.query(
		`select 
			U.user_hashkey,
			C.calendar_id,
			C.calendar_name,
		    E.event_id,
		    E.event_hashkey,
		    E.summary,
		    E.start_dt,
		    E.end_dt,
		    E.location,
		    E.reco_state
		from USER as U
		inner join USERACCOUNT as UA
		    on U.user_hashkey = UA.user_hashkey
		inner join CALENDAR as C
		    on UA.account_hashkey = C.account_hashkey
		inner join EVENT as E
		    on C.calendar_hashkey = E.calendar_hashkey
		where 
			E.reco_state = 1
			and U.user_hashkey = \'`+req.query.userHashkey+'\'', 
    (err, rows) =>{
		if(err) throw err;
		res.send(rows);
	});	
});

app.get('/admin-recommend', (req, res) => {
	connection.query('select * from RECOMMENDATION', (err, rows) =>{
		if(err) throw err;

		res.send(rows);
	});
});

// Convert 1 to 2 (EVENT's reco_state)
app.post('/admin-notrecommend', (req, res) => {
	connection.query('update EVENT set reco_state=2 where event_hashkey=\''+req.body.event_hashkey+'\'', (err, rows) => {
		if(err) throw err;
	});
});

const server = app.listen(port, () => {
	console.log('Express listening on port', port);
});