import React, { Component, PropTypes } from 'react';
import RecommendCard from './RecommendCard';
import constants from './constants';
import { DropTarget } from 'react-dnd';

const listTargetSpec = {
  hover(props, monitor) {
    const draggedId = monitor.getItem().id;
    props.dndCallBacks.updateStatus(draggedId, props.id)
  }
};

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget()
  };
}

class RecommendeeList extends Component {

	submitClicked(){
		this.props.recommendCallBacks.commitRecommend();
	}

	render() {
		const { connectDropTarget } = this.props;

		// RecommendeeList can list up recommendcard related to current category
		let recommendCards = this.props.recommendcards.map((recommendcard) => {
			if(recommendcard.category == this.props.currentCategory){
				return <RecommendCard
							key={recommendcard.id}
							id={recommendcard.id}
							dndCallBacks={this.props.dndCallBacks}
							{...recommendcard} />
			}
		});
		
		let submitButton = (
			<input className="submitbuton" type="button" value="추천 종료" onClick={this.submitClicked.bind(this)} />
		);
		return connectDropTarget(
			<div className="recommendeelist">
				<h1>{this.props.title}</h1>
				<input className="recommendeeTap" readOnly="true" value={this.props.currentCategory? this.props.currentCategory : "선택한 카테고리 없음"} />
				{submitButton}
				{recommendCards}
			</div>
		);
	}
};
RecommendeeList.propTypes = {
	title: PropTypes.string.isRequired,
	recommendcards: PropTypes.arrayOf(PropTypes.object),
	currentCategory: PropTypes.string,
	recommendCallBacks: PropTypes.object,
	connectDropTarget: PropTypes.func.isRequired,
	dndCallBacks: PropTypes.object
};

export default DropTarget(constants.RECOMMEND_CARD, listTargetSpec, collect)(RecommendeeList);