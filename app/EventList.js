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
			if(eventCard.reco_state === 1){
				notRecommendEvents.push(eventCard.event_hashkey);
			}
		});
		//console.log(notRecommendEvents);
		
		if(confirm(`추천을 종료할까요?
			===================
			User : `+currentUser+`,
			추천 이벤트 수 : `+this.props.currentCommitRecommendCount+`,
			비추천 이벤트 수 : `+notRecommendEvents.length))
		{
			this.props.recommendCallBacks.completeRecommend(notRecommendEvents);
		}
	}

	render() {
		// Event List up
		let eventCards=this.props.eventcards.map((eventcard)=>{
			if(eventcard.reco_state === 1){
				//.filter((card) => card.reco_state === 1) 
				let startDate = new Date(eventcard.start_dt);
				let endDate = new Date(eventcard.end_dt);

				/*
				let stdt = eventcard.start_dt.split('T');
				let std = stdt[0].split('-');
				let sttt = stdt[1].split('.');
				let stt = sttt[0].split(':');*/
				//let cstdt = std[0].substring(2,4)+std[1]+std[2]+' '+stt[0]+':'+stt[1];
				let startDateMonth=startDate.getMonth()+1;
				if((startDate.getMonth()+1) < 10)
					startDateMonth="0"+startDateMonth;
				let startDateDate=startDate.getDate();
				if(startDate.getDate() <10)
					startDateDate="0"+startDateDate;
				let startDateHour=startDate.getHours();
				if(startDate.getHours() < 10)
					startDateHour="0"+startDateHour;
				let startDateMinutes=startDate.getMinutes();
				if(startDate.getMinutes() < 10)
					startDateMinutes="0"+startDateMinutes;

				let cstdt = startDate.getFullYear().toString().substring(2,4)+startDateMonth+startDateDate+' '+startDateHour+':'+startDateMinutes;
				
				/*
				let etdt = eventcard.end_dt.split('T');
				let etd = etdt[0].split('-');
				let ettt = etdt[1].split('.');
				let ett = ettt[0].split(':');*/
				//let cetdt = etd[0].substring(2,4)+etd[1]+etd[2]+' '+ett[0]+':'+ett[1];
				let endDateMonth=endDate.getMonth()+1;
				if((endDate.getMonth()+1) < 10)
					endDateMonth="0"+endDateMonth;
				let endDateDate=endDate.getDate();
				if(endDate.getDate() <10)
					endDateDate="0"+endDateDate;
				let endDateHour=endDate.getHours();
				if(endDate.getHours() < 10)
					endDateHour="0"+endDateHour;
				let endDateMinutes=endDate.getMinutes();
				if(endDate.getMinutes() < 10)
					endDateMinutes="0"+endDateMinutes;

				let cetdt = endDate.getFullYear().toString().substring(2,4)+endDateMonth+endDateDate+' '+endDateHour+':'+endDateMinutes;
				//console.log("Start Date Time : "+cstdt+", End Date Time : "+cetdt);
	  			return <EventCard 
		        	key={eventcard.event_id}
					userId={eventcard.account_hashkey}
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
					currentMappingCount= { this.props.currentMappingCount }
					regionSet={this.props.regionSet}
					{...eventcard}
		          />
          	}
		});

		let eventlistPanel;
		if(this.props.currentUser.account_hashkey)
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
				<h1>{this.props.title}{' '}{this.props.eventcards.filter((card)=>((card.reco_state === 1) && (card.account_hashkey === this.props.currentUser.account_hashkey.toString()))).length}</h1>
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
	currentMappingCount: PropTypes.number,
	currentCommitRecommendCount: PropTypes.number,
	regionSet: PropTypes.arrayOf(PropTypes.object)
};

export default EventList;