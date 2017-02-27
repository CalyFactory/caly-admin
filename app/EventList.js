import React, { Component, PropTypes } from 'react';
import EventCard from './EventCard';

class EventList extends Component {
	submitUnrecommendEvents(){
		this.props.eventCallBacks.declareNotRecommendEvent();
	}

	render() {
		let eventCards = this.props.eventcards;
		return (
			<div className="eventlist">
				<h1>{this.props.title}</h1>
				<input className="submitbuton" type="button" value="추천 이벤트 저장" onClick={this.submitUnrecommendEvents.bind(this)} />
				{eventCards}
			</div>
		);
	}
};
EventList.propTypes = {
	title: PropTypes.string.isRequired,
	eventcards: PropTypes.arrayOf(PropTypes.object).isRequired,
	eventCallBacks: PropTypes.object
};

export default EventList;