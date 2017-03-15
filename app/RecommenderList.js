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
	/* After manage will be click a user in UserList, auto-checking about the user
	this.setState({gender:this.props.currentUser.gender});
	
	*/

	// Each Changed method about Category choices.
	categoryChanged(value)	{	
		this.props.categoryCallBacks.selectCategory(value);	
	}
	regionChanged(values) 	{	
		this.props.categoryCallBacks.selectMainRegions(values);
	}
	genderChanged(values) 	{	
		this.props.categoryCallBacks.selectGenders(values);
	}
	
	render() {
		const { connectDropTarget } = this.props;

		// Manager can see recommend card be filtering.
		// The card can not be see without checking.
		let recommendCards = this.props.recommendcards.map((recommendcard) => {
			/*console.log("currentMainRegions "+this.props.currentMainRegions);
			console.log("instanceof "+this.props.currentMainRegions instanceof Array);
			console.log("typeof "+ typeof this.props.currentMainRegions);
			console.log("currentGenders "+this.props.currentGenders);
			console.log("instanceof "+this.props.currentGenders instanceof Array);
			console.log("typeof "+ typeof this.props.currentGenders);*/
			//let isGender = this.props.currentGenders.includes(recommendcard.gender.toString());
			//console.log("isGender : "+isGender);
			if(	
				this.props.currentCategory == recommendcard.category
				&& (this.props.currentMainRegions.includes(recommendcard.main_region) )
				&& (this.props.currentGenders.includes(recommendcard.gender.toString()) )
				)
			{
				return <RecommendCard
								key={recommendcard.reco_hashkey}
								id={recommendcard.reco_hashkey}
								mainRegion={recommendcard.main_region}
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
					<RadioGroup name="category" selectedValue={this.props.currentCategory} onChange={this.categoryChanged.bind(this)}>
						<Radio value="restaurant" />레스토랑
						<Radio value="cafe"/>카페
						<Radio value="place"/>플레이스
					</RadioGroup>					
				</li>
				<li>
					지역 :
					<CheckboxGroup name="main_region" value={this.props.currentMainRegions} onSelection={this.regionChanged.bind(this)}>
						{Checkbox =>
							<div>
								<Checkbox value="동부" />동
								<Checkbox value="서부" />서
								<Checkbox value="중부" />중
								<Checkbox value="남부" />남
								<Checkbox value="북부" />북
							</div>
						}
					</CheckboxGroup>
				</li>
				<li>
					성별 :
					<CheckboxGroup name="gender" value={this.props.currentGenders} onSelection={this.genderChanged.bind(this)}>
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
		let recommenderPanel;
		if(this.props.currentEvent)
		{
			recommenderPanel=(
				<div>
					{choiceCategory}
					{searchBar}
					<p></p>
					{recommendCards}
				</div>
			)
		}
		return connectDropTarget(
			<div className="recommenderlist">
				<h1>{this.props.title}</h1>
				{recommenderPanel}
			</div>
		);
	}
};
RecommenderList.propTypes = {
	title: PropTypes.string.isRequired,
	recommendcards: PropTypes.arrayOf(PropTypes.object),
	currentUser: PropTypes.object,
	currentEvent: PropTypes.string,
	currentCategory: PropTypes.string,
	currentMainRegions: PropTypes.arrayOf(PropTypes.string),
	currentGenders: PropTypes.arrayOf(PropTypes.string),
	categoryCallBacks: PropTypes.object,
	connectDropTarget: PropTypes.func.isRequired,
	dndCallBacks: PropTypes.object
};

export default DropTarget(constants.RECOMMEND_CARD, listTargetSpec, collect)(RecommenderList);