import React, { Component, PropTypes } from 'react';
import UserCard from './UserCard';

class UserList extends Component {
	render() {
		let currentYear=new Date().getFullYear();

		let userCards = this.props.usercards.map((usercard) => {
			return <UserCard 
					key={usercard.user_hashkey}
					userHashkey={usercard.user_hashkey}
					gender={usercard.user_gender}
					age={currentYear - usercard.user_birth}
					eventCallBacks={this.props.eventCallBacks}
							{...usercard} />
		});

		return (
			<div className="userlist">
				<h1>{this.props.title}</h1>
				{userCards}
			</div>
		);
	}
};
UserList.propTypes = {
	title: PropTypes.string.isRequired,
	usercards: PropTypes.arrayOf(PropTypes.object),
	eventCallBacks: PropTypes.object
};

export default UserList;