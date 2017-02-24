import React, { Component, PropTypes } from 'react';
import EventCard from './EventCard';

class EventList extends Component {
	render() {
		let eventCards = this.props.usercards.map((usercard) => {
			return this.props.eventcards.map((eventcard) => {
				return <EventCard
						userId={usercard.id}
						eventId={eventcard.eventid}
						{...eventcard} />
			});
		});
		/*
		let eventCards = this.props.eventcards.map((eventcard) => {
			return <EventCard
					eventId={eventcard.eventid}
					{...eventcard} />
		});*/

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
	usercards: PropTypes.arrayOf(PropTypes.object).isRequired,
	eventcards: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default EventList;