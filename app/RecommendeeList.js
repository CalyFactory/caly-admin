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
			
			if(confirm(`매핑 완료합니다. 정보를 확인해주세요.
				========================
				레스토랑 : `+countRestaurant+`,
				카페 : `+countCafe+`,
				플레이스 : `+countPlace))
			{
				this.props.recommendCallBacks.commitRecommend();
			}
		}
		else{
			confirm('추천된 카드가 없습니다 !');
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
							status={recommendcard.status}
							mainRegion={recommendcard.main_region}
							deepUrl={recommendcard.deep_url}
							ImgUrl={recommendcard.img_url}
							hashtags={recommendcard.tagNames}
							recommendCount={recommendcard.reco_cnt}
							currentMappingCount = {this.props.currentMappingCount}
							dndCallBacks={this.props.dndCallBacks}
							recommendCallBacks={this.props.recommendCallBacks}
							currentMappingCountCategoryRest={this.props.currentMappingCountCategoryRest}
      						currentMappingCountCategoryCafe={this.props.currentMappingCountCategoryCafe}
      						currentMappingCountCategoryPlace={this.props.currentMappingCountCategoryPlace}
							{...recommendcard} />
			}
		});
		
		let submitButton = (
			<div>
				<input className="submitbuton" type="button" value="매핑 저장" onClick={this.submitClicked.bind(this)} />
				<input className="initrecommendbuton" type="button" value="초기화" onClick={this.props.recommendCallBacks.reloadRecommendList.bind(this)} />
			</div>
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
	currentMappingCount: PropTypes.number,
	dndCallBacks: PropTypes.object,
	currentMappingCountCategoryRest: PropTypes.number,
	currentMappingCountCategoryCafe: PropTypes.number,
	currentMappingCountCategoryPlace: PropTypes.number
};

export default DropTarget(constants.RECOMMEND_CARD, listTargetSpec, collect)(RecommendeeList);