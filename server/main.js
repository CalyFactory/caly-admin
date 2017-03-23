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

app.use('/', express.static(__dirname + "/../public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/admin-users', (req, res) => {
	connection.query(
		`select
			U.user_hashkey,
			U.user_birth,
			U.user_gender,
			UA.create_datetime,
			UA.account_hashkey,
			UA.login_platform,
			UA.user_id
		from USER as U
		inner join USERACCOUNT as UA
			on U.user_hashkey = UA.user_hashkey
		inner join CALENDAR as C
			on UA.account_hashkey = C.account_hashkey
		where
			C.reco_state=1
		group by UA.account_hashkey
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
			and U.user_hashkey = \'`+req.query.userHashkey+`\'
			and E.start_dt > \'`+req.query.createDateTime+'\'', 
    (err, rows) =>{
		if(err) throw err;

		res.send(rows);
	});	
});
/*
app.get('/', (req, res) =>{
	res.sendFile(path.join(__dirname + "/../public/login.html"));
});*/

// get Main-Detail region
app.get('/admin-region', (req, res) =>{
	connection.query(
		`select
			R.main_region,
			R.region
		from RECOMMENDATION as R
		where
			R.main_region != 'NULL'
			or R.main_region != 'None'
		group by R.main_region, R.region;
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

app.get('/admin-recommend', (req, res) => {
	function getHashTag(recommendRows){
		let length = recommendRows.length;
		for(let i=0; i<length ; i++){
			connection.query(
				`select
					RH.hash_code,
					HT.tag_name
				from RECO_HASHTAG as RH
				inner join HASHTAG as HT
					on HT.code = RH.hash_code
				where
					RH.reco_hashkey=\'`+recommendRows[i].reco_hashkey+'\'',(err, tagRows) => {
						recommendRows[i].reco_hashtag=JSON.parse(JSON.stringify (tagRows));
						//console.log('tagRows is '+tagRows);
						//console.log('reco_hashtag['+i+'] is '+recommendRows[i].reco_hashtag);
						//console.log('what is '+recoRows[i].reco_hashkey);
					});
		}
		console.log('out of for loop, reco_hashtag[0] is '+recommendRows[0].reco_hashtag);
		return recommendRows;
	}
	/*
	let newPromise = (recommendRows) => {
		return new Promise((resolve) => {
			Promise.all(resolve(getHashTag(recommendRows)));
		});
	};*/

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
		/*
		newPromise(recoRows)
		.then((recocoRows)=>{
			res.send(recocoRows);
			console.log('recocoRows[0] is '+recocoRows[0]);
		}).catch(console.log.bind(console));
		/*getHashTag(recoRows)
		.then(()=>{
			res.send(recoRows);
		});*/
		//setTimeout(()=>{console.log("setTimeout!")},1000);
		//console.log('recoRows[0].reco_hashtag is '+recoRows[0].reco_hashtag);
		
	});
});

// Convert 1 to 3 (Recommend complete each event)
app.post('/admin-update-event-recostate', (req, res) => {
	connection.query('update EVENT set reco_state=3 where event_hashkey=\''+req.body.event_hashkey+'\'', (err, rows) => {
		if(err) throw err;
	});
});

// Convert 1 to 2 (EVENT's reco_state) and push to client
let keyconfig = require(__dirname+'/../server/config/key.json');
app.post('/admin-complete-recommend', (req,res) => {
	let length = req.body.event_hashkey_list.length;
	if(length > 0){
		for(let i=0; i<length; i++){
			connection.query('update EVENT set reco_state=3 where event_hashkey=\''+req.body.event_hashkey_list[i]+'\'', (err, rows) => {
				if(err) throw err;
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
			UA.user_hashkey = \'`+req.body.user_hashkey+'\''
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
				})
			}
	});
});

app.post('/admin-map-recommend', (req, res) => {
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