import React, { Component, PropTypes } from 'react';
import checkboxGroup from 'checkbox-group';
import RecommendCard from './RecommendCard';
import {RadioGroup, Radio} from 'react-radio-group';
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

const CheckboxGroup = checkboxGroup(React);

class RecommenderList extends Component {
	constructor() {
		super(...arguments);
		this.state={
			category:"",
			region:[],
			gender:[],
			// not using policy (yet)
			//age:[],
			price:"",
		};
	}

	
	/* After click a user in UserList, auto-checking about the user
	this.setState({gender:this.props.currentUser.gender});
	
	*/

	// Each Changed method about Category choices.
	categoryChanged(value)	
	{	
		this.setState({category: value});
		this.props.categoryCallBacks.selectCategory(value);
		
	}
	regionChanged(values) 	{	this.setState({region:values}); }
	genderChanged(values) 	{	this.setState({gender:values});	}
	// not using policy (yet)
	//ageChanged(values)		{	this.setState({age:values});	}

	render() {
		const { connectDropTarget } = this.props;

		// Manager can see recommend card be filtering.
		// The card can not be see without checking.
		let recommendCards = this.props.recommendcards.map((recommendcard) => {
			if(
				this.state.category == recommendcard.category
				&& this.state.region.includes(recommendcard.region)
				&& this.state.gender.includes(recommendcard.gender.toString())
				//&& this.state.age.includes(recommendcard.age)
				)
			{
				return <RecommendCard
								key={recommendcard.reco_hashkey}
								id={recommendcard.reco_hashkey}
								mapUrl={recommendcard.map_url}
								recommendCount={recommendcard.reco_cnt}
								dndCallBacks={this.props.dndCallBacks}
								{...recommendcard} />
			}
		});

		// Manager can search input text.
		let searchBar = (
			<div className="searchBar">
				특성 검색 :{' '}
				<input type="text" />
			</div>
		);

		// Category context
		let choiceCategory = (
			<ul>
				<li>
					분류 :
					<RadioGroup name="category" selectedValue={this.state.category} onChange={this.categoryChanged.bind(this)}>
						<Radio value="restaurant" />레스토랑
						<Radio value="cafe"/>카페
						<Radio value="place"/>플레이스
					</RadioGroup>					
				</li>
				<li>
					지역 :
					<CheckboxGroup name="region" value={this.state.region} onSelection={this.regionChanged.bind(this)}>
						{Checkbox =>
							<div>
								<Checkbox value="강남" />강남
								<Checkbox value="홍대" />홍대
							</div>
						}
					</CheckboxGroup>
				</li>
				<li>
					성별 :
					<CheckboxGroup name="gender" value={this.state.gender} onSelection={this.genderChanged.bind(this)}>
						{Checkbox =>
							<div>
								<Checkbox value="1" />남
								<Checkbox value="2" />여
								<Checkbox value="3" />무관
							</div>
						}
					</CheckboxGroup>
				</li>
				{/* not using policy (yet)
				<li>
					연령대 :
					<CheckboxGroup name="age" value={this.state.age} onSelection={this.ageChanged.bind(this)}>
						{Checkbox =>
							<div>
								<Checkbox value="20대" />20대
								<Checkbox value="30대" />30대
								<Checkbox value="40대" />40대
							</div>
						}
					</CheckboxGroup>
				</li>
				*/}
			</ul>
		);
		return connectDropTarget(
			<div className="recommenderlist">
				<h1>{this.props.title}</h1>
				{choiceCategory}
				{searchBar}
				<p></p>
				{recommendCards}
			</div>
		);
	}
};
RecommenderList.propTypes = {
	title: PropTypes.string.isRequired,
	recommendcards: PropTypes.arrayOf(PropTypes.object),
	currentUser: PropTypes.object,
	categoryCallBacks: PropTypes.object,
	connectDropTarget: PropTypes.func.isRequired,
	dndCallBacks: PropTypes.object
};

export default DropTarget(constants.RECOMMEND_CARD, listTargetSpec, collect)(RecommenderList);