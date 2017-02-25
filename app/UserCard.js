import React, { Component, PropTypes } from 'react';

class UserCard extends Component {
	constructor() {
		super(...arguments);
		this.state = {
			isClicked: false
		};
	}

	clickDetails() {
		this.setState({isClicked: !this.state.isClicked});
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
					this.props.eventCallBacks.selectUser.bind(null, this.props.id)
					}>
					click
				</a>
				<ul>
					<li>동기화 시간 : { this.props.lastSyncTime }</li>
					<li>성별 : { this.props.gender } </li>
					<li>나이 : {this.props.age }</li>
				</ul>
			</div>
		)
	}
}
UserCard.propTypes = {
	id:PropTypes.string.isRequired,
	lastSyncTime:PropTypes.string.isRequired,
	gender:PropTypes.string.isRequired,
	age:PropTypes.number.isRequired,
	eventCallBacks:PropTypes.object,
	curruentUser:PropTypes.string
};

export default UserCard;