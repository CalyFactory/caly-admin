import React, { Component, PropTypes } from 'react';
import RecommendCard from './RecommendCard';

class RecommendeeList extends Component {
	render() {
		let recommendCards = this.props.recommendcards.map((recommendcard) => {
			return <RecommendCard
							id={recommendcard.id}
							{...recommendcard} />
		});

		return (
			<div className="recommendeelist">
				<h1>{this.props.title}</h1>
				{recommendCards}
			</div>
		);
	}
};
RecommendeeList.propTypes = {
	title: PropTypes.string.isRequired,
	recommendcards: PropTypes.arrayOf(PropTypes.object)
};

export default RecommendeeList;