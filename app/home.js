import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import cookie from 'react-cookie';

import MappingBoardContainer from './MappingBoardContainer';
import LoginPanel from './LoginPanel';

class Home extends Component {
	componentWillMount(){
		this.state = {
			adminId: cookie.load('adminId'),
			adminName: cookie.load('adminName')
		}
		//adminId: cookie.load('adminId'),
	}

	onLogin(adminId,adminName){
		this.setState({
			adminId:adminId,
			adminName:adminName
		});
		cookie.save('adminId',adminId, { path: '/'});
		cookie.save('adminName',adminName, { path: '/'});
	}

	onLogout(){
		this.setState({
			adminId:'',
			adminName:''
		});
		console.log("OK, Logout !");
		cookie.remove('adminId', { path: '/'});
		cookie.remove('adminName', { path: '/'});
	}

	render(){
		if(!this.state.adminId){
			return <LoginPanel 
					onSuccess={this.onLogin.bind(this)} 
					/>;
		}

		return <MappingBoardContainer 
			adminId={this.state.adminId}
			adminName={this.state.adminName}
			onLogout={this.onLogout.bind(this)}
			/>;
	}
}
export default Home;