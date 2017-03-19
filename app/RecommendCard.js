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

		/*
		let hashtags = this.props.hashtags.map((hashtag)=>{
			return <div>hashtag.tag_name</div>
			https://caly.io/img/0a18c9ca-d238-464a-a4b5-865106eddb6a.jpg
		});*/
		let imgUrl = "https://caly.io/img/" + this.props.ImgUrl;

		return connectDropTarget(connectDragSource(
			<div className="recommendcard">
				<ul>
					<li className="recoindex">No.{this.props.index}</li>
					<li className="recoindex"><img src={imgUrl} width="60%"></img></li>
					<li>[ {this.props.mainRegion } : {this.props.region } ] {this.props.title }</li>
					<li>성별 : {gender}, <a href={this.props.deepUrl} target="_blank">블로그 리뷰</a></li>
					<li>주소 : {this.props.address }</li>
					<li>가격 : {this.props.price }</li>
					<li>거리 : {this.props.distance }</li>
					<li>등록자 : {this.props.register }, 추천 횟수 : {this.props.recommendCount }</li>
				</ul>
			</div>
		));
	}
}
RecommendCard.propTypes = {
	id:PropTypes.string.isRequired,
	index:PropTypes.number.isRequired,
	mainRegion: PropTypes.string.isRequired,
	region:PropTypes.string.isRequired,
	category:PropTypes.string.isRequired,
	gender:PropTypes.number.isRequired,
	title:PropTypes.string.isRequired,
	address:PropTypes.string.isRequired,
	price:PropTypes.number.isRequired,
	distance:PropTypes.string,
	deepUrl:PropTypes.string.isRequired,
	ImgUrl:PropTypes.string,
	hashtags:PropTypes.arrayOf(PropTypes.object),
	register:PropTypes.string.isRequired,
	recommendCount:PropTypes.number.isRequired,
	dndCallBacks: PropTypes.object,
	connectDragSource: PropTypes.func.isRequired,
	connectDropTarget: PropTypes.func.isRequired
};

const dragHighOrderCard = DragSource(constants.RECOMMEND_CARD, cardDragSpec, collectDrag)(RecommendCard);
const dragDropHighOrderCard = DropTarget(constants.RECOMMEND_CARD, cardDropSpec, collectDrop)(dragHighOrderCard);
export default dragDropHighOrderCard