import React, { Component, PropTypes } from 'react';

class UserCard extends Component {
	constructor() {
		super(...arguments);
		this.state = {
			isClicked: false
		};
	}

	clickDetails() {
		// Set background Color. Consider about another UserCard
		//this.setState({isClicked: !this.state.isClicked});
		this.props.eventCallBacks.updateEventList(this.props.userHashkey,this.props.createDateTime);
		this.props.eventCallBacks.reloadRecommendList();
	}


	render() {
		let gender="무관";
		if(this.props.gender == 1)
			gender="남";
		else if(this.props.gender == 2)
			gender="여";
		else;
		let date = new Date();
		/*let day = date.getDate();
		let month = date.getMonth();
		let year = date.getFullYear();
		let hour = date.getHours();
		let minute = date.getMinutes();
		let second = date.getSeconds();*/

		// create_datetime convert to 17XXXX XX:XX
		let createDateTimeDB = this.props.createDateTime;
		let cdt = createDateTimeDB.split('T');
		let ctd = cdt[0].split('-');
		let cttt = cdt[1].split('.');
		let ctt = cttt[0].split(':');
		
		let eventDTT= ctd[0]+','+ctd[1]+','+ctd[2]+','+ctt;
		let eventDT = eventDTT.split(',');
		let eventDate=new Date(parseInt(eventDT[0]),parseInt(eventDT[1])-1,parseInt(eventDT[2]),parseInt(eventDT[3]),parseInt(eventDT[4]),parseInt(eventDT[5]),0);
		/*let eventday = eventDate.getDate();
		let eventmonth = eventDate.getMonth();
		let eventyear = eventDate.getFullYear();
		let eventhour = eventDate.getHours();
		let eventminute = eventDate.getMinutes();
		let eventsecond = eventDate.getSeconds();*/
		
		let diffBetweenTimes = (date.getTime() - eventDate.getTime()) / 1000 / 60;
		let diffBetweenMinutes = Math.abs(Math.round(diffBetweenTimes));

		let diffDay='',diffHour='',diffMinute='';
		if(diffBetweenMinutes > (24 * 60)){
			diffDay = Math.floor(diffBetweenMinutes/(24*60))+"일 ";
			diffBetweenMinutes = Math.floor(diffBetweenMinutes % (24*60));
		}
		if(diffBetweenMinutes > 60){
			let diffMin=Math.floor(diffBetweenMinutes/60-9);
			diffHour = diffMin>0 ? diffMin+"시간 " : "";
			diffBetweenMinutes = Math.floor((diffBetweenMinutes-540) % 60);
		}
		diffMinute = diffBetweenMinutes+"분 ";
		let diff=diffDay+diffHour+diffMinute;
		return (
			<div className={
				this.props.userHashkey == this.props.currentUser.user_hashkey ? "usercard__click" : "usercard"
			} onClick={
					this.clickDetails.bind(this)
					} >
				
				<ul>
					<li>성별 : { gender }</li>
					<li>나이 : { this.props.age }</li>
					<li>최초 동기화 시간 : {diff}</li>
					{
					//<li>이벤트 날짜 : {eventyear+'-'+eventmonth+'-'+eventday+' '+eventhour+':'+eventminute+':'+eventsecond}</li>
					//<li>오늘 날짜 : {year+'-'+month+'-'+day+' '+hour+':'+minute+':'+second}</li>
					}
				</ul>
			</div>
		)
	}
}
UserCard.propTypes = {
	userHashkey:PropTypes.string.isRequired,
	gender:PropTypes.number.isRequired,
	age:PropTypes.number.isRequired,
	createDateTime:PropTypes.string,
	eventCallBacks:PropTypes.object,
	currentUser: PropTypes.object
};

export default UserCard;