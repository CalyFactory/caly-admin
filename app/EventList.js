import React, { Component, PropTypes } from 'react';
import EventCard from './EventCard';

class EventList extends Component {
	submitUnrecommendEvents(){
		this.props.eventCallBacks.declareNotRecommendEvent();
	}

	render() {
		let eventCards=this.props.usercards.map((usercard)=>{
	      // Get EventRoot & Direct Mapping to EventCard
	      return usercard.events.eventInfo.map((eventcard)=>{
	        return <EventCard 
	          userId={usercard.userId}
	          eventId={eventcard.eventId}
	          eventStatus={eventcard.status}
	          currentUser={this.props.currentUser}
	          notrecommendevents={this.props.notrecommendevents}
	          eventCallBacks={ this.props.eventCallBacks }
	          {...eventcard}
	          />
	      });
	    });
		return (
			<div className="eventlist">
				<h1>{this.props.title}</h1>
				<input className="submitbuton" type="button" value="비추천 이벤트 지정" onClick={this.submitUnrecommendEvents.bind(this)} />
				{eventCards}
			</div>
		);
	}
};
EventList.propTypes = {
	title: PropTypes.string.isRequired,
	usercards: PropTypes.arrayOf(PropTypes.object).isRequired,
	currentUser: PropTypes.object,
	notrecommendevents: PropTypes.arrayOf(PropTypes.object),
	eventCallBacks: PropTypes.object
};

export default EventList;