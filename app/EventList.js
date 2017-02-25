import React, { Component, PropTypes } from 'react';
import EventCard from './EventCard';

class EventList extends Component {
	render() {
		let eventCards = this.props.eventcards;
		return (
			<div className="eventlist">
				<h1>{this.props.title}</h1>
				{eventCards}
			</div>
		);
	}
};
EventList.propTypes = {
	title: PropTypes.string.isRequired,
	eventcards: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default EventList;