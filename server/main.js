import express from 'express';
import bodyParser from 'body-parser';
import mysql from 'mysql';
import path from 'path';
import 'whatwg-fetch';

let dbconfig = require(__dirname+'/../server/config/db-config.json');
let connection = mysql.createConnection(dbconfig);

const app = express();
const port = 3000;

app.use('/', express.static(__dirname + "/../public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/admin-users', (req, res) => {
	connection.query(
		`select
			U.user_hashkey,
			U.user_birth,
			U.user_gender,
			UA.create_datetime
		from USER as U
		inner join USERACCOUNT as UA
			on U.user_hashkey = UA.user_hashkey
		`, (err, rows) => {
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
/*
app.get('/', (req, res) =>{
	res.sendFile(path.join(__dirname + "/../public/login.html"));
});*/

app.post('/admin-login', (req, res) => {
	connection.query('select admin_id,admin_pw from ADMINACCOUNT where admin_id=\''+req.body.admin_id+'\' and admin_pw=\''+req.body.admin_pw+'\'', (err, admins) => {
		if(err) throw err;
		
		if(admins.length>0)
			return res.redirect('/mapper');
		else
		{
			console.log("login failed."+"ID : "+req.body.admin_id+", PW : "+req.body.admin_pw);
			return res.redirect('/');
		}


	});
});

app.get('/admin-recommend', (req, res) => {
	connection.query('select * from RECOMMENDATION', (err, rows) =>{
		if(err) throw err;

		res.send(rows);
	});
});

let keyconfig = require(__dirname+'/../server/config/key.json');
// Convert 1 to 3 (EVENT's reco_state) and push to client
app.post('/admin-update-event-recostate', (req, res) => {
	connection.query('update EVENT set reco_state='+req.body.reco_state+' where event_hashkey=\''+req.body.event_hashkey+'\'', (err, rows) => {
		if(err) throw err;
	});

	/* Did not test 
	connection.query(
		`select 
			UD.push_token
		from USERDEVICE as UD
		inner join USERACCOUNT as UA
			on UD.account_hashkey = UA.account_hashkey
		where
			UA.user_hashkey = \'`+req.body.user_hashkey+'\''
		, (err, pushtokens) => {
			let pushtoken_length=pushtokens.length;
			for(let i=0; i<pushtoken_length; i++)
			{
				let pushtoken_data={
					'to':pushtokens[i],
					'data':{
						"type":"reco",
						"action":""
					}
				};

				fetch('/',{
					method:'post',
					dataType:'json',
					headers:{
						'Content-type':'application/json',
						'Authorization':'key='+keyconfig.key
					},
					body: JSON.stringify(pushtoken_data)
				})
			}
	});*/
});

app.post('/admin-map-recommend', (req, res) => {
	let length = req.body.reco_hashkey_list.length;
	for(let i=0; i<length ; i++)
	{
		connection.query('insert into EVENT_RECO (event_hashkey, reco_hashkey) values (\''+req.body.event_hashkey+'\', \''+req.body.reco_hashkey_list[i]+'\')', (err,rows) => {
			if(err) throw err;
		});
	}
});

const server = app.listen(port, () => {
	console.log('Express listening on port', port);
});