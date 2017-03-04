import React, { Component, PropTypes } from 'react';
import EventCard from './EventCard';
import update from 'react-addons-update';

class EventList extends Component {
	constructor(){
	    super(...arguments);
	    this.state = {
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
		let eventCards=this.props.usercards.map((usercard)=>{
	      // Get EventRoot & Direct Mapping to EventCard
			return usercard.calendars.map((calendarcard)=>{
				return calendarcard.events.map((eventcard)=>{
					return <EventCard 
			        	key={usercard.userId+":join:"+calendarcard.calendarId+":join:"+eventcard.eventId}
						userId={usercard.userId}
						calendarId={calendarcard.calendarId}
						eventId={eventcard.eventId}
						eventStatus={eventcard.status}
						currentUser={this.props.currentUser}
						notrecommendevents={this.state.notrecommendevents}
						eventCallBacks={ this.props.eventCallBacks }
						notRecommendCallBacks={{
							addNotRecommendEventList: this.addNotRecommendEventList.bind(this),
		        			cancelNotRecommendEventList: this.cancelNotRecommendEventList.bind(this)
						}}
						{...eventcard}
			          />
				})
	      });
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
	usercards: PropTypes.arrayOf(PropTypes.object).isRequired,
	currentUser: PropTypes.object,
	eventCallBacks: PropTypes.object,
	recommendCallBacks: PropTypes.object
};

export default EventList;