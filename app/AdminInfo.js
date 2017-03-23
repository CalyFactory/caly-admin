import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

class AdminInfo extends Component {
	render(){
		return (
			<div className="admininfo">
				{this.props.adminId}님 안녕하세요 !
				<input type="button" value="로그아웃" onClick={() => this.props.onLogout()} />
			</div>
		);
	}
};
AdminInfo.propTypes={
	adminId: PropTypes.string,
	onLogout: PropTypes.function
};

export default AdminInfo;