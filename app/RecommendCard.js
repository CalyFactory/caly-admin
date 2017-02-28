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
	constructor() {
		super(...arguments);
		this.state = {
			isClicked: false
		};
	}

	clickDetails() {
		this.setState({isClicked: !this.state.isClicked});
	}

	unclicked(){
		this.setState({isClicked: false});
	}

	render() {
		const { connectDragSource, connectDropTarget } = this.props;
		
		let backgroundColor = this.state.isClicked? "#111" : "#fff";
		let sideColor = {
	      position: 'absolute',
	      zIndex: -1,
	      top: 0,
	      bottom: 0,
	      left: 0,
	      width: 7,
	      backgroundColor: {backgroundColor}
	    };

		return connectDropTarget(connectDragSource(
			<div className="recommendcard">
				<div style={sideColor} />
				<a href="#" className="recommend_card_click" onClick={this.clickDetails.bind(this)}>
					click
				</a>
				<ul>
					<li>ID : {this.props.id} </li>
					<li>지역 : {this.props.region }</li>
					<li>분류 : {this.props.category }</li>
					<li>연령대 : {this.props.age }</li>
					<li>성별 : {this.props.gender }</li>
					<li>가게 이름 : {this.props.title }</li>
					<li>주소 : {this.props.address }</li>
					<li>가격 : {this.props.price }</li>
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
	region:PropTypes.string.isRequired,
	category:PropTypes.string.isRequired,
	age:PropTypes.string.isRequired,
	gender:PropTypes.string.isRequired,
	title:PropTypes.string.isRequired,
	address:PropTypes.string.isRequired,
	price:PropTypes.number.isRequired,
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