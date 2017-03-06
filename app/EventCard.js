import React, { Component, PropTypes } from 'react';

class EventCard extends Component {
	constructor() {
		super(...arguments);
		this.state = {
			isClicked: false,
			isRecommend: true
		};
	}

	clickEvent() {
		this.setState({isClicked: !this.state.isClicked});
		this.props.eventCallBacks.selectEvent(this.props.currentUser.user_hashkey, this.props.eventHashKey);
	}

	notRecommend(){
		this.setState({isRecommend: !this.state.isRecommend});
		
		// for setState's post apply. origin !this.state.isRecommend
		this.state.isRecommend?
		this.props.notRecommendCallBacks.addNotRecommendEventList(this.props.eventHashKey)
		:this.props.notRecommendCallBacks.cancelNotRecommendEventList(this.props.eventHashKey);
	}

	render() {
		let location;
		if(!(this.props.location === 'noLocation'))
		{
			return (
				<li>장소 : {this.props.location }</li>
			)
		}

		return (
			<div className="eventcard">
				<a href="#" className="EventCardClick" onClick={this.clickEvent.bind(this)}>
					Click
				</a>
				<ul>
					<li>캘린더명 : { this.props.calendarName }</li>
					<li>시작 일시 : { this.props.startDateTime }</li>
					<li>종료 일시 : { this.props.endDateTime } </li>
					<li>이벤트명 : {this.props.eventName }</li>
					{location}
					<li>추천 X : <input type="checkbox" onClick={this.notRecommend.bind(this)} /></li>
				</ul>
			</div>
		)
	}
}
EventCard.propTypes = {
	userId:PropTypes.string.isRequired,
	eventHashKey:PropTypes.string.isRequired,
	calendarId:PropTypes.string.isRequired,
	calendarName:PropTypes.string,
	eventId:PropTypes.string.isRequired,
	startDateTime:PropTypes.string.isRequired,
	endDateTime:PropTypes.string.isRequired,
	eventName:PropTypes.string.isRequired,
	eventStatus:PropTypes.number,
	location:PropTypes.string,
	eventCallBacks: PropTypes.object,
	currentUser:PropTypes.obejct,
	notRecommendCallBacks:PropTypes.object
};

export default EventCard;