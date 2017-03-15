import React, { Component, PropTypes } from 'react';
import UserCard from './UserCard';

class UserList extends Component {
	render() {
		let currentYear=new Date().getFullYear();

		let userCards = this.props.usercards.map((usercard) => {
			// create_datetime convert to 17XXXX XX:XX
			let cdt = usercard.create_datetime.split('T');
			let ctd = cdt[0].split('-');
			let cttt = cdt[1].split('.');
			let ctt = cttt[0].split(':');
			let cctdt = ctd[0]+','+ctd[1]+','+ctd[2]+','+ctt;
			
			return <UserCard 
					key={usercard.user_hashkey}
					userHashkey={usercard.user_hashkey}
					gender={usercard.user_gender}
					age={currentYear - usercard.user_birth}
					createDateTime={cctdt}
					currentUser={this.props.currentUser}
					eventCallBacks={this.props.eventCallBacks}
							{...usercard} />
		});

		return (
			<div className="userlist">
				<h1>{this.props.title}{' '}{this.props.usercards.length}</h1>
				{userCards}
			</div>
		);
	}
};
UserList.propTypes = {
	title: PropTypes.string.isRequired,
	currentUser: PropTypes.object,
	usercards: PropTypes.arrayOf(PropTypes.object),
	eventCallBacks: PropTypes.object
};

export default UserList;