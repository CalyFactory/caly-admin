import React, { Component, PropTypes } from 'react';
import RecommendCard from './RecommendCard';

class RecommendList extends Component {
	render() {
		let recommendCards = this.props.recommendcards.map((recommendcard) => {
			return <RecommendCard
							id={recommendcard.id}
							{...recommendcard} />
		});

		return (
			<div className="recommendlist">
				<h1>{this.props.title}</h1>
				{recommendCards}
			</div>
		);
	}
};
RecommendList.propTypes = {
	title: PropTypes.string.isRequired,
	recommendcards: PropTypes.arrayOf(PropTypes.object)
};

export default RecommendList;