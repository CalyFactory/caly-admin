import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

class AdminInfo extends Component {
	render(){
		return (
			<div className="admininfo">
				<li className="title">CalyFactory</li>
				<li>{''}{this.props.adminName} 님 안녕하세요 ! 
					<input type="button" className="admininfologoutbutton" value="로그아웃" onClick={() => this.props.onLogout()} />
					{//<input type="button" className="admininfologoutbutton" value="현재 state" onClick={this.props.adminCallBacks.tempPrint.bind(this)} />
					}
					<input type="button" className="admininfologoutbutton" value="매핑 스케줄" onClick={() =>window.open('https://docs.google.com/spreadsheets/d/1cwyxMVDW0PJe2I6WucN7FVmyU1H2hP8mM-DZQ6rUA_E/edit#gid=0')} />
					<input type="button" className="admininfologoutbutton" value="추천 지역" onClick={() =>window.open('https://caly.io/img/recommend_map.png')} />
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