import React, { Component, PropTypes } from 'react';
import { DragSource, DropTarget } from 'react-dnd';
import constants from './constants';

const cardDragSpec = {
  beginDrag(props) {
    return {
      id: props.id,
      status: props.status
    };
  },
  endDrag(props) {
  	// CR : 드래그 끝났을때 작동
    props.dndCallBacks.persistCardDrag(props.id, props.status);
  }
}

const cardDropSpec = {
  hover(props, monitor) {
    const draggedId = monitor.getItem().id;
    props.dndCallBacks.updatePosition(draggedId, props.id);
  }
}


let collectDrag = (connect, monitor) => {
  return {
    connectDragSource: connect.dragSource()
  };
}

let collectDrop = (connect, monitor) => {
  return {
    connectDropTarget: connect.dropTarget(),
  };
}

class RecommendCard extends Component {
	render() {
		const { connectDragSource, connectDropTarget } = this.props;
	
		let gender="무관";
		if(this.props.gender == 1)
			gender="남";
		else if(this.props.gender == 2)
			gender="여";
		else;

		return connectDropTarget(connectDragSource(
			<div className="recommendcard">
				<ul>
					<li>주 지역 : {this.props.mainRegion }</li>
					<li>세부 지역 : {this.props.region }</li>
					<li>분류 : {this.props.category }</li>
					<li>가게 이름 : {this.props.title }</li>
					<li>성별 : {gender}</li>
					<li>주소 : {this.props.address }</li>
					<li>가격 : {this.props.price }</li>
					<li>거리 : {this.props.distance }</li>
					<li>맵 주소 : {this.props.mapUrl }</li>
					<li>등록자 : {this.props.register }</li>
					<li>추천 횟수 : {this.props.recommendCount }</li>
				</ul>
			</div>
		));
	}
}
RecommendCard.propTypes = {
	id:PropTypes.string.isRequired,
	mainRegion: PropTypes.string.isRequired,
	region:PropTypes.string.isRequired,
	category:PropTypes.string.isRequired,
	gender:PropTypes.number.isRequired,
	title:PropTypes.string.isRequired,
	address:PropTypes.string.isRequired,
	price:PropTypes.number.isRequired,
	distance:PropTypes.string,
	mapUrl:PropTypes.string.isRequired,
	register:PropTypes.string.isRequired,
	recommendCount:PropTypes.number.isRequired,
	dndCallBacks: PropTypes.object,
	connectDragSource: PropTypes.func.isRequired,
	connectDropTarget: PropTypes.func.isRequired
};

const dragHighOrderCard = DragSource(constants.RECOMMEND_CARD, cardDragSpec, collectDrag)(RecommendCard);
const dragDropHighOrderCard = DropTarget(constants.RECOMMEND_CARD, cardDropSpec, collectDrop)(dragHighOrderCard);
export default dragDropHighOrderCard