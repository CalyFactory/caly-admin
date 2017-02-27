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
		this.props.eventCallBacks.selectEvent(this.props.currentUser.userId, this.props.eventId);
	}

	notRecommend(){
		this.setState({isRecommend: !this.state.isRecommend});
		
		// for setState's post apply. origin !this.state.isRecommend
		this.state.isRecommend?
		this.props.eventCallBacks.addNotRecommendEventList(this.props.userId, this.props.eventId)
		:this.props.eventCallBacks.cancelNotRecommendEventList(this.props.userId, this.props.eventId);
	}

	render() {
    	if (this.props.userId == this.props.currentUser.userId && this.props.eventStatus === 0)
    	{
			return (
				<div className="eventcard">
					<a href="#" className="EventCardClick" onClick={this.clickEvent.bind(this)}>
						Click
					</a>
					<ul>
						<li>시작 일시 : { this.props.startDateTime }</li>
						<li>종료 일시 : { this.props.endDateTime } </li>
						<li>이벤트명 : {this.props.eventName }</li>
						<li>장소 : {this.props.location }</li>
						<li>추천 X : <input type="checkbox" onClick={this.notRecommend.bind(this)} /></li>
					</ul>
				</div>
			)
		}
    	return (<div />)
	}
}
EventCard.propTypes = {
	userId:PropTypes.string.isRequired,
	eventId:PropTypes.string.isRequired,
	startDateTime:PropTypes.string.isRequired,
	endDateTime:PropTypes.string.isRequired,
	eventName:PropTypes.string.isRequired,
	eventStatus:PropTypes.number,
	location:PropTypes.string,
	eventCallBacks: PropTypes.object,
	currentUser:PropTypes.obejct,
	notrecommendevents:PropTypes.arrayOf(PropTypes.object)
};

export default EventCard;