import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import cookie from 'react-cookie';

import MappingBoardContainer from './MappingBoardContainer';
import LoginPanel from './LoginPanel';

class Home extends Component {
	componentWillMount(){
		this.state = {
			adminId: cookie.load('adminId')
		}
	}

	onLogin(adminId){
		this.setState({
			adminId:adminId
		});
		//cookie.save('adminId',adminId, { path: '/'});
	}

	onLogout(){
		this.setState({
			adminId:''
		});
		console.log("OK, Logout !");
		//cookie.remove('adminId', { path: '/'});
	}

	render(){
		if(!this.state.adminId){
			return <LoginPanel 
					onSuccess={this.onLogin.bind(this)} 
					/>;
		}

		return <MappingBoardContainer 
			adminId={this.state.adminId}
			onLogout={this.onLogout.bind(this)}
			/>;
	}
}
export default Home;