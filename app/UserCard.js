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
		let backgroundColor = this.state.isClicked? "#111" : "#fff";
		let sideColor = {
	      position: 'absolute',
	      zIndex: -1,
	      top: 0,
	      bottom: 0,
	      left: 0,
	      width: 7,
	      backgroundColor: {backgroundColor}
	    };

		return (
			<div className="usercard">
				<div style={sideColor} />
				<a href="#" className="UserCardClick" onClick={this.clickDetails.bind(this)}>
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
	lastSyncTime:PropTypes.number.isRequired,
	gender:PropTypes.string.isRequired,
	age:PropTypes.number.isRequired
};

export default UserCard;