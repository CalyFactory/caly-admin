import React, { Component, PropTypes } from 'react';
import {Checkbox, CheckboxGroup} from 'react-checkbox-group';
import RecommendCard from './RecommendCard';

class RecommenderList extends Component {
	constructor() {
		super(...arguments);
		this.state={
			category:"",
			region:"",
			gender:"",
			age:"",
			price:"",
		};
	}

	tapChanged(e) {
		//console.log(e)
	}

	render() {
		let recommendCards = this.props.recommendcards.map((recommendcard) => {
			//if(recommendcard.region === "강남")
			//{
				return <RecommendCard
								key={recommendcard.id}
								{...recommendcard} />
			//}
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
					<CheckboxGroup name="category">
						<label><Checkbox value="식사" onClick={this.tapChanged(1)}/>식사</label>
						<label><Checkbox value="카페" onClick={this.tapChanged(2)}/>카페</label>
						<label><Checkbox value="액티비티" onClick={this.tapChanged(3)}/>액티비티</label>
					</CheckboxGroup>
				</li>
				<li>
					지역 :{' '}
					<input type="checkbox" checked="" />{' '}강남
					<input type="checkbox" checked="" />{' '}홍대
				</li>
				<li>
					성별 :{' '}
					<input type="checkbox" checked="" />{' '}남
					<input type="checkbox" checked="" />{' '}여
				</li>
				<li>
					연령대 :{' '}
					<input type="checkbox" checked="" />{' '}20대
					<input type="checkbox" checked="" />{' '}30대
					<input type="checkbox" checked="" />{' '}40대
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
	recommendcards: PropTypes.arrayOf(PropTypes.object)
};

export default RecommenderList;