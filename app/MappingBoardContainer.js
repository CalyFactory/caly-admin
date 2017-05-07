import React, { Component , PropTypes } from 'react';
import MappingBoard from './MappingBoard';
import UserCard from './UserCard';
import EventCard from './EventCard';
import {throttle} from './utils';
import update from 'react-addons-update';
import 'whatwg-fetch';
import 'babel-polyfill';

class MappingBoardContainer extends Component {
  constructor(){
    super(...arguments);
    this.state = {
      usercards   :[],
      eventcards  :[],
      recommendcards    :[],
      notrecommendevents:[],
      currentUser :new UserCard(),
      currentEvent:new EventCard(),
      currentCategory   :"restaurant",
      currentMainRegions:[],
      currentDetailRegions:[],
      detailRegionCounts:[],
      currentGenders    :[],
      theOthersAdmin    :[],
      regionSet:[],
      currentCommitRecommendCount : 0,
      currentMappingCount : 0,
      currentMappingCountCategoryRest : 0,
      currentMappingCountCategoryCafe : 0,
      currentMappingCountCategoryPlace: 0,
      userInputHashTag : ''
    };

    this.updateCardStatus   = throttle(this.updateCardStatus.bind(this));
    this.updateCardPosition = throttle(this.updateCardPosition.bind(this),500);

  }
  
  componentDidMount(){
    // Recommend List up from DB
    fetch('/all-recommend',{
      method: 'get',
      dataType: 'json',
      headers:{
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then((response) => response.json())
    .then((responseData) => {
      let length = responseData.length;

      for(let i=0; i<length; i++){
        responseData[i].status="recommender";
        
      }
      this.setState({recommendcards : responseData});
    })
    .catch((error)=>{
      console.log('Error fetching all-recommend',error);
    });

    // User List up
    fetch('/all-users',{
      method: 'get',
      dataType: 'json',
      headers:{
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then((response) => response.json())
    .then((responseData) => {
      let length = responseData.length;
      
      for(let i=0; i<length; i++)
        responseData[i].status="ready";

      this.setState({usercards : responseData});
    })
    .catch((error)=>{
      console.log('Error fetching all-users',error);
    });

    

    // Current Admin List fetch
    this.loadAdminList();

    // Get Detail region by main region
    fetch('/all-region',{
      method: 'get',
      dataType: 'json',
      headers:{
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then((response) => response.json())
    .then((responseData) => {
      console.log(responseData);
      this.setState({regionSet : responseData});
    })
    .catch((error)=>{
      console.log('Error fetching admin-regions',error);
    });   

    // Recommend Set status for "ready"
  }

  initRecommendStatus(flag = 0){
    console.log("initRecommendStatus : "+flag);
    let length = this.state.recommendcards.length;
    let recommendList={};

    for(let i=0 ; i<length ; i++){
      recommendList[i]={
          status: { $set: "recommender" }
      }
    }
    
    // flag == 1 : 추천 매핑 후, 현재 이벤트의 상태 3으로 변경
    if(flag === 1){
      let eventIndex = this.findEventIndex(this.state.currentEvent.event_hashkey);
      
      if(eventIndex == -1)
      {
        console.log('error event index during set complete mapping');
        return;
      }


      this.setState(
        update(
          this.state,{
            eventcards: {
              [eventIndex]: {
                reco_state: {$set:3}
              }
            },
            recommendcards    : recommendList,
            currentCategory   : { $set:"restaurant" },
            currentMainRegions: { $set:[] },
            currentDetailRegions: { $set:[] },
            detailRegionCounts: { $set:[] },
            currentGenders    : { $set:[] },
            currentEvent      : { $set: new EventCard() },
            currentMappingCount: { $set: 0 },
            currentCommitRecommendCount     : { $set: this.state.currentCommitRecommendCount+1 },
            currentMappingCountCategoryRest : { $set: 0 },
            currentMappingCountCategoryCafe : { $set: 0 },
            currentMappingCountCategoryPlace: { $set: 0 }
          }
      ));
    }
    else {
      this.setState(
        update(
          this.state,{
            recommendcards    : recommendList,
            currentCategory   : { $set:"restaurant" },
            currentMainRegions: { $set:[] },
            currentDetailRegions: { $set:[] },
            detailRegionCounts: { $set:[] },
            currentGenders    : { $set:[] },
            currentMappingCount: { $set: 0 },
            currentMappingCountCategoryRest   : { $set: 0 },
            currentMappingCountCategoryCafe   : { $set: 0 },
            currentMappingCountCategoryPlace  : { $set: 0 }
          }
      ));
    }
  }

  loadDBRecommendStatus(selectedEventHashkey){
    let didRecoJson = {};
    let mappingCountRest = 0;
    let mappingCountCafe = 0;
    let mappingCountPlace = 0;

    fetch('/did-mapping-reco?event_hashkey='+selectedEventHashkey,{
      method: 'GET',
      dataType: 'json',
      headers:{
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then((response) => response.json())
    .then((responseData) => {
      didRecoJson     = responseData;
      let didLength   = didRecoJson.length;
      let didRecoList = [];

      for(let i=0; i<didLength; i++){
        let recommendIndex = this.findRecommendIndex(didRecoJson[i].reco_hashkey);

        if(recommendIndex == -1)
          continue;

        didRecoList.push(recommendIndex);
      }
      let length = this.state.recommendcards.length;
      let recommendList={};
      for(let i=0 ; i<length ; i++){

        if(didRecoList.includes(i)){
          recommendList[i]={
              status: { $set: "recommendee" }
          }
          if (this.state.recommendcards[i].category.toString() === "restaurant")
            mappingCountRest++;
          else if(this.state.recommendcards[i].category.toString() === "cafe")
            mappingCountCafe++;
          else if(this.state.recommendcards[i].category.toString() === "place")
            mappingCountPlace++;
          else;
        }
        else{  
          recommendList[i]={
              status: { $set: "recommender" }
          }
        }

      }

      this.setState(
        update(
          this.state,{
            recommendcards:recommendList,
            currentCategory:{ $set:"restaurant" },
            currentMainRegions:{ $set:[] },
            currentDetailRegions:{ $set:[] },
            detailRegionCounts:{ $set:[] },
            currentGenders:{ $set:[] },
            currentMappingCount: { $set: 0 },
            currentMappingCountCategoryRest: { $set: mappingCountRest },
            currentMappingCountCategoryCafe: { $set: mappingCountCafe },
            currentMappingCountCategoryPlace: { $set: mappingCountPlace }
          }
      ));
    })
    .catch((error)=>{
      console.log('Error fetching reco-hash', error);
    });


  }

  // Set current user. using flag for event list
  updateEventList(userAccountHashkey,createDateTime){
    let userIndex = this.findUserIndex(userAccountHashkey);

    if(userIndex == -1)
      return;
    
    fetch(`/all-events?accountHashkey=`+userAccountHashkey+`&createDateTime=`+createDateTime,{
      method: 'get',
      dataType: 'json',
      headers:{
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then((response) => response.json())
    .then((responseData) => {
      
      let length = responseData.length;
      
      // CR : 반대로 해서 되는 이유 ?
      this.state.eventcards?
      this.setState({
        currentUser : this.state.usercards[userIndex],
        eventcards  : responseData,
        currentEvent: new EventCard()
      })
      :this.setState({
        currentUser : this.state.usercards[userIndex],
        eventcards  : update(this.state.eventcards, responseData),
        currentEvent: new EventCard()
      });
    })
    .catch((error)=>{
      console.log('Error fetching all-events',error);
    });

    // Request sync admin
    let sendCurrentAdmin ={
      admin:this.props.adminId,
      select_user:userAccountHashkey
    };
    fetch(`/current-admin`,{
      method: 'POST',
      dataType: 'json',
      headers:{
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body:JSON.stringify(sendCurrentAdmin)
    })
    
  }

  // Set current status from selectedCategory.
  // Input from Recommenderlist, Output to RecommendeeList tap
  selectCategory(selectedCategory){
    this.setState({currentCategory:selectedCategory});
  }
  selectDetailRegions(selectedDetailRegions){
    let inputs  = [];
    let items   = selectedDetailRegions.toString().split(',');

    for ( let i in items)
    {
      inputs.push(items[i].toString());
    }
    this.setState({currentDetailRegions:inputs});
  }
  selectMainRegions(selectedMainRegions){
    let inputs  = [];
    let items   = selectedMainRegions.toString().split(',');

    for ( let i in items)
    {
      inputs.push(items[i].toString());
    }
    this.setState({currentMainRegions:inputs});
  }
  selectGenders(selectedGenders){
    let inputs = [];
    //console.log("selectedGenders is "+selectedGenders);
    let items=selectedGenders.toString().split(',');
    for ( let i in items)
    {
      inputs.push(items[i].toString());
    }
    //console.log("selecteGenders inputs is "+inputs);
    this.setState({currentGenders:inputs});
  }
  inputUserHashTag(searchItem){
    this.setState({userInputHashTag:searchItem});
  }
  // Print, clicked event
  selectEvent(selectedEventHashkey){
    let eventIndex = this.findEventIndex(selectedEventHashkey);
    if(eventIndex == -1)
      return;

    if(this.state.currentUser.mapping_state === 2)
      this.loadDBRecommendStatus(selectedEventHashkey);
    else
      this.initRecommendStatus();

    this.setState({currentEvent:this.state.eventcards[eventIndex]});
  }

  findUserIndex(userAccountHashKey){
    let userIndex = -1;
    let length    = this.state.usercards.length;

    for(let i=0; i<length ; i++)
    {
      if(this.state.usercards[i].account_hashkey == userAccountHashKey)
        return i;
    }
    return userIndex;
  }

  findEventIndex(eventHashKey){
    let eventIndex  = -1;
    let length      = this.state.eventcards.length;
    let cnt = 0;

    for(let i=0; i<length; i++)
    {
      if(this.state.eventcards[i].event_hashkey == eventHashKey)
        return i;
    }
    
    return eventIndex;
  }

  tempPrint(){
    console.log(this.state);
  }

  loadAdminList(){
    fetch('/current-admin-list',{
      method: 'GET',
      dataType: 'json',
      headers:{
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then((response) => response.json())
    .then((responseData) => {
      let length = Object.keys(responseData).length;
      let AdminList = [];

      console.log("AdminList");
      console.log("AL count : "+length);
      if( length>0 ){
        for(let i=0 ; i<length ; i++ ){
          if(Object.keys(responseData)[i].toString() === this.props.adminId){
            continue;
          }

          console.log(Object.keys(responseData)[i]);
          AdminList.push(responseData[Object.keys(responseData)[i]]);
        }
      }

      this.setState({theOthersAdmin : AdminList});
    })

    fetch('/all-users',{
      method: 'get',
      dataType: 'json',
      headers:{
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then((response) => response.json())
    .then((responseData) => {
      console.log('user count is '+responseData.length);
      let length = responseData.length;
      
      for(let i=0; i<length; i++)
        responseData[i].status="ready";

      this.setState({usercards : responseData});
    })
    .catch((error)=>{
      console.log('Error fetching all-users',error);
    });

    this.initRecommendStatus();
  }

  // Commit to event-recommend join table
  commitRecommend(){
    // if modified users, will need different datetime
    let createDateTimeDB = this.state.currentUser.create_datetime;
    let cdt = createDateTimeDB.split('T');
    let ctd = cdt[0].split('-');
    let cttt = cdt[1].split('.');
    let ctt = cttt[0].split(':');
    
    let eventDTT= ctd[0]+','+ctd[1]+','+ctd[2]+','+ctt;
    let eventDT = eventDTT.split(',');
    let eventDate=new Date(parseInt(eventDT[0]),parseInt(eventDT[1])-1,parseInt(eventDT[2]),parseInt(eventDT[3]),parseInt(eventDT[4]),parseInt(eventDT[5]),0);
    
    let date = new Date();
    let diffBetweenTimes = ((date.getTime() - eventDate.getTime()) / 1000 / 60)-540;
    let diffBetweenMinutes = Math.abs(Math.round(diffBetweenTimes));

    let commitUser  = this.state.currentUser.user_hashkey;
    let commitCards = this.state.recommendcards.filter((card)=>card.status === "recommendee");
    let recoList    = []

    // Push recommendcard to list
    for(let i=0; i<commitCards.length; i++)
    {
      recoList.push(commitCards[i].reco_hashkey);
    }

    // Fetch API call from react to server/main.js
    // server/main.js에 react에서 fetch로 API 콜요청
    let recommendEvent={
      'user_hashkey'      : commitUser,
      'event_hashkey'     : this.state.currentEvent.event_hashkey,
      'reco_hashkey_list' : recoList,
      'update_flag'       : this.state.currentUser.mapping_state === 2? 1 : 0,
      'register'          : this.props.adminName,
      'react_times'       : diffBetweenMinutes
    };

    fetch('/commit-recommend',{
      method: 'POST',
      headers:{
        'Content-Type' : 'application/json'
      },
      body: JSON.stringify(recommendEvent)
    })

    // 추천종료 후, 현재 이벤트들 상태 3으로 변경
    this.initRecommendStatus(1);
  }

  // Commit to event table
  completeRecommend(notRecommendEvents){
    console.log("completeRecommend : "+notRecommendEvents);

    // if modified users, will need different datetime
    let createDateTimeDB = this.state.currentUser.create_datetime;
    let cdt = createDateTimeDB.split('T');
    let ctd = cdt[0].split('-');
    let cttt = cdt[1].split('.');
    let ctt = cttt[0].split(':');
    
    let eventDTT= ctd[0]+','+ctd[1]+','+ctd[2]+','+ctt;
    let eventDT = eventDTT.split(',');
    let eventDate=new Date(parseInt(eventDT[0]),parseInt(eventDT[1])-1,parseInt(eventDT[2]),parseInt(eventDT[3]),parseInt(eventDT[4]),parseInt(eventDT[5]),0);
    
    let date = new Date();
    let diffBetweenTimes = ((date.getTime() - eventDate.getTime()) / 1000 / 60)-540;
    let diffBetweenMinutes = Math.abs(Math.round(diffBetweenTimes));
    // update DB 
    let notRecommendEventBody={
      'event_hashkey_list': notRecommendEvents,
      'user_hashkey'      : this.state.currentUser.user_hashkey,
      'account_hashkey'   : this.state.currentUser.account_hashkey,
      'update_flag'       : this.state.currentUser.mapping_state === 2? 1 : 0,
      'register'          : this.props.adminName,
      'react_times'       : diffBetweenMinutes
    };

    fetch('/complete-recommend',{
      method: 'POST',
      headers:{
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(notRecommendEventBody)
    })

    //Usercard status update "ready" to "done"
    let userCardIndex = this.findUserIndex(this.state.currentUser.account_hashkey);
    let userCard = this.state.usercards[userCardIndex]
    
    this.setState(update(this.state, {
        usercards: {
          [userCardIndex]: {
            status: { $set: "done" }
          }
        },
        currentUser:{ $set: new UserCard()},
        currentEvent:{ $set: new EventCard()},
        eventcards:{ $set: []},
        currentMappingCount: { $set: 0 },
        currentCommitRecommendCount:{ $set: 0 },
        currentMappingCountCategoryRest: { $set: 0 },
        currentMappingCountCategoryCafe: { $set: 0 },
        currentMappingCountCategoryPlace: { $set: 0 }
    }));
  }

  findRecommendIndex(RecommendId)
  {
    let recommendIndex=-1;
    let length = this.state.recommendcards.length;

    for(let i=0; i<length ; i++)
    {
      if(this.state.recommendcards[i].reco_hashkey==RecommendId)
        recommendIndex=i;
    }
    return recommendIndex;
  }

  findRecommendeeIndex(RecommendeeId)
  {
    let noneValue=-1;
    let recommendeeCards = this.state.recommendcards.filter((card)=>card.status === "recommendee");
    let length = recommendeeCards.length;

    for(let i=0; i<length ; i++)
    {
      if(recommendeeCards[i].reco_hashkey == RecommendeeId)
        return i;
    }
    return noneValue;
  }

  updateCardStatus(cardId, listStatus) { // CR : naming p
    // Find the index of the card
    let cardIndex = this.findRecommendIndex(cardId);
    // Get the current card
    let card = this.state.recommendcards[cardIndex]
    // Only proceed if hovering over a different list
    if(card.status !== listStatus){
      // set the component state to the mutated object

      if(this.state.currentCategory.toString() === "restaurant"){
        this.setState(update(this.state, {
          recommendcards: {
            [cardIndex]: {
              status: { $set: listStatus }
            }
          },
          currentMappingCount: { 
            $set: listStatus === "recommendee"?
              this.state.currentMappingCount+1:this.state.currentMappingCount-1
          },
          currentMappingCountCategoryRest: {
            $set: listStatus === "recommendee"?
              this.state.currentMappingCountCategoryRest+1:this.state.currentMappingCountCategoryRest-1
          }
        }));
      }
      else if(this.state.currentCategory.toString() === "cafe"){
        this.setState(update(this.state, {
          recommendcards: {
            [cardIndex]: {
              status: { $set: listStatus }
            }
          },
          currentMappingCount: { 
            $set: listStatus === "recommendee"?
              this.state.currentMappingCount+1:this.state.currentMappingCount-1
          },
          currentMappingCountCategoryCafe: {
            $set: listStatus === "recommendee"?
              this.state.currentMappingCountCategoryCafe+1:this.state.currentMappingCountCategoryCafe-1
          }
        }));
      }
      else{
        this.setState(update(this.state, {
          recommendcards: {
            [cardIndex]: {
              status: { $set: listStatus }
            }
          },
          currentMappingCount: { 
            $set: listStatus === "recommendee"?
              this.state.currentMappingCount+1:this.state.currentMappingCount-1
          },
          currentMappingCountCategoryPlace: {
            $set: listStatus === "recommendee"?
              this.state.currentMappingCountCategoryPlace+1:this.state.currentMappingCountCategoryPlace-1
          }
        }));
      }

    }
  }

  // Update by up & down button
  adjustCardDownPosition(cardId){
    let recommendeeCardIndex = this.findRecommendeeIndex(cardId);
    let recommendeeCards = this.state.recommendcards.filter((card)=>card.status === "recommendee");
    
    let recommendeeNextCardHashkey;
    if(recommendeeCardIndex === (recommendeeCards.length-1) ){
      // recommendee card's index is same about max count, with change index 0
      recommendeeNextCardHashkey = recommendeeCards[0].reco_hashkey;
    }
    else{
      recommendeeNextCardHashkey = recommendeeCards[recommendeeCardIndex+1].reco_hashkey;
    }
    let recommendeeNextCardOriginIndex = this.findRecommendIndex(recommendeeNextCardHashkey);
    // recommendee card's index is 
    
    this.updateCardPosition(cardId,this.state.recommendcards[recommendeeNextCardOriginIndex].reco_hashkey);
  }

  adjustCardUpPosition(cardId){
    let recommendeeCardIndex = this.findRecommendeeIndex(cardId);
    let recommendeeCards = this.state.recommendcards.filter((card)=>card.status === "recommendee");
    
    let recommendeePrevCardHashkey;
    if(recommendeeCardIndex === 0){
      recommendeePrevCardHashkey = recommendeeCards[recommendeeCards.length-1].reco_hashkey;
    }
    else{
      recommendeePrevCardHashkey = recommendeeCards[recommendeeCardIndex-1].reco_hashkey;
    }
    let recommendeePrevCardOriginIndex = this.findRecommendIndex(recommendeePrevCardHashkey);
    this.updateCardPosition(this.state.recommendcards[recommendeePrevCardOriginIndex].reco_hashkey,cardId);
  }

  // Update by Drag & Drop
  updateCardPosition(currentCardId , afterCardId){ // naming?
    // Only proceed if hovering over a different card
    if(currentCardId !== afterCardId) {
      // Find the index of the card
      let currentCardIndex = this.findRecommendIndex(currentCardId);
      // Get the current card
      let currentCard = this.state.recommendcards[currentCardIndex];
      // Find the index of the card the user is hovering over
      let afterCardIndex = this.findRecommendIndex(afterCardId);
      // Use splice to remove the card and reinsert it a the new index
      let afterCard = this.state.recommendcards[afterCardIndex];
      
      this.setState(update(this.state, {
        recommendcards: {
          $splice: [
            [currentCardIndex, 1],
            [afterCardIndex, 0, currentCard]
          ]
        }
      }));  
    }
  }
  persistCardDrag (cardId, status) {
    // Find the index of the card
    let cardIndex = this.findRecommendIndex(cardId);
    // Get the current card
    let card = this.state.recommendcards[cardIndex]
    
    /* Consider Backup Process 
    .catch((error) => {
      console.error("Fetch error:",error);
      this.setState(
        update(this.state, {
          cards: {
            [cardIndex]: {
              status: { $set: status }
            }
          }
        })
      );
    });*/
  }

  // CR : 전달할 파라미터를 묶어서 던지는 것은 ??
  render() { return (
    <MappingBoard usercards={this.state.usercards} eventcards={this.state.eventcards}
      currentUser={this.state.currentUser}  recommendcards={this.state.recommendcards}
      notrecommendevents={this.state.notrecommendevents}
      currentCategory={this.state.currentCategory} currentEvent={this.state.currentEvent}
      currentMainRegions={this.state.currentMainRegions} currentGenders={this.state.currentGenders}
      currentDetailRegions={this.state.currentDetailRegions} currentCommitRecommendCount={this.state.currentCommitRecommendCount}
      currentMappingCount={this.state.currentMappingCount}
      currentMappingCountCategoryRest={this.state.currentMappingCountCategoryRest}
      currentMappingCountCategoryCafe={this.state.currentMappingCountCategoryCafe}
      currentMappingCountCategoryPlace={this.state.currentMappingCountCategoryPlace}
      regionSet={this.state.regionSet} theOthersAdmin={this.state.theOthersAdmin}
      userInputHashTag={this.state.userInputHashTag}
      eventCallBacks={{
        selectEvent: this.selectEvent.bind(this),
        updateEventList:this.updateEventList.bind(this),
        reloadRecommendList:this.initRecommendStatus.bind(this)
      }}
      categoryCallBacks={{
        selectCategory:this.selectCategory.bind(this),
        selectMainRegions:this.selectMainRegions.bind(this),
        selectDetailRegions:this.selectDetailRegions.bind(this),
        selectGenders:this.selectGenders.bind(this),
        inputUserHashTag:this.inputUserHashTag.bind(this)
      }}
      recommendCallBacks={{
        commitRecommend:this.commitRecommend.bind(this),
        completeRecommend:this.completeRecommend.bind(this),
        reloadRecommendList:this.initRecommendStatus.bind(this),
        adjustCardDownPosition:this.adjustCardDownPosition.bind(this),
        adjustCardUpPosition:this.adjustCardUpPosition.bind(this)
      }}
      dndCallBacks={{
        updateStatus: this.updateCardStatus,
        updatePosition: this.updateCardPosition,
        persistCardDrag: this.persistCardDrag.bind(this)
      }}
      adminCallBacks={{
        loadAdminList: this.loadAdminList.bind(this),
        tempPrint: this.tempPrint.bind(this)
      }}
      adminId={this.props.adminId}
      adminName={this.props.adminName}
      onLogout={this.props.onLogout}
    />
    )
  }
}
MappingBoardContainer.propTypes={
  adminId: PropTypes.string,
  adminName: PropTypes.string,
  onLogout: PropTypes.function
};
export default MappingBoardContainer;
