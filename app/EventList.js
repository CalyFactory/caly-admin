import React, { Component, PropTypes } from 'react';
import EventCard from './EventCard';
import update from 'react-addons-update';

class EventList extends Component {

	render() {
		// Event List up
		let eventCards=this.props.eventcards.map((eventcard)=>{
  			return <EventCard 
	        	key={eventcard.event_id}
				userId={eventcard.user_hashkey}
				eventHashKey={eventcard.event_hashkey}
				calendarId={eventcard.calendar_id}
				calendarName={eventcard.calendar_name}
				eventId={eventcard.event_id}
				eventName={eventcard.summary}
				eventStatus={eventcard.reco_state}
				startDateTime={eventcard.start_dt}
				endDateTime={eventcard.end_dt}
				location={eventcard.location}
				currentUser={this.props.currentUser}
				currentEvent={ this.props.currentEvent }
				notrecommendevents={this.props.notrecommendevents}
				eventCallBacks={ this.props.eventCallBacks }
				notRecommendCallBacks={this.props.notRecommendCallBacks}
				{...eventcard}
	          />
		});

		let eventlistPanel;
		if(this.props.currentUser.user_hashkey)
		{
			eventlistPanel=(
				<div>
					<input className="submitbuton" type="button" value="추천 종료" 
				onClick={this.props.recommendCallBacks.commitNotRecommend.bind(this, this.props.notrecommendevents)} />
				{eventCards}
				</div>
			)
		}
		return (
			<div className="eventlist">
				<h1>{this.props.title}{' '}{this.props.eventcards.length}</h1>
				{eventlistPanel}
			</div>
		);
	}
};
EventList.propTypes = {
	title: PropTypes.string.isRequired,
	eventcards: PropTypes.arrayOf(PropTypes.object),
	notrecommendevents: PropTypes.arrayOf(PropTypes.string),
	currentUser: PropTypes.object,
	currentEvent: PropTypes.string,
	eventCallBacks: PropTypes.object,
	recommendCallBacks: PropTypes.object,
	notRecommendCallBacks: PropTypes.object
};

export default EventList;