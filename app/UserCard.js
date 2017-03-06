import React, { Component, PropTypes } from 'react';

class UserCard extends Component {
	constructor() {
		super(...arguments);
		this.state = {
			isClicked: false
		};
	}

	clickDetails() {
		// Set background Color. Consider about another UserCard
		//this.setState({isClicked: !this.state.isClicked});
		this.props.eventCallBacks.updateEventList(this.props.userHashkey);
		this.props.eventCallBacks.reloadRecommendList();
	}


	render() {
		let gender="무관";
		if(this.props.gender == 1)
			gender="남";
		else if(this.props.gender == 2)
			gender="여";
		else;

		return (
			<div className={
				this.state.isClicked? "usercard__click" : "usercard"
			}>
				<a href="#" className="UserCardClick" onClick={
					this.clickDetails.bind(this)
					}>
					click
				</a>
				<ul>
					<li>성별 : { gender }, 나이 : { this.props.age }</li>
				</ul>
			</div>
		)
	}
}
UserCard.propTypes = {
	userHashkey:PropTypes.string.isRequired,
	gender:PropTypes.number.isRequired,
	age:PropTypes.number.isRequired,
	eventCallBacks:PropTypes.object,
	currentUser: PropTypes.object
};

export default UserCard;