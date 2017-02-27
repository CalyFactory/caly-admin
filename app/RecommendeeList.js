import React, { Component, PropTypes } from 'react';
import RecommendCard from './RecommendCard';

class RecommendeeList extends Component {

	submitClicked(){
		console.log("Click !!");
	}

	render() {

		// RecommendeeList can list up recommendcard related to current category
		let recommendCards = this.props.recommendcards.map((recommendcard) => {
			if(recommendcard.category == this.props.currentCategory){
				return <RecommendCard
							id={recommendcard.id}
							{...recommendcard} />
			}
		});
		
		let submitButton = (
			<input className="submitbuton" type="button" value="추천 종료" onClick={this.submitClicked.bind(this)} />
		);
		return (
			<div className="recommendeelist">
				<h1>{this.props.title}</h1>
				<input className="recommendeeTap" value={this.props.currentCategory? this.props.currentCategory : "선택한 카테고리 없음"} />
				{submitButton}
				{recommendCards}
			</div>
		);
	}
};
RecommendeeList.propTypes = {
	title: PropTypes.string.isRequired,
	recommendcards: PropTypes.arrayOf(PropTypes.object),
	currentCategory: PropTypes.string
};

export default RecommendeeList;