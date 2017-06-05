import express from 'express';
import bodyParser from 'body-parser';
import mysql from 'mysql';
import path from 'path';
import 'whatwg-fetch';
import request from 'request-promise';
import async from 'async';

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
			
			//console.log(rows);
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
	currentAdmin[req.body.admin]=req.body.select_user;
});

// Convert 1 to 2 (EVENT's reco_state) and push to client
let keyconfig = require(__dirname+'/../server/config/key.json');
app.post('/complete-recommend', (req,res) => {
	let length = req.body.event_hashkey_list.length;

	async.parallel([
		function(callback){
			if(length > 0){
				for(let i=0; i<length; i++){
					// Did set reco_state=2 event_hashkey
					connection.query('update EVENT set reco_state=2 where event_hashkey=\''+req.body.event_hashkey_list[i]+'\'', (err, rows) => {
						if(err) throw err;

					});

					// Did set REACT_TIME & REGISTER
					connection.query(`insert into EVENT_RECO (event_hashkey, reco_hashkey, register, react_times)
						values (\'`+req.body.event_hashkey_list[i]+'\', -1,\''+req.body.register+'\', '+req.body.react_times+')',(err,rows)=>{
							if(err) throw err;
						});
				}
			}
			callback();
		},
		function(callback){
			if(req.body.update_flag === 0){
				connection.query(`select
						UA.account_hashkey,
						UA.mapping_state
					from USER as U
					inner join USERACCOUNT as UA
						on U.user_hashkey = UA.user_hashkey
					where
						UA.user_hashkey=\'`+req.body.user_hashkey+'\''
				, (err,rows)=>{
					let isFirst = true;

					for(let i=0; i<rows.length; i++){
						if(rows[i].mapping_state === 2)
							isFirst=false;
					}
					if(isFirst){
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
										console.log("Complete push to device");
									}).catch((err) => {
										console.log(err);
										throw err;
									})
								}
							});
						} // end if(isFirst)
				});
			}
			callback();
	}], function(err,res){
		connection.query('update CALENDAR set reco_state=2 where account_hashkey=\''+req.body.account_hashkey+'\'', (err,rows) => {
			if (err) throw err;
		});

		connection.query('update USERACCOUNT set mapping_state=2 where account_hashkey=\''+req.body.account_hashkey+'\'', (err,rows) => {
			if (err) throw err;
		});
	});

});

app.post('/commit-recommend', async (req, res, next) => {
	/*
	let reco_hash_list_length = req.body.reco_hashkey_list.length;

	if(req.body.update_flag === 1){
		// Modify recommend case
		console.log('Modify recommend case');

		let existRecommendHashkeyList=[];
		
		// Check exist recommendation
		connection.query('select reco_hashkey from EVENT_RECO where event_hashkey = \''+req.body.event_hashkey+'\'',(selErr,selRows)=>{
			console.log('in : in select EVENT_RECO');
			if(selErr){
				console.log('err : in select EVENT_RECO');
				throw selErr;
			}

			let selRowsLength = selRows.length; 
			if(selRowsLength > 0){
				for(let i=0; i<selRowsLength; i++){
					existRecommendHashkeyList.push(selRows[i].reco_hashkey);
				}
				console.log('existRecommendHashkeyList');
				console.log(existRecommendHashkeyList);
				console.log('');
				// Delete all recommendation for keeping sequence. ( EVENT_RECO table index is number )
				connection.query('delete from EVENT_RECO where event_hashkey =\''+req.body.event_hashkey+'\'',(delErr,delRows)=>{
					console.log('in : in delete EVENT_RECO');
					if(delErr){
						console.log('err : in delete EVENT_RECO');
						throw delErr;
					}

					for(let i=0; i<reco_hash_list_length ; i++)
					{
						console.log("No."+i);
						connection.query('insert into EVENT_RECO (event_hashkey, reco_hashkey, register, react_times) values (\''+req.body.event_hashkey+'\', \''+req.body.reco_hashkey_list[i]+'\', \''+req.body.register+'\','+req.body.react_times+')', (instErr,instRows) => {
							console.log('in : in insert into EVENT_RECO');
							if(instErr){
								console.log('err : in insert into EVENT_RECO');
								throw instErr;
							} 
						});

						// if it doesn't exist Recommendation case, count up reco_cnt
						console.log("Existance's indexOf function result : "+existRecommendHashkeyList.indexOf(req.body.reco_hashkey_list[i]));
						if(existRecommendHashkeyList.indexOf(req.body.recohashkey_list[i])<0){
							console.log("hello, there? it's working?");
							connection.query('update RECOMMENDATION set reco_cnt = reco_cnt + 1 where reco_hashkey = \''+req.body.reco_hashkey_list[i]+'\'',(updtErr,updtRows) => {
								console.log('in : in update RECOMMENDATION');
								if(updtErr){
									console.log('err : in update RECOMMENDATION');
									throw updtErr;
								}
							});
						}
						console.log("Complete indexOf condition");
					}
				});
			}
		});

	}
	else
	{
		console.log("new recommend case");
		// new recommend case
		for(let i=0; i<reco_hash_list_length ; i++)
		{
			connection.query('insert into EVENT_RECO (event_hashkey, reco_hashkey, register, react_times) values (\''+req.body.event_hashkey+'\', \''+req.body.reco_hashkey_list[i]+'\', \''+req.body.register+'\','+req.body.react_times+')', (err,rows) => {
				if(err) throw err;
			});
			connection.query('update RECOMMENDATION set reco_cnt = reco_cnt + 1 where reco_hashkey = \''+req.body.reco_hashkey_list[i]+'\'',(err,rows) => {
				if(err) throw err;
			});
		}
	}

	// Convert 1 to 3 (Recommend complete each event)
	connection.query('update EVENT set reco_state=3 where event_hashkey=\''+req.body.event_hashkey+'\'', (err, rows) => {
		if(err) throw err;
	});*/
	let existRecommendHashkeyList=[];
	if(req.body.update_flag === 1){
		await connection.query('select reco_hashkey from EVENT_RECO where event_hashkey = \''+req.body.event_hashkey+'\'', (err,rows)=>{
			if(err) throw err;

			let rowsLength = rows.length;
			for(let i=0; i<rowsLength ;i++)
			{
				existRecommendHashkeyList.push(rows[i].reco_hashkey);	
			}
		});

		await connection.query('delete from EVENT_RECO where event_hashkey =\''+req.body.event_hashkey+'\'',(err,rows)=>{
			if(err) throw err;
		});
	}

	let length = req.body.reco_hashkey_list.length;
	for(let i=0; i<length ; i++)
	{
		connection.query('insert into EVENT_RECO (event_hashkey, reco_hashkey, register, react_times) values (\''+req.body.event_hashkey+'\', \''+req.body.reco_hashkey_list[i]+'\', \''+req.body.register+'\','+req.body.react_times+')', (err,rows) => {
			if(err) throw err;
		});
		
		if(existRecommendHashkeyList.indexOf(req.body.reco_hashkey_list[i]) < 0){
			connection.query('update RECOMMENDATION set reco_cnt = reco_cnt + 1 where reco_hashkey = \''+req.body.reco_hashkey_list[i]+'\'',(err,rows) => {
				if(err) throw err;
			});
		}
		
	}

	// Convert 1 to 3 (Recommend complete each event)
	connection.query('update EVENT set reco_state=3 where event_hashkey=\''+req.body.event_hashkey+'\'', (err, rows) => {
		if(err) throw err;
	});
});

const server = app.listen(port, () => {
	console.log('Express listening on port', port);
});