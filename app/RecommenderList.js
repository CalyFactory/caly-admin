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
	mainRegionChanged(values) {	
		this.props.categoryCallBacks.selectMainRegions(values);
	}
	detailRegionChanged(values) {	
		this.props.categoryCallBacks.selectDetailRegions(values);
	}
	genderChanged(values) 	{	
		this.props.categoryCallBacks.selectGenders(values);
	}
	
	hashTagHandleChange(event){
		this.props.categoryCallBacks.inputUserHashTag(event.target.value);
	}

	render() {
		const { connectDropTarget } = this.props;

		let centeralRegionDict = this.props.regionSet.filter((region)=>region.main_region === "중부");
		let southRegionDict = this.props.regionSet.filter((region)=>region.main_region === "남부");
		let northRegionDict = this.props.regionSet.filter((region)=>region.main_region === "북부");
		let eastRegionDict = this.props.regionSet.filter((region)=>region.main_region === "동부");
		let westRegionDict = this.props.regionSet.filter((region)=>region.main_region === "서부");
		//console.log("testNorthRegionSet");
		//console.log(testNorthRegionSet);
		// Manager can see recommend card be filtering.
		// The card can not be see without checking.
		let eastRegion, westRegion, centeralRegion, southRegion, northRegion;
		

		if(this.props.currentMainRegions.includes('동부'))
		{	
			let eastRegionCount={}
			for (let i=0 ; i<eastRegionDict.length; i++){
				eastRegionCount[eastRegionDict[i].region]=this.props.recommendcards.filter((card)=>(card.region === eastRegionDict[i].region && card.category === this.props.currentCategory)).length;
			}
			
			eastRegion = (
				<div className="detailRegion">
					<CheckboxGroup name="east_region" value={this.props.currentDetailRegions} onSelection={this.detailRegionChanged.bind(this)}>
						{Checkbox =>
							<div>
								{
									eastRegionDict.map((eastRegion)=>{
										return <label><Checkbox value={eastRegion.region} />{eastRegion.region} ({eastRegionCount[eastRegion.region]})</label>
									})
								}
							</div>
						}
					</CheckboxGroup>
				</div>
			);
		}
		if(this.props.currentMainRegions.includes('서부'))
		{
			let westRegionCount={}
			for (let i=0 ; i<westRegionDict.length; i++){
				westRegionCount[westRegionDict[i].region]=this.props.recommendcards.filter((card)=>(card.region === westRegionDict[i].region && card.category === this.props.currentCategory)).length;
			}

			westRegion = (
				<div className="detailRegion">
					<CheckboxGroup name="west_region" value={this.props.currentDetailRegions} onSelection={this.detailRegionChanged.bind(this)}>
						{Checkbox =>
							<div>
								{
									westRegionDict.map((westRegion)=>{
										return <label><Checkbox value={westRegion.region} />{westRegion.region} ({westRegionCount[westRegion.region]})</label>
									})
								}
							</div>
						}
					</CheckboxGroup>
				</div>
			);	
		}
		if(this.props.currentMainRegions.includes('중부'))
		{
			let centeralRegionCount={}
			for (let i=0 ; i<centeralRegionDict.length; i++){
				centeralRegionCount[centeralRegionDict[i].region]=this.props.recommendcards.filter((card)=>(card.region === centeralRegionDict[i].region && card.category === this.props.currentCategory)).length;
			}

			centeralRegion = (
				<div className="detailRegion">
					<CheckboxGroup name="center_region" value={this.props.currentDetailRegions} onSelection={this.detailRegionChanged.bind(this)}>
						{Checkbox =>
							<div>
								{
									centeralRegionDict.map((centeralRegion)=>{
										return <label><Checkbox value={centeralRegion.region} />{centeralRegion.region} ({centeralRegionCount[centeralRegion.region]})</label>
									})
								}
							</div>
						}
					</CheckboxGroup>
				</div>
			);
		}
		if(this.props.currentMainRegions.includes('남부'))
		{
			let southRegionCount={}
			for (let i=0 ; i<southRegionDict.length; i++){
				southRegionCount[southRegionDict[i].region]=this.props.recommendcards.filter((card)=>(card.region === southRegionDict[i].region && card.category === this.props.currentCategory)).length;
			}

			southRegion = (
				<div className="detailRegion">
					<CheckboxGroup name="south_region" value={this.props.currentDetailRegions} onSelection={this.detailRegionChanged.bind(this)}>
						{Checkbox =>
							<div>
								{
									southRegionDict.map((southRegion)=>{
										return <label><Checkbox value={southRegion.region} />{southRegion.region} ({southRegionCount[southRegion.region]})</label>
									})
								}
							</div>
						}
					</CheckboxGroup>
				</div>
			);
		}
		if(this.props.currentMainRegions.includes('북부'))
		{
			let northRegionCount={}
			for (let i=0 ; i<northRegionDict.length; i++){
				northRegionCount[northRegionDict[i].region]=this.props.recommendcards.filter((card)=>(card.region === northRegionDict[i].region && card.category === this.props.currentCategory)).length;
			}

			northRegion = (
				<div className="detailRegion">
					<CheckboxGroup name="north_region" value={this.props.currentDetailRegions} onSelection={this.detailRegionChanged.bind(this)}>
						{Checkbox =>
							<div>
								{
									northRegionDict.map((northRegion)=>{
										return <label><Checkbox value={northRegion.region} />{northRegion.region} ({northRegionCount[northRegion.region]})</label>
									})
								}
							</div>
						}
					</CheckboxGroup>
				</div>
			);	
		}
		let detailRegions;
		if(this.props.currentMainRegions.length > 0)
		{
			detailRegions = (
				<li>
					세부 지역:
					{eastRegion}
					{westRegion}
					{centeralRegion}
					{southRegion}
					{northRegion}
				</li>
			);
		}
		let index=0;
		//let recommendHashCards = this.props.recommendcards.filter((recommendcard)=>recommendcard.tagName.toString().find(this.props.userInputHashTag));
		//let recommendCards = recommendHashCards.map((recommendcard) => {
		let recommendFilterCards = this.props.recommendcards;
		//if(this.props.userInputHashTag !== '')
		//	recommendFilterCards=recommendFilterCards.filter((recommendCard)=>recommendCard.tagNames.includes(this.props.userInputHashTag));
		let recommendCards = recommendFilterCards.map((recommendcard) => {
			//if(this.props.currentDetailRegions.includes(recommendcard.region))
			//	console.log(recommendcard.title);
			
			if(	
				this.props.currentCategory == recommendcard.category
				&& (this.props.currentDetailRegions.includes(recommendcard.region)		)
				//&& (this.props.currentGenders.includes(recommendcard.gender.toString()) ) without Gender
				)
			{
				if(this.props.userInputHashTag !== '' && recommendcard.tagNames.includes(this.props.userInputHashTag)){
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
				else if(this.props.userInputHashTag === ''){
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
			}
		});

		// Manager can search input text.
		let searchBar = (
			<div className="searchBar">
				특성 검색 :{' '}
				<input type="text" placeholder="해시태그 검색" 
					value={this.props.userInputHashTag} onChange={this.hashTagHandleChange.bind(this)}/>
			</div>
		);
		// Category context
		let choiceCategory = (
			<ul>
				<li>
					분류 :
					<RadioGroup name="category" selectedValue={this.props.currentCategory} onChange={this.categoryChanged.bind(this)}>
						<label><Radio value="restaurant" />레스토랑</label>
						<label><Radio value="cafe"/>카페</label>
						<label><Radio value="place"/>플레이스</label>
					</RadioGroup>					
				</li>
				{/*
				<li>
					성별 :
					<CheckboxGroup name="gender" checked={this.props.currentGenders} value={this.props.currentGenders} onSelection={this.genderChanged.bind(this)}>
						{Checkbox =>
							<div>
								<Checkbox value="1" />남
								<Checkbox value="2" />여
								<Checkbox value="3" />무관
							</div>
						}
					</CheckboxGroup>
				</li>
				*/}
				<li>
					지역 :
					<CheckboxGroup name="main_region" value={this.props.currentMainRegions} onSelection={this.mainRegionChanged.bind(this)}>
						{Checkbox =>
							<div>
								<label><Checkbox value="동부" />동</label>
								<label><Checkbox value="서부" />서</label>
								<label><Checkbox value="중부" />중</label>
								<label><Checkbox value="남부" />남</label>
								<label><Checkbox value="북부" />북</label>
							</div>
						}
					</CheckboxGroup>
				</li>
				{detailRegions}
			</ul>
		);
		let recommenderPanel;
		if(this.props.currentEvent.event_hashkey)
		{
			recommenderPanel=(
				<div>
					{choiceCategory}
					{searchBar}
					<p></p>
					{recommendCards}
				</div>
			);
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
	currentEvent: PropTypes.object,
	currentCategory: PropTypes.string,
	currentMainRegions: PropTypes.arrayOf(PropTypes.string),
	currentDetailRegions: PropTypes.arrayOf(PropTypes.string),
	currentGenders: PropTypes.arrayOf(PropTypes.string),
	regionSet: PropTypes.arrayOf(PropTypes.object),
	categoryCallBacks: PropTypes.object,
	connectDropTarget: PropTypes.func.isRequired,
	dndCallBacks: PropTypes.object,
	userInputHashTag: PropTypes.string,
	currentMappingCountCategoryRest: PropTypes.number,
	currentMappingCountCategoryCafe: PropTypes.number,
	currentMappingCountCategoryPlace: PropTypes.number
};

export default DropTarget(constants.RECOMMEND_CARD, listTargetSpec, collect)(RecommenderList);