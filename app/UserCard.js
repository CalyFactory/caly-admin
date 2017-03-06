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
		this.props.eventCallBacks.selectUser(this.props.userHashkey);
	}

	unclicked(){
		this.setState({isClicked: false});
	}

	render() {
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
					<li>성별 : { this.props.gender } </li>
					<li>나이 : {this.props.age }</li>
				</ul>
			</div>
		)
	}
}
UserCard.propTypes = {
	userHashkey:PropTypes.string.isRequired,
	gender:PropTypes.number.isRequired,
	age:PropTypes.number.isRequired,
	eventCallBacks:PropTypes.object
};

export default UserCard;