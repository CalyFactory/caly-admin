import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

class AdminInfo extends Component {
	render(){
		return (
			<div className="admininfo">
				<li className="title">CalyFactory</li>
				<li>{''}{this.props.adminName} 님 안녕하세요 ! 
				<input type="button" className="admininfologoutbutton" value="로그아웃" onClick={() => this.props.onLogout()} />
				{
				//<input type="button" className="admininfologoutbutton" value="현재 state" onClick={this.props.adminCallBacks.tempPrint.bind(this)} />
				}
				<input type="button" className="admininfologoutbutton" value="지도 보기" onClick={() =>window.open('https://caly.io/img/65e05b93-65d5-490a-8cc4-92d6b7e76f4f.jpg')} />
				<input type="button" className="admininfologoutbutton" value="네이버 지도" onClick={() => window.open('http://map.naver.com/')} />
				</li>

			</div>
		);
	}
};
AdminInfo.propTypes={
	adminId: PropTypes.string,
	adminName: PropTypes.string,
	onLogout: PropTypes.function,
	adminCallBacks: PropTypes.object
};

export default AdminInfo;