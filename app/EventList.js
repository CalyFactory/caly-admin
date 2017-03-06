import React, { Component, PropTypes } from 'react';
import EventCard from './EventCard';
import update from 'react-addons-update';

class EventList extends Component {
	constructor(){
	    super(...arguments);
	    this.state = {
	    	eventcards:[],
	    	notrecommendevents:[]
	    }
	}

	// List up event to do no recommend
	addNotRecommendEventList(userId, calendarId, eventId){

		let addEvent = update(
		  // in Event list, Too difficult to filtering to eventId.
		  this.state.notrecommendevents,{ $push: [userId+":join:"+calendarId+":join:"+eventId] }
		);
		this.setState({notrecommendevents:addEvent});

	}

	// Except event to do recommend
	cancelNotRecommendEventList(userId, calendarId, eventId){
		let prevState = this.state;
		let userIndex = -1;
		let joinkey = userId+":join:"+calendarId+":join:"+eventId;
		let notRecommendEventLength = this.state.notrecommendevents.length;

		for(let i=0; i<notRecommendEventLength; i++)
		{
		  if(this.state.notrecommendevents[i] == joinkey)
		    userIndex=i;
		}
		if(userIndex == -1)
		  return;

		let delEvent = update(
		  this.state.notrecommendevents, {$splice: [[userIndex,1]] }
		);
		this.setState({notrecommendevents:delEvent});
	}

	render() {
		// Event List up
		let eventCards=this.props.eventcards.map((eventcard)=>{
  			return <EventCard 
	        	key={eventcard.event_id}
				userId={eventcard.user_hashkey}
				calendarId={eventcard.calendar_id}
				calendarName={eventcard.calendar_name}
				eventId={eventcard.event_id}
				eventName={eventcard.summary}
				eventStatus={eventcard.reco_state}
				startDateTime={eventcard.start_dt}
				endDateTime={eventcard.end_dt}
				location={eventcard.location}
				currentUser={this.props.currentUser}
				notrecommendevents={this.state.notrecommendevents}
				eventCallBacks={ this.props.eventCallBacks }
				notRecommendCallBacks={{
					addNotRecommendEventList: this.addNotRecommendEventList.bind(this),
        			cancelNotRecommendEventList: this.cancelNotRecommendEventList.bind(this)
				}}
				{...eventcard}
	          />
		});

		return (
			<div className="eventlist">
				<h1>{this.props.title}</h1>
				<input className="submitbuton" type="button" value="비추천 이벤트 지정" 
				onClick={this.props.recommendCallBacks.commitNotRecommend.bind(this, this.state.notrecommendevents)} />
				{eventCards}
			</div>
		);
	}
};
EventList.propTypes = {
	title: PropTypes.string.isRequired,
	eventcards: PropTypes.arrayOf(PropTypes.object),
	currentUser: PropTypes.object,
	eventCallBacks: PropTypes.object,
	recommendCallBacks: PropTypes.object
};

export default EventList;