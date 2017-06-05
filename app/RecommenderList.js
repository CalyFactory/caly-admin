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
			let regionCountsWSL = this.props.recommendcards.filter((card)=>(card.region === "왕십리역" && card.category === this.props.currentCategory)).length;
			let regionCountsGD = this.props.recommendcards.filter((card)=>(card.region === "건대입구역" && card.category === this.props.currentCategory)).length;
			let regionCountsGJ = this.props.recommendcards.filter((card)=>(card.region === "군자역" && card.category === this.props.currentCategory)).length;
			let regionCountsDDS = this.props.recommendcards.filter((card)=>(card.region === "뚝섬역" && card.category === this.props.currentCategory)).length;
			let regionCountsDDSYWJ = this.props.recommendcards.filter((card)=>(card.region === "뚝섬유원지역" && card.category === this.props.currentCategory)).length;
			let regionCountsSWSL = this.props.recommendcards.filter((card)=>(card.region === "상왕십리역" && card.category === this.props.currentCategory)).length;
			let regionCountsSUS = this.props.recommendcards.filter((card)=>(card.region === "서울숲역" && card.category === this.props.currentCategory)).length;
			let regionCountsURLDGW = this.props.recommendcards.filter((card)=>(card.region === "어린이대공원역" && card.category === this.props.currentCategory)).length;
			let regionCountsHYD = this.props.recommendcards.filter((card)=>(card.region === "한양대역" && card.category === this.props.currentCategory)).length;
			
			
			eastRegion = (
				<div className="detailRegion">
					<CheckboxGroup name="east_region" value={this.props.currentDetailRegions} onSelection={this.detailRegionChanged.bind(this)}>
						{Checkbox =>
							<div>
								<label><Checkbox value="왕십리역" />왕십리역 ({regionCountsWSL})</label>
								<label><Checkbox value="건대입구역" />건대입구역 ({regionCountsGD})</label>
								<label><Checkbox value="군자역" />군자역 ({regionCountsGJ})</label>
								<label><Checkbox value="뚝섬역" />뚝섬역 ({regionCountsDDS})</label>
								<label><Checkbox value="뚝섬유원지역" />뚝섬유원지역 ({regionCountsDDSYWJ})</label>
								<label><Checkbox value="상왕십리역" />상왕십리역 ({regionCountsSWSL})</label>
								<label><Checkbox value="서울숲역" />서울숲역 ({regionCountsSUS})</label>
								<label><Checkbox value="어린이대공원역" />어린이대공원역 ({regionCountsURLDGW})</label>
								<label><Checkbox value="한양대역" />한양대역 ({regionCountsHYD})</label>
							</div>
						}
					</CheckboxGroup>
				</div>
			);
		}
		if(this.props.currentMainRegions.includes('서부'))
		{
			let regionCountsMY = this.props.recommendcards.filter((card)=>(card.region === "망원역" && card.category === this.props.currentCategory)).length;
			let regionCountsGJ = this.props.recommendcards.filter((card)=>(card.region === "가좌역" && card.category === this.props.currentCategory)).length;
			let regionCountsNRJ = this.props.recommendcards.filter((card)=>(card.region === "노량진역" && card.category === this.props.currentCategory)).length;
			let regionCountsGHWSD = this.props.recommendcards.filter((card)=>(card.region === "국회의사당역" && card.category === this.props.currentCategory)).length;
			let regionCountsSS = this.props.recommendcards.filter((card)=>(card.region === "상수역" && card.category === this.props.currentCategory)).length;
			let regionCountsSCGC = this.props.recommendcards.filter((card)=>(card.region === "신촌기차역" && card.category === this.props.currentCategory)).length;
			let regionCountsSC = this.props.recommendcards.filter((card)=>(card.region === "신촌역" && card.category === this.props.currentCategory)).length;
			let regionCountsYWNR = this.props.recommendcards.filter((card)=>(card.region === "여의나루역" && card.category === this.props.currentCategory)).length;
			let regionCountsYWD = this.props.recommendcards.filter((card)=>(card.region === "여의도역" && card.category === this.props.currentCategory)).length;
			let regionCountsED = this.props.recommendcards.filter((card)=>(card.region === "이대역" && card.category === this.props.currentCategory)).length;
			let regionCountsHJ = this.props.recommendcards.filter((card)=>(card.region === "합정역" && card.category === this.props.currentCategory)).length;
			let regionCountsHDIG = this.props.recommendcards.filter((card)=>(card.region === "홍대입구역" && card.category === this.props.currentCategory)).length;

			westRegion = (
				<div className="detailRegion">
					<CheckboxGroup name="west_region" value={this.props.currentDetailRegions} onSelection={this.detailRegionChanged.bind(this)}>
						{Checkbox =>
							<div>
								<label><Checkbox value="망원역" />망원역 ({regionCountsMY})</label>
								<label><Checkbox value="가좌역" />가좌역 ({regionCountsGJ})</label>
								<label><Checkbox value="노량진역" />노량진역 ({regionCountsNRJ})</label>
								<label><Checkbox value="국회의사당역" />국회의사당역 ({regionCountsGHWSD})</label>
								<label><Checkbox value="상수역" />상수역 ({regionCountsSS})</label>
								<label><Checkbox value="신촌기차역" />신촌기차역 ({regionCountsSCGC})</label>
								<label><Checkbox value="신촌역" />신촌역 ({regionCountsSC})</label>
								<label><Checkbox value="여의나루역" />여의나루역 ({regionCountsYWNR})</label>
								<label><Checkbox value="여의도역" />여의도역 ({regionCountsYWD})</label>
								<label><Checkbox value="이대역" />이대역 ({regionCountsED})</label>
								<label><Checkbox value="합정역" />합정역 ({regionCountsHJ})</label>
								<label><Checkbox value="홍대입구역" />홍대입구역 ({regionCountsHDIG})</label>
							</div>
						}
					</CheckboxGroup>
				</div>
			);	
		}
		if(this.props.currentMainRegions.includes('중부'))
		{
			let regionCountsHBC = this.props.recommendcards.filter((card)=>(card.region === "녹사평역" && card.category === this.props.currentCategory)).length;
			let regionCountsBSK = this.props.recommendcards.filter((card)=>(card.region === "숙대입구역" && card.category === this.props.currentCategory)).length;
			let regionCountsGLD = this.props.recommendcards.filter((card)=>(card.region === "여의나루역" && card.category === this.props.currentCategory)).length;
			let regionCountsHGJ = this.props.recommendcards.filter((card)=>(card.region === "이촌역" && card.category === this.props.currentCategory)).length;
			let regionCountsIC = this.props.recommendcards.filter((card)=>(card.region === "한강진역" && card.category === this.props.currentCategory)).length;
			let regionCountsITW = this.props.recommendcards.filter((card)=>(card.region === "이태원역" && card.category === this.props.currentCategory)).length;
			let regionCountsHN = this.props.recommendcards.filter((card)=>(card.region === "한남역" && card.category === this.props.currentCategory)).length;

			centeralRegion = (
				<div className="detailRegion">
					<CheckboxGroup name="center_region" value={this.props.currentDetailRegions} onSelection={this.detailRegionChanged.bind(this)}>
						{Checkbox =>
							<div>
								<label><Checkbox value="녹사평역" />녹사평역 ({regionCountsHBC})</label>
								<label><Checkbox value="숙대입구역" />숙대입구역 ({regionCountsBSK})</label>
								<label><Checkbox value="여의나루역" />여의나루역 ({regionCountsGLD})</label>
								<label><Checkbox value="이촌역" />이촌역 ({regionCountsHGJ})</label>
								<label><Checkbox value="한강진역" />한강진역 ({regionCountsIC})</label>
								<label><Checkbox value="이태원역" />이태원역 ({regionCountsITW})</label>
								<label><Checkbox value="한남역" />한남역 ({regionCountsHN})</label>
							</div>
						}
					</CheckboxGroup>
				</div>
			);
		}
		if(this.props.currentMainRegions.includes('남부'))
		{
			let regionCountsGNGC = this.props.recommendcards.filter((card)=>(card.region === "강남구청역" && card.category === this.props.currentCategory)).length;
			let regionCountsGN = this.props.recommendcards.filter((card)=>(card.region === "강남역" && card.category === this.props.currentCategory)).length;
			let regionCountsGTMN = this.props.recommendcards.filter((card)=>(card.region === "고속터미널역" && card.category === this.props.currentCategory)).length;
			let regionCountsGD = this.props.recommendcards.filter((card)=>(card.region === "교대역" && card.category === this.props.currentCategory)).length;
			let regionCountsNH = this.props.recommendcards.filter((card)=>(card.region === "논현역" && card.category === this.props.currentCategory)).length;
			let regionCountsMB = this.props.recommendcards.filter((card)=>(card.region === "매봉역" && card.category === this.props.currentCategory)).length;
			let regionCountsBES = this.props.recommendcards.filter((card)=>(card.region === "봉은사역" && card.category === this.props.currentCategory)).length;
			let regionCountsSD = this.props.recommendcards.filter((card)=>(card.region === "사당역" && card.category === this.props.currentCategory)).length;
			let regionCountsSS = this.props.recommendcards.filter((card)=>(card.region === "삼성역" && card.category === this.props.currentCategory)).length;
			let regionCountsSSNA = this.props.recommendcards.filter((card)=>(card.region === "삼성중앙역" && card.category === this.props.currentCategory)).length;
			let regionCountsSC = this.props.recommendcards.filter((card)=>(card.region === "서초역" && card.category === this.props.currentCategory)).length;
			let regionCountsCHN = this.props.recommendcards.filter((card)=>(card.region === "석촌역" && card.category === this.props.currentCategory)).length;
			let regionCountsSL = this.props.recommendcards.filter((card)=>(card.region === "선릉역" && card.category === this.props.currentCategory)).length;
			let regionCountsSJR = this.props.recommendcards.filter((card)=>(card.region === "선정릉역" && card.category === this.props.currentCategory)).length;
			let regionCountsSNH = this.props.recommendcards.filter((card)=>(card.region === "신논현역" && card.category === this.props.currentCategory)).length;
			let regionCountsSSA = this.props.recommendcards.filter((card)=>(card.region === "신사역" && card.category === this.props.currentCategory)).length;
			let regionCountsAGJRDO = this.props.recommendcards.filter((card)=>(card.region === "압구정로데오역" && card.category === this.props.currentCategory)).length;
			let regionCountsAGJ = this.props.recommendcards.filter((card)=>(card.region === "압구정역" && card.category === this.props.currentCategory)).length;
			let regionCountsAJ = this.props.recommendcards.filter((card)=>(card.region === "양재역" && card.category === this.props.currentCategory)).length;
			let regionCountsYNJ = this.props.recommendcards.filter((card)=>(card.region === "언주역" && card.category === this.props.currentCategory)).length;
			let regionCountsYS = this.props.recommendcards.filter((card)=>(card.region === "역삼역" && card.category === this.props.currentCategory)).length;
			let regionCountsYIS = this.props.recommendcards.filter((card)=>(card.region === "이수역" && card.category === this.props.currentCategory)).length;
			let regionCountsJSSN = this.props.recommendcards.filter((card)=>(card.region === "잠실새내역" && card.category === this.props.currentCategory)).length;
			let regionCountsJS = this.props.recommendcards.filter((card)=>(card.region === "잠실역" && card.category === this.props.currentCategory)).length;
			let regionCountsJHUDJ = this.props.recommendcards.filter((card)=>(card.region === "종합운동장역" && card.category === this.props.currentCategory)).length;
			let regionCountsCD = this.props.recommendcards.filter((card)=>(card.region === "청담역" && card.category === this.props.currentCategory)).length;
			let regionCountsHD = this.props.recommendcards.filter((card)=>(card.region === "학동역" && card.category === this.props.currentCategory)).length;
			let regionCountsHS = this.props.recommendcards.filter((card)=>(card.region === "흑석역" && card.category === this.props.currentCategory)).length;

			southRegion = (
				<div className="detailRegion">
					<CheckboxGroup name="south_region" value={this.props.currentDetailRegions} onSelection={this.detailRegionChanged.bind(this)}>
						{Checkbox =>
							<div>
								<label><Checkbox value="강남구청역" />강남구청역 ({regionCountsGNGC})</label>
								<label><Checkbox value="강남역" />강남역 ({regionCountsGN})</label>
								<label><Checkbox value="고속터미널역" />고속터미널역 ({regionCountsGTMN})</label>
								<label><Checkbox value="교대역" />교대역 ({regionCountsGD})</label>
								<label><Checkbox value="논현역" />논현역 ({regionCountsNH})</label>
								<label><Checkbox value="매봉역" />매봉역 ({regionCountsMB})</label>
								<label><Checkbox value="봉은사역" />봉은사역 ({regionCountsBES})</label>
								<label><Checkbox value="사당역" />사당역 ({regionCountsSD})</label>
								<label><Checkbox value="삼성역" />삼성역 ({regionCountsSS})</label>
								<label><Checkbox value="삼성중앙역" />삼성중앙역 ({regionCountsSSNA})</label>
								<label><Checkbox value="서초역" />서초역 ({regionCountsSC})</label>
								<label><Checkbox value="석촌역" />석촌역 ({regionCountsCHN})</label>
								<label><Checkbox value="선릉역" />선릉역 ({regionCountsSL})</label>
								<label><Checkbox value="선정릉역" />선정릉역 ({regionCountsSJR})</label>
								<label><Checkbox value="신논현역" />신논현역 ({regionCountsSNH})</label>
								<label><Checkbox value="신사역" />신사역 ({regionCountsSSA})</label>
								<label><Checkbox value="압구정로데오역" />압구정로데오역 ({regionCountsAGJRDO})</label>
								<label><Checkbox value="압구정역" />압구정역 ({regionCountsAGJ})</label>
								<label><Checkbox value="양재역" />양재역 ({regionCountsAJ})</label>
								<label><Checkbox value="언주역" />언주역 ({regionCountsYNJ})</label>
								<label><Checkbox value="역삼역" />역삼역 ({regionCountsYS})</label>
								<label><Checkbox value="이수역" />이수역 ({regionCountsYIS})</label>
								<label><Checkbox value="잠실새내역" />잠실새내역 ({regionCountsJSSN})</label>
								<label><Checkbox value="잠실역" />잠실역 ({regionCountsJS})</label>
								<label><Checkbox value="종합운동장역" />종합운동장역 ({regionCountsJHUDJ})</label>
								<label><Checkbox value="청담역" />청담역 ({regionCountsCD})</label>
								<label><Checkbox value="학동역" />학동역 ({regionCountsHD})</label>
								<label><Checkbox value="흑석역" />흑석역 ({regionCountsHS})</label>
							</div>
						}
					</CheckboxGroup>
				</div>
			);
		}
		if(this.props.currentMainRegions.includes('북부'))
		{
			let regionCountsGBG = this.props.recommendcards.filter((card)=>(card.region === "경복궁역" && card.category === this.props.currentCategory)).length;
			let regionCountsGWM = this.props.recommendcards.filter((card)=>(card.region === "광화문역" && card.category === this.props.currentCategory)).length;
			let regionCountsGU = this.props.recommendcards.filter((card)=>(card.region === "길음역" && card.category === this.props.currentCategory)).length;
			let regionCountsDRM = this.props.recommendcards.filter((card)=>(card.region === "독립문역" && card.category === this.props.currentCategory)).length;
			let regionCountsDMA = this.props.recommendcards.filter((card)=>(card.region === "동묘앞역" && card.category === this.props.currentCategory)).length;
			let regionCountsMD = this.props.recommendcards.filter((card)=>(card.region === "명동역" && card.category === this.props.currentCategory)).length;
			let regionCountsSC = this.props.recommendcards.filter((card)=>(card.region === "시청역" && card.category === this.props.currentCategory)).length;
			let regionCountsAG = this.props.recommendcards.filter((card)=>(card.region === "안국역" && card.category === this.props.currentCategory)).length;
			let regionCountsUJRIG = this.props.recommendcards.filter((card)=>(card.region === "을지로입구역" && card.category === this.props.currentCategory)).length;
			let regionCountsJK = this.props.recommendcards.filter((card)=>(card.region === "종각역" && card.category === this.props.currentCategory)).length;
			let regionCountsJR3 = this.props.recommendcards.filter((card)=>(card.region === "종로3가역" && card.category === this.props.currentCategory)).length;
			let regionCountsJR5 = this.props.recommendcards.filter((card)=>(card.region === "종로5가역" && card.category === this.props.currentCategory)).length;
			let regionCountsHSDIG = this.props.recommendcards.filter((card)=>(card.region === "한성대입구역" && card.category === this.props.currentCategory)).length;
			let regionCountsHH = this.props.recommendcards.filter((card)=>(card.region === "혜화역" && card.category === this.props.currentCategory)).length;
			let regionCountsHJ = this.props.recommendcards.filter((card)=>(card.region === "홍제역" && card.category === this.props.currentCategory)).length;
			let regionCountsHHY = this.props.recommendcards.filter((card)=>(card.region === "회현역" && card.category === this.props.currentCategory)).length;
			let regionCountsWG = this.props.recommendcards.filter((card)=>(card.region === "월곡역" && card.category === this.props.currentCategory)).length;

			northRegion = (
				<div className="detailRegion">
					<CheckboxGroup name="north_region" value={this.props.currentDetailRegions} onSelection={this.detailRegionChanged.bind(this)}>
						{Checkbox =>
							<div>
								<label><Checkbox value="경복궁역" />경복궁역 ({regionCountsGBG})</label>
								<label><Checkbox value="광화문역" />광화문역 ({regionCountsGWM})</label>
								<label><Checkbox value="길음역" />길음역 ({regionCountsGU})</label>
								<label><Checkbox value="독립문역" />독립문역 ({regionCountsDRM})</label>
								<label><Checkbox value="동묘앞역" />동묘앞역 ({regionCountsDMA})</label>
								<label><Checkbox value="명동역" />명동역 ({regionCountsMD})</label>
								<label><Checkbox value="시청역" />시청역 ({regionCountsSC})</label>
								<label><Checkbox value="안국역" />안국역 ({regionCountsAG})</label>
								<label><Checkbox value="을지로입구역" />을지로입구역 ({regionCountsUJRIG})</label>
								<label><Checkbox value="종각역" />종각역 ({regionCountsJK})</label>
								<label><Checkbox value="종로3가역" />종로3가역 ({regionCountsJR3})</label>
								<label><Checkbox value="종로5가역" />종로5가역 ({regionCountsJR5})</label>
								<label><Checkbox value="한성대입구역" />한성대입구역 ({regionCountsHSDIG})</label>
								<label><Checkbox value="혜화역" />혜화역 ({regionCountsHH})</label>
								<label><Checkbox value="홍제역" />홍제역 ({regionCountsHJ})</label>
								<label><Checkbox value="회현역" />회현역 ({regionCountsHHY})</label>
								<label><Checkbox value="월곡역" />월곡역 ({regionCountsWG})</label>
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