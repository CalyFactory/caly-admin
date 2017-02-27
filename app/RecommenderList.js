import React, { Component, PropTypes } from 'react';
//import {Checkbox, CheckboxGroup} from 'react-checkbox-group';
import checkboxGroup from 'checkbox-group';
import RecommendCard from './RecommendCard';
import {RadioGroup, Radio} from 'react-radio-group';

const CheckboxGroup = checkboxGroup(React);

class RecommenderList extends Component {
	constructor() {
		super(...arguments);
		this.state={
			category:"",
			region:[],
			gender:[],
			age:[],
			price:"",
		};
	}

	componentDidMount(){
		/*
		this.setState({gender:this.props.currentUser.gender});
		//this.setState({age:this.props.currentUser.age});
		console.log("I'm in ! this is componentDidMount in RecommendList.js!")
		let currentUserAge = this.props.currentUser.age;
		if(currentUserAge < 29){
			this.setState({age:"20대"});
		}
		else if(currentUserAge < 39){
			this.setState({age:"30대"});
		}
		else{
			this.setState({age:"40대"});
		
		}
		*/
	}

	categoryChanged(value)	
	{	
		this.setState({category: value});
		this.props.categoryCallBacks.selectCategory(value);
		//console.log("category selected, "+value);

	}
	regionChanged(values) 	{	this.setState({region:values}); }
	genderChanged(values) 	{	this.setState({gender:values});	}
	ageChanged(values)		{	this.setState({age:values});	}

	render() {
		let recommendCards = this.props.recommendcards.map((recommendcard) => {
			if(
				this.state.category == recommendcard.category
				&& this.state.region.includes(recommendcard.region)
				&& this.state.gender.includes(recommendcard.gender)
				&& this.state.age.includes(recommendcard.age)
				)
			{
				return <RecommendCard
								key={recommendcard.id}
								{...recommendcard} />
			}
		});
		let searchBar = (
			<div className="searchBar">
				특성 검색 :{' '}
				<input type="text" />
			</div>
		);

		let choiceCategory = (
			<ul>
				<li>
					분류 :
					<RadioGroup name="category" selectedValue={this.state.category} onChange={this.categoryChanged.bind(this)}>
						<Radio value="레스토랑" />레스토랑
						<Radio value="카페"/>카페
						<Radio value="플레이스"/>플레이스
					</RadioGroup>					
				</li>
				<li>
					지역 :
					<CheckboxGroup name="region" value={this.state.region} onSelection={this.regionChanged.bind(this)}>
						{Checkbox =>
							<div>
								<Checkbox value="강남" />강남
								<Checkbox value="홍대" />홍대
							</div>
						}
					</CheckboxGroup>
				</li>
				<li>
					성별 :
					<CheckboxGroup name="gender" value={this.state.gender} onSelection={this.genderChanged.bind(this)}>
						{Checkbox =>
							<div>
								<Checkbox value="남" />남
								<Checkbox value="여" />여
							</div>
						}
					</CheckboxGroup>
				</li>
				<li>
					연령대 :
					<CheckboxGroup name="age" value={this.state.age} onSelection={this.ageChanged.bind(this)}>
						{Checkbox =>
							<div>
								<Checkbox value="20대" />20대
								<Checkbox value="30대" />30대
								<Checkbox value="40대" />40대
							</div>
						}
					</CheckboxGroup>
				</li>
			</ul>
		);
		return (
			<div className="recommenderlist">
				<h1>{this.props.title}</h1>
				{choiceCategory}
				{searchBar}
				<p></p>
				{recommendCards}
			</div>
		);
	}
};
RecommenderList.propTypes = {
	title: PropTypes.string.isRequired,
	recommendcards: PropTypes.arrayOf(PropTypes.object),
	currentUser: PropTypes.object,
	categoryCallBacks: PropTypes.object
};


export default RecommenderList;