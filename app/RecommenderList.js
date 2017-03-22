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
		console.log("current main regions is "+values);
		this.props.categoryCallBacks.selectMainRegions(values);
	}
	detailRegionChanged(values) {	
		console.log("current detail regions is "+values);
		this.props.categoryCallBacks.selectDetailRegions(values);
	}
	genderChanged(values) 	{	
		console.log("genderChanged : "+values);
		this.props.categoryCallBacks.selectGenders(values);
	}
	
	render() {
		const { connectDropTarget } = this.props;

		
		//let centeralRegionSet = this.props.regionSet.filter((region)=>region.main_region === "중부");
		//let southRegionSet = this.props.regionSet.filter((region)=>region.main_region === "남부");
		//let northRegionSet = this.props.regionSet.filter((region)=>region.main_region === "북부");
		// Manager can see recommend card be filtering.
		// The card can not be see without checking.
		let eastRegion, westRegion, centeralRegion, southRegion, northRegion;
		if(this.props.currentMainRegions.includes('동부'))
		{	
			/*
			console.log("regionSet");
			console.log(this.props.regionSet);
			let eastRegionSet = this.props.regionSet.filter((region)=>region.main_region === "동부")
			console.log("eastRegionSet");
			console.log(eastRegionSet);
			let eastRegionList = eastRegionSet.map((eachRegion)=>{
				return <div><Checkbox value={eachRegion.region} />{eachRegion.region}</div>
			});*/
			eastRegion = (
				<div className="detailRegion">
					<CheckboxGroup name="east_region" value={this.props.currentDetailRegions} onSelection={this.detailRegionChanged.bind(this)}>
						{Checkbox =>
							<div>
								<Checkbox value="동부" />동
								<Checkbox value="서부" />서
							</div>
						}
					</CheckboxGroup>
				</div>
			);
		}
		if(this.props.currentMainRegions.includes('서부'))
		{
			//let westRegionSet = this.props.regionSet.filter((region)=>region.main_region === "서부");
			//console.log("westRegionSet");
			//console.log(westRegionSet);
			/*
			let westRegionList = westRegionSet.map((eachRegion)=>{
				return <div><Checkbox value={eachRegion.region} />{eachRegion.region}</div>
			});*/
			westRegion = (
				<div className="detailRegion">
					<CheckboxGroup name="west_region" value={this.props.currentDetailRegions} onSelection={this.detailRegionChanged.bind(this)}>
						{Checkbox =>
							<div>
								<Checkbox value="망원동" />망원동
								<Checkbox value="연남동" />연남동
								<Checkbox value="연희동" />연희동
								<Checkbox value="합정" />합정
								<Checkbox value="홍대" />홍대
								<Checkbox value="신촌" />신촌
								<Checkbox value="이대앞" />이대앞
								<Checkbox value="상수" />상수
							</div>
						}
					</CheckboxGroup>
				</div>
			);	
		}
		if(this.props.currentMainRegions.includes('중부'))
		{
			centeralRegion = (
				<div className="detailRegion">
					<CheckboxGroup name="center_region" value={this.props.currentDetailRegions} onSelection={this.detailRegionChanged.bind(this)}>
						{Checkbox =>
							<div>
								<Checkbox value="해방촌" />해방촌
								<Checkbox value="보석길" />보석길
								<Checkbox value="경리단길" />경리단길
								<Checkbox value="한강진" />한강진
								<Checkbox value="이촌" />이촌
								<Checkbox value="이태원" />이태원
								<Checkbox value="우사단로" />우사단로
								<Checkbox value="독서당길" />독서당길
							</div>
						}
					</CheckboxGroup>
				</div>
			);
		}
		if(this.props.currentMainRegions.includes('남부'))
		{
			southRegion = (
				<div className="detailRegion">
					<CheckboxGroup name="south_region" value={this.props.currentDetailRegions} onSelection={this.detailRegionChanged.bind(this)}>
						{Checkbox =>
							<div>
								<Checkbox value="압구정역" />압구정역
								<Checkbox value="가로수길" />가로수길
								<Checkbox value="도산대로" />도산대로
								<Checkbox value="청담" />청담
								<Checkbox value="강남언덕길" />강남언덕길
								<Checkbox value="논현" />논현
								<Checkbox value="강남역" />강남역
								<Checkbox value="역삼역" />역삼역
								<Checkbox value="삼성역" />삼성역
							</div>
						}
					</CheckboxGroup>
				</div>
			);
		}
		if(this.props.currentMainRegions.includes('북부'))
		{
			northRegion = (
				<div className="detailRegion">
					<CheckboxGroup name="north_region" value={this.props.currentDetailRegions} onSelection={this.detailRegionChanged.bind(this)}>
						{Checkbox =>
							<div>
								<Checkbox value="부암동" />부암동
								<Checkbox value="서촌" />서촌
								<Checkbox value="북촌" />북촌
								<Checkbox value="성북동" />성북동
								<Checkbox value="대학로" />대학로
								<Checkbox value="광화문" />광화문
								<Checkbox value="삼청동" />삼청동
								<Checkbox value="시청" />시청
								<Checkbox value="명동" />명동
								<Checkbox value="인사동" />인사동
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
		let recommendCards = this.props.recommendcards.map((recommendcard) => {
			if(this.props.currentDetailRegions.includes(recommendcard.region))
				console.log(recommendcard.title);
			
			if(	
				this.props.currentCategory == recommendcard.category
				&& (this.props.currentDetailRegions.includes(recommendcard.region)		)
				&& (this.props.currentGenders.includes(recommendcard.gender.toString()) )
				)
			{
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
					<CheckboxGroup name="main_region" value={this.props.currentMainRegions} onSelection={this.mainRegionChanged.bind(this)}>
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
				{detailRegions}
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
	currentEvent: PropTypes.object,
	currentCategory: PropTypes.string,
	currentMainRegions: PropTypes.arrayOf(PropTypes.string),
	currentDetailRegions: PropTypes.arrayOf(PropTypes.string),
	currentGenders: PropTypes.arrayOf(PropTypes.string),
	regionSet: PropTypes.arrayOf(PropTypes.object),
	categoryCallBacks: PropTypes.object,
	connectDropTarget: PropTypes.func.isRequired,
	dndCallBacks: PropTypes.object
};

export default DropTarget(constants.RECOMMEND_CARD, listTargetSpec, collect)(RecommenderList);
