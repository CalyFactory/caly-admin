import React, { Component, PropTypes } from 'react';
import UserCard from './UserCard';

class UserList extends Component {
	render() {
		let userCards = this.props.usercards.map((usercard) => {
			return <UserCard 
					id={usercard.userId}
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