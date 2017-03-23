import React, { Component, PropTypes } from 'react';
import RecommendCard from './RecommendCard';
import constants from './constants';
import { DropTarget } from 'react-dnd';
import AlertContainer from 'react-alert';

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
	constructor(){
		super(...arguments);
		this.alertOptions = {
			offset: 14,
			position: 'top right',
			theme: 'dark',
			time: 5000,
			transition: 'scale'
		};
	}

	submitClicked(){
		if(this.props.recommendcards.length>0){
			let countRestaurant= this.props.recommendcards.filter((recommendcard)=>recommendcard.category === 'restaurant').length;
			let countCafe= this.props.recommendcards.filter((recommendcard)=>recommendcard.category === 'cafe').length;
			let countPlace= this.props.recommendcards.filter((recommendcard)=>recommendcard.category === 'place').length;
		
			msg.show(`추천 성공.
				restuarant : `+countRestaurant+`,
				cafe : `+countCafe+`,
				place : `+countPlace, {
				time: 2000,
				type: 'success'
			});
			this.props.recommendCallBacks.commitRecommend();
			this.props.recommendCallBacks.reloadRecommendList();
		}
		else{
			msg.show('추천된 카드가 없습니다 !', {
				time: 2000,
				type: 'error'
			});
		}
	}

	render() {
		const { connectDropTarget } = this.props;
		let countRestaurant= this.props.recommendcards.filter((recommendcard)=>recommendcard.category === 'restaurant').length;
		let countCafe= this.props.recommendcards.filter((recommendcard)=>recommendcard.category === 'cafe').length;
		let countPlace= this.props.recommendcards.filter((recommendcard)=>recommendcard.category === 'place').length;
		let index=0;
		// RecommendeeList can list up recommendcard related to current category
		let recommendCards = this.props.recommendcards.map((recommendcard) => {
			if(recommendcard.category == this.props.currentCategory){
				index++;


				return <RecommendCard
							key={recommendcard.reco_hashkey}
							id={recommendcard.reco_hashkey}
							index={index}
							mainRegion={recommendcard.main_region}
							deepUrl={recommendcard.deep_url}
							ImgUrl={recommendcard.img_url}
							hashtags={recommendcard.tagNames}
							recommendCount={recommendcard.reco_cnt}
							dndCallBacks={this.props.dndCallBacks}
							{...recommendcard} />
			}
		});
		
		let submitButton = (
			<input className="submitbuton" type="button" value="매핑 저장" onClick={this.submitClicked.bind(this)} />
		);
		let recommendeePanel;
		if(this.props.currentEvent.event_hashkey)
		{
			recommendeePanel = (
				<div>
					<p>Rest : {countRestaurant}, Cafe : {countCafe}, Place : {countPlace}</p>
					<input className="recommendeeTap" readOnly="true" value={this.props.currentCategory? this.props.currentCategory : "Not selected"} />
					{submitButton}
					{recommendCards}
				</div>
			);
		}
		return connectDropTarget(
			<div className="recommendeelist">
				<AlertContainer ref={ (a) => global.msg = a} {...this.alertOptions} />
				<h1>{this.props.title}</h1>
				{recommendeePanel}
			</div>
		);
	}
};
RecommendeeList.propTypes = {
	title: PropTypes.string.isRequired,
	recommendcards: PropTypes.arrayOf(PropTypes.object),
	currentEvent: PropTypes.object,
	currentCategory: PropTypes.string,
	recommendCallBacks: PropTypes.object,
	connectDropTarget: PropTypes.func.isRequired,
	dndCallBacks: PropTypes.object
};

export default DropTarget(constants.RECOMMEND_CARD, listTargetSpec, collect)(RecommendeeList);