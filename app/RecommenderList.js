import React, { Component, PropTypes } from 'react';
import RecommendCard from './RecommendCard';

class RecommenderList extends Component {
	constructor() {
		super(...arguments);
		this.state={
			category:[],
			region:[],
			gender:[],
			age:[],
			price:[],
		};
	}
	render() {
		let recommendCards = this.props.recommendcards.map((recommendcard) => {
			if(recommendcard.region === "강남")
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
					분류 :{' '} 
					<input type="checkbox" checked="" />{' '}식사
					<input type="checkbox" checked="" />{' '}카페
					<input type="checkbox" checked="" />{' '}액티비티
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