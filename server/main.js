import express from 'express';
import bodyParser from 'body-parser';
import mysql from 'mysql';
import path from 'path';
import 'whatwg-fetch';
import request from 'request-promise';
import sync from 'sync';

let dbconfig = require(__dirname+'/../server/config/db-config.json');
let connection = mysql.createConnection(dbconfig);

const app = express();
const port = 3000;

let currentAdmin={};

app.use('/', express.static(__dirname + "/../public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/all-users', (req, res) => {
	connection.query(
		`select
			U.user_hashkey,
			U.user_birth,
			U.user_gender,
			UA.create_datetime,
			UA.account_hashkey,
			UA.login_platform,
			UA.user_id,
			UA.mapping_state,
			( select count(*)
				from EVENT_RECO as ER
				inner join EVENT as E
					on E.event_hashkey = ER.event_hashkey
				inner join CALENDAR as CD
					on CD.calendar_hashkey = E.calendar_hashkey
				where 
					CD.account_hashkey = C.account_hashkey
				) as reco_count
		from USER as U
		inner join USERACCOUNT as UA
			on U.user_hashkey = UA.user_hashkey
		inner join CALENDAR as C
			on UA.account_hashkey = C.account_hashkey
		where
			C.reco_state=1
			and UA.access_token != 'None'
		group by UA.account_hashkey
		order by UA.create_datetime ASC

		`, (err, rows) => {
		if(err) throw err;

		res.send(rows);
	});
});

// Display composed event with user hash key, calendar id and etc
app.get('/all-events', (req, res) => {
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
			and UA.account_hashkey = \'`+req.query.accountHashkey+`\'
			and E.start_dt > \'`+req.query.createDateTime+`\'
			order by E.start_dt ASC`, 
    (err, rows) =>{
		if(err) throw err;

		res.send(rows);
	});	
});

// get Main-Detail region
app.get('/all-region', (req, res) =>{
	connection.query(
		`select
			R.main_region,
			R.region
		from RECOMMENDATION as R
		where
			R.main_region != 'NULL'
			or R.main_region != 'None'
		group by R.main_region, R.region
		`, (err, rows)=>{
			if(err) throw err;

			res.send(rows);
		});
});

app.post('/admin-login', (req, res) => {
	connection.query('select admin_name from ADMINACCOUNT where admin_id=\''+req.body.admin_id+'\' and admin_pw=\''+req.body.admin_pw+'\'', (err, admins) => {
		if(err) throw err;
		
		if(admins.length>0)
			return res.send({loginresult:true,name:admins[0].admin_name});
		else
			return res.send({loginresult:false});
	});
});

// get Recommended data from reco-event table
app.get('/did-mapping-reco', (req, res)=>{
	connection.query(
		`select
			reco_hashkey
		from EVENT_RECO
		where event_hashkey = \'`+req.query.event_hashkey+`\'`,
		(err, rows) => {
			if(err) throw err;
			//console.log('========did-mapping-reco=========');
			//console.log('req.query.event_hashkey : '+req.query.event_hashkey);
			console.log(rows);
			res.send(rows);
		});
});


// get Recommend data with hashtag-set
app.get('/all-recommend', (req, res) => {
	connection.query(`
		SELECT RECO_HASHTAG.reco_hashkey, RECOMMENDATION.region, 
		RECOMMENDATION.category, RECOMMENDATION.title,
		RECOMMENDATION.img_url,RECOMMENDATION.price,
		RECOMMENDATION.map_url,RECOMMENDATION.deep_url,
		RECOMMENDATION.gender, RECOMMENDATION.reco_cnt,
		RECOMMENDATION.address, RECOMMENDATION.main_region,
		RECOMMENDATION.distance, RECOMMENDATION.register,
		GROUP_CONCAT(HASHTAG.tag_name  order by HASHTAG.tag_name asc SEPARATOR ', ') as tagNames 
		FROM RECO_HASHTAG
		LEFT JOIN HASHTAG on RECO_HASHTAG.hash_code = HASHTAG.code
		LEFT JOIN RECOMMENDATION on RECOMMENDATION.reco_hashkey = RECO_HASHTAG.reco_hashkey
		WHERE RECOMMENDATION.category != 'NULL'
		GROUP BY reco_hashkey`, (err, recoRows) =>{
		if(err) throw err;

		res.send(recoRows);
	});
});

app.get('/current-admin-list',(req,res)=>{
	res.send(currentAdmin);
});

app.post('/current-admin',(req,res)=>{
	/*console.log("====== Got it =====")
	console.log("Admin : "+req.body.admin);
	console.log("UHK : "+req.body.select_user);
	
	console.log(currentAdmin);
	console.log(Object.keys(currentAdmin).length);*/
	currentAdmin[req.body.admin]=req.body.select_user;
	//connection.query('')
})

// Convert 1 to 3 (Recommend complete each event)
app.post('/update-event-recostate', (req, res) => {
	connection.query('update EVENT set reco_state=3 where event_hashkey=\''+req.body.event_hashkey+'\'', (err, rows) => {
		if(err) throw err;
	});
});

// Convert 1 to 2 (EVENT's reco_state) and push to client
let keyconfig = require(__dirname+'/../server/config/key.json');
app.post('/complete-recommend', (req,res) => {
	console.log("API call, /admin-complete-recommend. req.body.event_hashkey_list : "+req.body.event_hashkey_list);
	let length = req.body.event_hashkey_list.length;
	if(length > 0){
		for(let i=0; i<length; i++){
			connection.query('update EVENT set reco_state=2 where event_hashkey=\''+req.body.event_hashkey_list[i]+'\'', (err, rows) => {
				if(err) throw err;

				console.log("Did set reco_state=2 event_hashkey : "+req.body.event_hashkey_list[i]);
			});
		}
	}
	
	connection.query('update CALENDAR set reco_state=2 where account_hashkey=\''+req.body.account_hashkey+'\'', (err,rows) => {
		if (err) throw err;
	});

	connection.query(
		`select 
			UD.push_token
		from USERDEVICE as UD
		inner join USERACCOUNT as UA
			on UD.account_hashkey = UA.account_hashkey
		where
			UA.account_hashkey = \'`+req.body.account_hashkey+'\''
		, (err, pushtokens) => {
			
			let pushtoken_length=pushtokens.length;
			for(let i=0; i<pushtoken_length; i++)
			{
				let pushtoken_data={
					'to':pushtokens[i].push_token,
					'data':{
						"type":"reco",
						"action":""
					}
				};

				request({
					method	: 'POST',
					uri 	: 'https://fcm.googleapis.com/fcm/send',
					headers	:
					{
						'Content-Type':'application/json',
						'Authorization':'key='+keyconfig.key
					},
					body 	: pushtoken_data,
					json 	: true
				}).then((data) => {
				}).catch((err) => {
					console.log(err);
					throw err;

					console.log("Complete push to device");
				})
			}
	});
});

app.post('/map-recommend', (req, res) => {
	console.log("API call, /admin-map-recommend. req.body.event_hashkey_list : "+req.body.reco_hashkey_list);
	if(req.body.update_flag === 1){
		connection.query('delete from EVENT_RECO where event_hashkey =\''+req.body.event_hashkey+'\'',(err,rows)=>{
			if(err) throw err;
		});
	}

	let length = req.body.reco_hashkey_list.length;
	for(let i=0; i<length ; i++)
	{
		connection.query('insert into EVENT_RECO (event_hashkey, reco_hashkey) values (\''+req.body.event_hashkey+'\', \''+req.body.reco_hashkey_list[i]+'\')', (err,rows) => {
			if(err) throw err;
		});
		connection.query('update RECOMMENDATION set reco_cnt = reco_cnt + 1 where reco_hashkey = \''+req.body.reco_hashkey_list[i]+'\'',(err,rows) => {
			if(err) throw err;
		});
	}
});

const server = app.listen(port, () => {
	console.log('Express listening on port', port);
});