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
		let backgroundColor = this.state.isClicked? "#111" : "#fff";
		let sideColor = {
			position: 'absolute',
			zIndex: -1,
			top: 0,
			bottom: 0,
			left: 0,
			width: 7,
			backgroundColor: {backgroundColor}
	    };
	    let eventCard = (
	    	/*if(this.props.userId === this.props.selectedUserId)
	    	{
				return */
				<ul>
					<li>시작 일시 : { this.props.startDateTime }</li>
					<li>종료 일시 : { this.props.endDateTime } </li>
					<li>이벤트명 : {this.props.eventName }</li>
					<li>장소 : {this.props.location }</li>
				</ul>
			//}
    	);
		return (
			<div className="eventcard">
				<div style={sideColor} />
				<a href="#" className="EventCardClick" onClick={this.clickDetails.bind(this)}>
					Click
					</a>
				{eventCard}
			</div>
		)
	}
}
EventCard.propTypes = {
	userId:PropTypes.string.isRequired,
	eventId:PropTypes.string.isRequired,
	startDateTime:PropTypes.string.isRequired,
	endDateTime:PropTypes.string.isRequired,
	eventName:PropTypes.string.isRequired,
	location:PropTypes.string
};

export default EventCard;