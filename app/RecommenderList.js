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

		//let centeralRegionSet = this.props.regionSet.filter((region)=>region.main_region === "중부");
		//let southRegionSet = this.props.regionSet.filter((region)=>region.main_region === "남부");
		//let northRegionSet = this.props.regionSet.filter((region)=>region.main_region === "북부");
		// Manager can see recommend card be filtering.
		// The card can not be see without checking.
		let eastRegion, westRegion, centeralRegion, southRegion, northRegion;
		if(this.props.currentMainRegions.includes('동부'))
		{	
			let regionCountsWSL = this.props.recommendcards.filter((card)=>(card.region === "왕십리" && card.category === this.props.currentCategory)).length;
			let regionCountsGD = this.props.recommendcards.filter((card)=>(card.region === "건대" && card.category === this.props.currentCategory)).length;
			
			eastRegion = (
				<div className="detailRegion">
					<CheckboxGroup name="east_region" value={this.props.currentDetailRegions} onSelection={this.detailRegionChanged.bind(this)}>
						{Checkbox =>
							<div>
								<Checkbox value="왕십리" />왕십리 ({regionCountsWSL})
								<Checkbox value="건대" />건대 ({regionCountsGD})
							</div>
						}
					</CheckboxGroup>
				</div>
			);
		}
		if(this.props.currentMainRegions.includes('서부'))
		{
			let regionCountsMY = this.props.recommendcards.filter((card)=>(card.region === "망원" && card.category === this.props.currentCategory)).length;
			let regionCountsYN = this.props.recommendcards.filter((card)=>(card.region === "연남동" && card.category === this.props.currentCategory)).length;
			let regionCountsYH = this.props.recommendcards.filter((card)=>(card.region === "연희동" && card.category === this.props.currentCategory)).length;
			let regionCountsHJ = this.props.recommendcards.filter((card)=>(card.region === "합정" && card.category === this.props.currentCategory)).length;
			let regionCountsHD = this.props.recommendcards.filter((card)=>(card.region === "홍대" && card.category === this.props.currentCategory)).length;
			let regionCountsSC = this.props.recommendcards.filter((card)=>(card.region === "신촌" && card.category === this.props.currentCategory)).length;
			let regionCountsYD = this.props.recommendcards.filter((card)=>(card.region === "이대앞" && card.category === this.props.currentCategory)).length;
			let regionCountsSS = this.props.recommendcards.filter((card)=>(card.region === "상수" && card.category === this.props.currentCategory)).length;
			
			westRegion = (
				<div className="detailRegion">
					<CheckboxGroup name="west_region" value={this.props.currentDetailRegions} onSelection={this.detailRegionChanged.bind(this)}>
						{Checkbox =>
							<div>
								<Checkbox value="망원" />망원 ({regionCountsMY})
								<Checkbox value="연남동" />연남동 ({regionCountsYN})
								<Checkbox value="연희동" />연희동 ({regionCountsYH})
								<Checkbox value="합정" />합정 ({regionCountsHJ})
								<Checkbox value="홍대" />홍대 ({regionCountsHD})
								<Checkbox value="신촌" />신촌 ({regionCountsSC})
								<Checkbox value="이대앞" />이대앞 ({regionCountsYD})
								<Checkbox value="상수" />상수 ({regionCountsSS})
							</div>
						}
					</CheckboxGroup>
				</div>
			);	
		}
		if(this.props.currentMainRegions.includes('중부'))
		{
			let regionCountsHBC = this.props.recommendcards.filter((card)=>(card.region === "해방촌" && card.category === this.props.currentCategory)).length;
			let regionCountsBSK = this.props.recommendcards.filter((card)=>(card.region === "보석길" && card.category === this.props.currentCategory)).length;
			let regionCountsGLD = this.props.recommendcards.filter((card)=>(card.region === "경리단길" && card.category === this.props.currentCategory)).length;
			let regionCountsHGJ = this.props.recommendcards.filter((card)=>(card.region === "한강진" && card.category === this.props.currentCategory)).length;
			let regionCountsIC = this.props.recommendcards.filter((card)=>(card.region === "이촌" && card.category === this.props.currentCategory)).length;
			let regionCountsITW = this.props.recommendcards.filter((card)=>(card.region === "이태원" && card.category === this.props.currentCategory)).length;
			let regionCountsUSD = this.props.recommendcards.filter((card)=>(card.region === "우사단로" && card.category === this.props.currentCategory)).length;
			let regionCountsDSD = this.props.recommendcards.filter((card)=>(card.region === "독서당길" && card.category === this.props.currentCategory)).length;

			centeralRegion = (
				<div className="detailRegion">
					<CheckboxGroup name="center_region" value={this.props.currentDetailRegions} onSelection={this.detailRegionChanged.bind(this)}>
						{Checkbox =>
							<div>
								<Checkbox value="해방촌" />해방촌 ({regionCountsHBC})
								<Checkbox value="보석길" />보석길 ({regionCountsBSK})
								<Checkbox value="경리단길" />경리단길 ({regionCountsGLD})
								<Checkbox value="한강진" />한강진 ({regionCountsHGJ})
								<Checkbox value="이촌" />이촌 ({regionCountsIC})
								<Checkbox value="이태원" />이태원 ({regionCountsITW})
								<Checkbox value="우사단로" />우사단로 ({regionCountsUSD})
								<Checkbox value="독서당길" />독서당길 ({regionCountsDSD})
							</div>
						}
					</CheckboxGroup>
				</div>
			);
		}
		if(this.props.currentMainRegions.includes('남부'))
		{
			let regionCountsAGJ = this.props.recommendcards.filter((card)=>(card.region === "압구정로데오" && card.category === this.props.currentCategory)).length;
			let regionCountsGRS = this.props.recommendcards.filter((card)=>(card.region === "가로수길" && card.category === this.props.currentCategory)).length;
			let regionCountsDSD = this.props.recommendcards.filter((card)=>(card.region === "도산대로" && card.category === this.props.currentCategory)).length;
			let regionCountsCD = this.props.recommendcards.filter((card)=>(card.region === "청담" && card.category === this.props.currentCategory)).length;
			let regionCountsGUD = this.props.recommendcards.filter((card)=>(card.region === "강남언덕길" && card.category === this.props.currentCategory)).length;
			let regionCountsNH = this.props.recommendcards.filter((card)=>(card.region === "논현" && card.category === this.props.currentCategory)).length;
			let regionCountsGN = this.props.recommendcards.filter((card)=>(card.region === "강남역" && card.category === this.props.currentCategory)).length;
			let regionCountsUS = this.props.recommendcards.filter((card)=>(card.region === "역삼역" && card.category === this.props.currentCategory)).length;
			let regionCountsSS = this.props.recommendcards.filter((card)=>(card.region === "삼성역" && card.category === this.props.currentCategory)).length;

			southRegion = (
				<div className="detailRegion">
					<CheckboxGroup name="south_region" value={this.props.currentDetailRegions} onSelection={this.detailRegionChanged.bind(this)}>
						{Checkbox =>
							<div>
								<Checkbox value="압구정로데오" />압구정로데오 ({regionCountsAGJ})
								<Checkbox value="가로수길" />가로수길 ({regionCountsGRS})
								<Checkbox value="도산대로" />도산대로 ({regionCountsDSD})
								<Checkbox value="청담" />청담 ({regionCountsCD})
								<Checkbox value="강남언덕길" />강남언덕길 ({regionCountsGUD})
								<Checkbox value="논현" />논현 ({regionCountsNH})
								<Checkbox value="강남역" />강남역 ({regionCountsGN})
								<Checkbox value="역삼역" />역삼역 ({regionCountsUS})
								<Checkbox value="삼성역" />삼성역 ({regionCountsSS})
							</div>
						}
					</CheckboxGroup>
				</div>
			);
		}
		if(this.props.currentMainRegions.includes('북부'))
		{
			let regionCountsBU = this.props.recommendcards.filter((card)=>(card.region === "부암동" && card.category === this.props.currentCategory)).length;
			let regionCountsSC = this.props.recommendcards.filter((card)=>(card.region === "서촌" && card.category === this.props.currentCategory)).length;
			let regionCountsBC = this.props.recommendcards.filter((card)=>(card.region === "북촌" && card.category === this.props.currentCategory)).length;
			let regionCountsSB = this.props.recommendcards.filter((card)=>(card.region === "성북동" && card.category === this.props.currentCategory)).length;
			let regionCountsDH = this.props.recommendcards.filter((card)=>(card.region === "대학로" && card.category === this.props.currentCategory)).length;
			let regionCountsGH = this.props.recommendcards.filter((card)=>(card.region === "광화문" && card.category === this.props.currentCategory)).length;
			let regionCountsSCH = this.props.recommendcards.filter((card)=>(card.region === "삼청동" && card.category === this.props.currentCategory)).length;
			let regionCountsSIC = this.props.recommendcards.filter((card)=>(card.region === "시청" && card.category === this.props.currentCategory)).length;
			let regionCountsMD = this.props.recommendcards.filter((card)=>(card.region === "명동" && card.category === this.props.currentCategory)).length;
			let regionCountsIS = this.props.recommendcards.filter((card)=>(card.region === "인사동" && card.category === this.props.currentCategory)).length;

			northRegion = (
				<div className="detailRegion">
					<CheckboxGroup name="north_region" value={this.props.currentDetailRegions} onSelection={this.detailRegionChanged.bind(this)}>
						{Checkbox =>
							<div>
								<Checkbox value="부암동" />부암동 ({regionCountsBU})
								<Checkbox value="서촌" />서촌 ({regionCountsSC})
								<Checkbox value="북촌" />북촌 ({regionCountsBC})
								<Checkbox value="성북동" />성북동 ({regionCountsSB})
								<Checkbox value="대학로" />대학로 ({regionCountsDH})
								<Checkbox value="광화문" />광화문 ({regionCountsGH})
								<Checkbox value="삼청동" />삼청동 ({regionCountsSCH})
								<Checkbox value="시청" />시청 ({regionCountsSIC})
								<Checkbox value="명동" />명동 ({regionCountsMD})
								<Checkbox value="인사동" />인사동 ({regionCountsIS})
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
							mainRegion={recommendcard.main_region}
							deepUrl={recommendcard.deep_url}
							ImgUrl={recommendcard.img_url}
							hashtags={recommendcard.tagNames}
							recommendCount={recommendcard.reco_cnt}
							dndCallBacks={this.props.dndCallBacks}
							{...recommendcard} />
				}
				else if(this.props.userInputHashTag === ''){
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
						<Radio value="restaurant" />레스토랑
						<Radio value="cafe"/>카페
						<Radio value="place"/>플레이스
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
	userInputHashTag: PropTypes.string
};

export default DropTarget(constants.RECOMMEND_CARD, listTargetSpec, collect)(RecommenderList);