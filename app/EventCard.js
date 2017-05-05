import React, { Component, PropTypes } from 'react';

class EventCard extends Component {
	constructor() {
		super(...arguments);
		this.state = {
			isClicked: false,
			isRecommend: true
		};
	}

	clickEvent() {
		if(this.props.currentMappingCount>0){
			console.log("this.props.currentMappingCount : "+this.props.currentMappingCount);
			if(confirm(`다른 이벤트를 선택하셨네요.
			기존 매핑 정보가 초기화될 수 있습니다.
			계속 하시겠습니까?`))
			{
				this.setState({isClicked: !this.state.isClicked});
				this.props.eventCallBacks.selectEvent(this.props.eventHashKey);		
			}
		}
		else{
			this.setState({isClicked: !this.state.isClicked});
			this.props.eventCallBacks.selectEvent(this.props.eventHashKey);		
		}
	}

	render() {
		let location;
		if(this.props.location === 'noLocation' || this.props.location === ''){
			location= "장소 없음";
		}
		else{
			location= this.props.location;
		}
		/*
		let selectOptions =[
			{ value: 'one', label: 'One' },
  			{ value: 'two', label: 'Two' }
		];
		function logChange(val) {
		  console.log("Selected: " + val);
		}*/
		return (
			<div className={
					this.props.eventHashKey == this.props.currentEvent.event_hashkey
					? "eventcard__click" : "eventcard"
				} onClick={this.clickEvent.bind(this)}>
				<ul>
					<li>캘린더 : { this.props.calendarName }</li>
					<li>시작 : { this.props.startDateTime }</li>
					<li>종료 : { this.props.endDateTime } </li>
					<li>이벤트 : {this.props.eventName }</li>
					<li>장소 : {location}</li>
					<li></li>
					{//<li>지역 태그 : {comboboxinItUp}</li>
					/*
					<Select
					  name="form-field-name"
					  value="one"
					  options={selectOptions}
					  onChange={logChange}
					/>		
					*/
					}
				</ul>	
					
			</div>
		)
	}
}
EventCard.propTypes = {
	userId:PropTypes.string.isRequired,
	eventHashKey:PropTypes.string.isRequired,
	calendarId:PropTypes.string.isRequired,
	calendarName:PropTypes.string,
	eventId:PropTypes.string.isRequired,
	startDateTime:PropTypes.string.isRequired,
	endDateTime:PropTypes.string.isRequired,
	eventName:PropTypes.string.isRequired,
	eventStatus:PropTypes.number,
	location:PropTypes.string,
	eventCallBacks: PropTypes.object,
	currentUser:PropTypes.obejct,
	currentEvent:PropTypes.object,
	currentMappingCount: PropTypes.number,
	regionSet: PropTypes.arrayOf(PropTypes.object)
};

export default EventCard;