import React, { Component, PropTypes } from 'react';
import EventCard from './EventCard';
import UserCard from './UserCard';

class EventList extends Component {
	render() {
		let eventCards = this.props.eventcards.map((eventcard) => {
			return <EventCard
							userId={this.props.usercard.id}
							eventId={eventcard.eventid}
							{...eventcard} />
		});

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
	usercard: PropTypes.object.isRequired,
	eventcards: PropTypes.arrayOf(PropTypes.object)
};

export default EventList;