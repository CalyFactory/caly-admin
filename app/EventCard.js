import React, { Component, PropTypes } from 'react';

class EventCard extends Component {
	constructor() {
		super(...arguments);
		this.state = {
			isClicked: false
		};
	}

	clickDetails() {
		this.setState({isClicked: !this.state.isClicked});
	}

	unclicked(){
		this.setState({isClicked: false});
	}

	render() {
    	if (this.props.userId == this.props.curruentUser)
    	{
			return (
				<div className="eventcard">
					<a href="#" className="EventCardClick" onClick={this.clickDetails.bind(this)}>
						Click
					</a>
					<ul>
						<li>시작 일시 : { this.props.startDateTime }</li>
						<li>종료 일시 : { this.props.endDateTime } </li>
						<li>이벤트명 : {this.props.eventName }</li>
						<li>장소 : {this.props.location }</li>
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
	location:PropTypes.string,
	eventCallBacks: PropTypes.object,
	curruentUser:PropTypes.string
};

export default EventCard;