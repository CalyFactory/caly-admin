import React, { Component, PropTypes } from 'react';
import EventCard from './EventCard';
import update from 'react-addons-update';
import AlertContainer from 'react-alert';

class EventList extends Component {
	constructor(){
		super(...arguments);
		this.alertOptions = {
			offset: 14,
			position: 'top right',
			theme: 'dark',
			time: 5000,
			transition: 'scale'
		};
	}

	completeRecommend(){
		let currentUser=this.props.currentUser.login_platform+"/"+this.props.currentUser.user_id;
		let notRecommendEvents=[];
		//let notRecommendEventCards=this.props.eventcards.filter((eventcard)=>eventcard.status === 1);
		this.props.eventcards.map((eventCard)=>{
			notRecommendEvents.push(eventCard.event_hashkey);
		});
		console.log(notRecommendEvents);
		this.props.recommendCallBacks.completeRecommend(notRecommendEvents);
		msg.removeAll();
		msg.show(`추천 종료.
			User : `+currentUser+`,
			추천 이벤트 수 : `+this.props.currentCommitRecommendCount+`,
			비추천 이벤트 수 : `+notRecommendEvents.length
			, {
			time: 2000,
			type: 'success'
		});
	}

	render() {
		// Event List up
		let eventCards=this.props.eventcards.map((eventcard)=>{
			let stdt = eventcard.start_dt.split('T');
			let std = stdt[0].split('-');
			let sttt = stdt[1].split('.');
			let stt = sttt[0].split(':');
			let cstdt = std[0].substring(2,4)+std[1]+std[2]+' '+stt[0]+':'+stt[1];
			
			let etdt = eventcard.end_dt.split('T');
			let etd = etdt[0].split('-');
			let ettt = etdt[1].split('.');
			let ett = ettt[0].split(':');
			let cetdt = etd[0].substring(2,4)+etd[1]+etd[2]+' '+ett[0]+':'+ett[1];
			
  			return <EventCard 
	        	key={eventcard.event_id}
				userId={eventcard.user_hashkey}
				eventHashKey={eventcard.event_hashkey}
				calendarId={eventcard.calendar_id}
				calendarName={eventcard.calendar_name}
				eventId={eventcard.event_id}
				eventName={eventcard.summary}
				eventStatus={eventcard.reco_state}
				startDateTime={cstdt}
				endDateTime={cetdt}
				location={eventcard.location}
				currentUser={this.props.currentUser}
				currentEvent={ this.props.currentEvent }
				notrecommendevents={this.props.notrecommendevents}
				eventCallBacks={ this.props.eventCallBacks }
				{...eventcard}
	          />
		});

		let eventlistPanel;
		if(this.props.currentUser.user_hashkey)
		{
			eventlistPanel=(
				<div>
					<AlertContainer ref={ (a) => global.msg = a} {...this.alertOptions} />
					<input className="submitbuton" type="button" value="추천 종료" 
				onClick={this.completeRecommend.bind(this)} />
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
	currentEvent: PropTypes.object,
	eventCallBacks: PropTypes.object,
	recommendCallBacks: PropTypes.object,
	currentCommitRecommendCount: PropTypes.number
};

export default EventList;