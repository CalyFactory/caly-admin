import React, { Component, PropTypes } from 'react';
import UserCard from './UserCard';

class UserList extends Component {
	render() {
		let currentYear=new Date().getFullYear();

		// 신규 유저 카드
		let newUserCards = this.props.usercards.filter((card)=>card.mapping_state === 1 ).map((usercard) => {			
			return <UserCard 
					key={usercard.account_hashkey}
					userHashkey={usercard.user_hashkey}
					userAccountHashkey={usercard.account_hashkey}
					recoCount={usercard.reco_count}
					mappingState={usercard.mapping_state}
					gender={usercard.user_gender}
					age={currentYear - usercard.user_birth}
					createDateTime={usercard.create_datetime}
					currentUser={this.props.currentUser}
					theOthersAdmin={this.props.theOthersAdmin}
					eventCallBacks={this.props.eventCallBacks}
							{...usercard} />
		});
		// 기존 유저 카드
		let exiUserCards = this.props.usercards.filter((card)=>card.mapping_state === 2 ).map((usercard) => {			
			return <UserCard 
					key={usercard.user_hashkey}
					userHashkey={usercard.user_hashkey}
					userAccountHashkey={usercard.account_hashkey}
					recoCount={usercard.reco_count}
					mappingState={usercard.mapping_state}
					gender={usercard.user_gender}
					age={currentYear - usercard.user_birth}
					createDateTime={usercard.create_datetime}
					currentUser={this.props.currentUser}
					theOthersAdmin={this.props.theOthersAdmin}
					eventCallBacks={this.props.eventCallBacks}
							{...usercard} />
		});

		return (
			<div className="userlist">
				<h1>{this.props.title}{' '}{this.props.usercards.length}{' '}
				<input type='button' className='syncadmin' value="동기화" onClick={this.props.adminCallBacks.loadAdminList.bind(this)}/></h1>
				{newUserCards}
				{exiUserCards}
			</div>
		);
	}
};
UserList.propTypes = {
	title: PropTypes.string.isRequired,
	currentUser: PropTypes.object,
	theOthersAdmin: PropTypes.arrayOf(PropTypes.string),
	usercards: PropTypes.arrayOf(PropTypes.object),
	eventCallBacks: PropTypes.object,
	adminCallBacks: PropTypes.object
};

export default UserList;