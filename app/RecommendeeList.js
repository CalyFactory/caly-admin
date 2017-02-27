import React, { Component, PropTypes } from 'react';
import RecommendCard from './RecommendCard';

class RecommendeeList extends Component {

	submitClicked(){
		console.log("Click !!");
	}

	render() {
		let recommendCards = this.props.recommendcards.map((recommendcard) => {
			if(recommendcard.category == this.props.currentCategory){
				return <RecommendCard
							id={recommendcard.id}
							{...recommendcard} />
			}
		});

		let submitButton = (
			<input className="submitbuton" type="button" value={this.props.currentCategory} onClick={this.submitClicked.bind(this)} />
		);
		return (
			<div className="recommendeelist">
				<h1>{this.props.title}</h1>
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