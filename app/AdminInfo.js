import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

class AdminInfo extends Component {
	render(){
		return (
			<div className="admininfo">
				<li className="title">CalyFactory</li>
				<li>{''}{this.props.adminName} 님 안녕하세요 ! <input type="button" className="admininfologoutbutton" value="로그아웃" onClick={() => this.props.onLogout()} /></li>
			</div>
		);
	}
};
AdminInfo.propTypes={
	adminId: PropTypes.string,
	adminName: PropTypes.string,
	onLogout: PropTypes.function
};

export default AdminInfo;