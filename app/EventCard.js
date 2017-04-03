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
		this.props.eventCallBacks.selectEvent(this.props.eventHashKey);
	}

	render() {
		let location;
		if(this.props.location === 'noLocation'){
			location= "장소 없음";
		}
		else{
			location= this.props.location;
		}

		return (
			<div className={
					this.props.eventHashKey == this.props.currentEvent.event_hashkey
					? "eventcard__click" : "eventcard"
				} onClick={this.clickEvent.bind(this)}>
				<ul>
					<li>캘린더 : { this.props.calendarName }</li>
					<li>시작 : { this.props.startDateTime }</li>
					<li>종료 : { this.props.endDateTime } </li>
					<li>이벤트 : {this.props.eventName }</li>
					<li>장소 : {location}</li>
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
	currentEvent:PropTypes.object
};

export default EventCard;