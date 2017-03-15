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
		this.props.eventCallBacks.updateEventList(this.props.userHashkey);
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
		let eventDTT=this.props.createDateTime;
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

		let diffDay,diffHour,diffMinute;
		if(diffBetweenMinutes > (24 * 60)){
			diffDay = Math.floor(diffBetweenMinutes/(24*60))+"일 ";
			diffBetweenMinutes = Math.floor(diffBetweenMinutes % (24*60));
		}
		if(diffBetweenMinutes > 60){
			diffHour = Math.floor(diffBetweenMinutes/60)+"시간 ";
			diffBetweenMinutes = Math.floor(diffBetweenMinutes % 60);
		}
		diffMinute = diffBetweenMinutes+"분 ";
		let diff=diffDay+diffHour+diffMinute;
		return (
			<div className={
				this.props.userHashkey == this.props.currentUser.user_hashkey ? "usercard__click" : "usercard"
			}>
				<a href="#" className="UserCardClick" onClick={
					this.clickDetails.bind(this)
					}>
					click
				</a>
				<ul>
					<li>성별 : { gender }</li>
					<li>나이 : { this.props.age }</li>
					<li>대기시간 : {diff}</li>
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