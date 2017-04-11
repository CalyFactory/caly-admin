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
      usercards:[],
      eventcards:[],
      recommendcards:[],
      notrecommendevents:[],
      currentUser:new UserCard(),
      currentEvent:new EventCard(),
      currentCategory:"restaurant",
      currentMainRegions:[],
      currentDetailRegions:[],
      detailRegionCounts:[],
      currentGenders:[],
      theOthersAdmin:[],
      regionSet:[],
      currentCommitRecommendCount:0,
      currentMappingCount:0,
      currentMappingCountCategoryRest:0,
      currentMappingCountCategoryCafe:0,
      currentMappingCountCategoryPlace:0,
      userInputHashTag:''
    };

    this.updateCardStatus = throttle(this.updateCardStatus.bind(this));
    this.updateCardPosition = throttle(this.updateCardPosition.bind(this),500);

  }
  
  componentDidMount(){
    // Recommend List up from DB
    fetch('/admin-recommend',{
      method: 'get',
      dataType: 'json',
      headers:{
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then((response) => response.json())
    .then((responseData) => {
      let length=responseData.length;

      for(let i=0; i<length; i++){
        responseData[i].status="recommender";
        
      }
      this.setState({recommendcards: responseData});
    })
    .catch((error)=>{
      console.log('Error fetching admin-recommend',error);
    });

    // User List up
    fetch('/admin-users',{
      method: 'get',
      dataType: 'json',
      headers:{
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then((response) => response.json())
    .then((responseData) => {

      //console.log('admin-user count is '+responseData.length);
      let length = responseData.length;
      
      for(let i=0; i<length; i++)
        responseData[i].status="ready";
      //console.log(responseData);
      this.setState({usercards: responseData});
    })
    .catch((error)=>{
      console.log('Error fetching admin-users',error);
    });

    

    // Current Admin List fetch
    this.loadAdminList();

    // Get Detail region by main region
    fetch('/admin-region',{
      method: 'get',
      dataType: 'json',
      headers:{
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then((response) => response.json())
    .then((responseData) => {
      this.setState({regionSet: responseData});
    })
    .catch((error)=>{
      console.log('Error fetching admin-regions',error);
    });   

    // Recommend Set status for "ready"
    //this.initRecommendStatus();
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
            recommendcards:recommendList,
            currentCategory:{ $set:"restaurant" },
            currentMainRegions:{ $set:[] },
            currentDetailRegions:{ $set:[] },
            detailRegionCounts:{ $set:[] },
            currentGenders:{ $set:[] },
            currentEvent: { $set: new EventCard() },
            currentMappingCount: { $set: 0 },
            regionSet:{ $set:[] },
            currentCommitRecommendCount: { $set: this.state.currentCommitRecommendCount+1 }
          }
      ));
    }
    else {
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
            regionSet:{ $set:[] }
          }
      ));
    }
  }

  loadDBRecommendStatus(selectedEventHashkey){
    let didRecoJson={};

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
      didRecoJson=responseData;
      let didLength = didRecoJson.length;
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
            regionSet:{ $set:[] }
          }
      ));
    })
    .catch((error)=>{
      console.log('Error fetching reco-hash', error);
    });


  }

  // Set current user. using flag for event list
  updateEventList(userHashkey,createDateTime){
    let userIndex = this.findUserIndex(userHashkey);

    if(userIndex == -1)
      return;
    console.log("updateEventList : Do it !");
    // PT
    let currentUserBirth = new Date().getFullYear() - this.state.usercards[userIndex].user_birth;
    let currentUserGender = this.state.usercards[userIndex].user_gender;    
    //console.log("current user is "+ currentUserBirth+", "+currentUserGender+", "+userHashkey);

    fetch(`/admin-events?userHashkey=`+userHashkey+`&createDateTime=`+createDateTime,{
      method: 'get',
      dataType: 'json',
      headers:{
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then((response) => response.json())
    .then((responseData) => {
      // CR : 반대로 해서 되는 이유 ?
      let length=responseData.length;
      /*
      for(let i=0 ; i<length; i++){
        console.log("No."+i+" : ");
        console.log(responseData[i]);
      }
      this.setState({
        currentUser:this.state.usercards[userIndex],
        eventcards: responseData,
        currentEvent:new EventCard()
      });*/
      
      this.state.eventcards?
      this.setState({
        currentUser:this.state.usercards[userIndex],
        eventcards: responseData,
        currentEvent:new EventCard()
      })
      :this.setState({
        currentUser:this.state.usercards[userIndex],
        eventcards: update(this.state.eventcards, responseData),
        currentEvent:new EventCard()
      });
    })
    .catch((error)=>{
      console.log('Error fetching admin-events',error);
    });

    // Request sync admin
    let sendCurrentAdmin ={
      admin:this.props.adminId,
      select_user:userHashkey
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
    let inputs=[];
    let items=selectedDetailRegions.toString().split(',');
    for ( let i in items)
    {
      inputs.push(items[i].toString());
    }
    this.setState({currentDetailRegions:inputs});
  }
  selectMainRegions(selectedMainRegions){
    let inputs=[];
    let items=selectedMainRegions.toString().split(',');
    for ( let i in items)
    {
      inputs.push(items[i].toString());
    }
    this.setState({currentMainRegions:inputs});
  }
  selectGenders(selectedGenders){
    let inputs=[];
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

    if(this.state.currentUser.reco_count>0)
      this.loadDBRecommendStatus(selectedEventHashkey);
    else
      this.initRecommendStatus();

    //console.log("current user reco_count :"+this.state.currentUser.reco_count);
    this.setState({currentEvent:this.state.eventcards[eventIndex]});
  }

  findUserIndex(userHashKey){
    let userIndex=-1;
    let length=this.state.usercards.length;

    for(let i=0; i<length ; i++)
    {
      if(this.state.usercards[i].user_hashkey == userHashKey)
        return i;
    }
    return userIndex;
  }

  findEventIndex(eventHashKey){
    let eventIndex=-1;
    let length=this.state.eventcards.length;
    let cnt=0;

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
      let userHashKeyList=[];
      console.log("AdminList");
      console.log("AL count : "+length);
      if(length>0){
        for(let i=0; i<length; i++){
          if(Object.keys(responseData)[i].toString() === this.props.adminId){
            //console.log("My My !!");
            continue;
          }

          console.log(Object.keys(responseData)[i]);
          userHashKeyList.push(responseData[Object.keys(responseData)[i]]);
        }
      }
      //console.log("=====UHKL====");
      //console.log(userHashKeyList);
      this.setState({theOthersAdmin:userHashKeyList});
    })

    fetch('/admin-users',{
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
      //console.log(responseData);
      this.setState({usercards: responseData});
    })
    .catch((error)=>{
      console.log('Error fetching admin-users',error);
    });

    this.initRecommendStatus();
  }

  // Commit to event-recommend join table
  // 이벤트-추천 테이블 추천 적용
  commitRecommend(){
    let commitUser=this.state.currentUser.user_hashkey;
    let commitCards=this.state.recommendcards.filter((card)=>card.status === "recommendee");
    let recoList=[]
    //console.log("in commitRecommend : declare variable");
    // Push recommendcard to list
    // 추천카드를 리스트에 푸시
    for(let i=0; i<commitCards.length; i++)
    {
      recoList.push(commitCards[i].reco_hashkey);
    }
    //console.log("in commitRecommend : push to recoList");
    // Fetch API call from react to server/main.js
    // server/main.js에 react에서 fetch로 API 콜요청
    let recommendEvent={
      'user_hashkey':commitUser,
      'event_hashkey':this.state.currentEvent.event_hashkey,
      'reco_hashkey_list':recoList,
      'update_flag'       : this.state.currentUser.reco_count>0? 1 : 0
    };

    //console.log("in commitRecommend : declare fetch body(recommendEvent)");
    fetch('/admin-map-recommend',{
      method: 'POST',
      headers:{
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(recommendEvent)
    })

    //console.log("in commitRecommend : end /admin-map-recommend fetch");
    // 매핑 종료 후, 캘린더DB에 이벤트 상태값을 3으로 변경
    // Complete mapping. event handling to set 3 about calendar_db, 
    let completeRecommendEvent={
      'event_hashkey':this.state.currentEvent.event_hashkey
    };

    fetch('/admin-update-event-recostate',{
      method: 'POST',
      headers:{
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(completeRecommendEvent)
    })

    //console.log("in commitRecommend : end /admin-update-event-recostate");

    let eventIndex = this.findEventIndex(this.state.currentEvent.event_hashkey);
    if(eventIndex == -1)
    {
      console.log('error event index during set complete mapping');
      return;
    }
    // 추천종료 후, 현재 이벤트들 상태 3으로 변경
    /*
    this.setState(update(this.state, {
        eventcards: {
          [eventIndex]: {
            status: {$set:3}
          }
        },
        currentCategory: { $set: "restaurant" },
        currentMainRegions: { $set: []},
        currentGenders: { $set: []},
        currentEvent: { $set: new EventCard() },
        currentMappingCount: { $set: 0 },
        currentCommitRecommendCount: { $set: this.state.currentCommitRecommendCount+1 }
    }));
    */
    //console.log("commitRecommend:this.state.currentMappingCount : "+this.state.currentMappingCount);
    //console.log("commitRecommend:this.state.currentCommitRecommendCount : "+this.state.currentCommitRecommendCount);
    this.initRecommendStatus(1);
    //this.updateEventList(commitUser, this.state.currentUser.create_datetime);   // CR : API 다시 콜하지 않게
  }

  // Commit to event table
  completeRecommend(notRecommendEvents){
    console.log("completeRecommend : "+notRecommendEvents);
    // update DB 
    let notRecommendEventBody={
      'event_hashkey_list': notRecommendEvents,
      'user_hashkey'      : this.state.currentUser.user_hashkey,
      'account_hashkey'   : this.state.currentUser.account_hashkey
    };

    fetch('/admin-complete-recommend',{
      method: 'POST',
      headers:{
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(notRecommendEventBody)
    })

    /*
    let notRecommendEventLength = notRecommendEvents.length;
    let notRecommendLetList={};

    for(let i=0 ; i<notRecommendEventLength ; i++)
    {
      let eventIndex = this.findEventIndex(notRecommendEvents[i]);
      if(eventIndex == -1)
        continue;
      // update setState
      notRecommendLetList[i]={
        eventcards: update(this.state.eventcards, {
          [eventIndex]:{
            status: {$set: 2}
          }
        }
      )};
    }*/

    //Usercard status update "ready" to "done"
    //console.log("Recommend Count : "+this.state.currentCommitRecommendCount);
    //console.log(this.state.currentCommitRecommendCount);
    let userCardIndex = this.findUserIndex(this.state.currentUser.user_hashkey);
    let userCard = this.state.usercards[userCardIndex]
    //this.setState(notRecommendLetList,{
    /*this.setState({
      currentUser:new UserCard(),
      currentEvent:new EventCard(),
      eventcards:[],
      currentCommitRecommendCount:0
    });*/
    //console.log("After Complete Recommend");
    //console.log(this.state.eventcards);
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
        currentCommitRecommendCount:{ $set: 0 }
    }));
    //,currentCommitRecommendCount: { $set: 0}
    //this.updateEventList(null, null);
    //console.log("completeRecommend:this.state.currentMappingCount : "+this.state.currentMappingCount);
    //console.log("completeRecommend:this.state.currentCommitRecommendCount : "+this.state.currentCommitRecommendCount);
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
      //this.state.currentCategory

      this.setState(update(this.state, {
          recommendcards: {
            [cardIndex]: {
              status: { $set: listStatus }
            }
          },
          currentMappingCount: { 
            $set: listStatus === "recommendee"?
              this.state.currentMappingCount+1:this.state.currentMappingCount-1
         }
      }));
      if(this.state.currentCategory === ""){

      }
      else if(this.staet.currentCategory === ""){

      }
      else{
        
      }

      //console.log("updateCardStatus:this.state.currentMappingCount : "+this.state.currentMappingCount);
      //console.log("updateCardStatus:this.state.currentCommitRecommendCount : "+this.state.currentCommitRecommendCount);
      //console.log("updateCardStatus, listStatus is "+listStatus);
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
      console.log("Key down : Update index convert "+recommendeeCardIndex+" to 0.");
    }
    else{
      recommendeeNextCardHashkey = recommendeeCards[recommendeeCardIndex+1].reco_hashkey;
      console.log("Key down : Update index convert "+recommendeeCardIndex+" to "+(recommendeeCardIndex+1));
    }
    let recommendeeNextCardOriginIndex = this.findRecommendIndex(recommendeeNextCardHashkey);
    console.log("Next card's origin index is "+recommendeeNextCardOriginIndex);
    // recommendee card's index is 
    
    console.log("=========================");
    this.updateCardPosition(cardId,this.state.recommendcards[recommendeeNextCardOriginIndex].reco_hashkey);
  }
  adjustCardUpPosition(cardId){
    let recommendeeCardIndex = this.findRecommendeeIndex(cardId);
    let recommendeeCards = this.state.recommendcards.filter((card)=>card.status === "recommendee");
    
    let recommendeePrevCardHashkey;
    if(recommendeeCardIndex === 0){
      recommendeePrevCardHashkey = recommendeeCards[recommendeeCards.length-1].reco_hashkey;
      console.log("Key up : Update index convert "+recommendeeCardIndex+" to "+(recommendeeCards.length-1));
    }
    else{
      recommendeePrevCardHashkey = recommendeeCards[recommendeeCardIndex-1].reco_hashkey;
      console.log("Key up : Update index convert "+recommendeeCardIndex+" to "+(recommendeeCardIndex-1));
    }
    let recommendeePrevCardOriginIndex = this.findRecommendIndex(recommendeePrevCardHashkey);
    console.log("Prev card's origin index is "+recommendeePrevCardOriginIndex);
    console.log("==========================");
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

      if(currentCard.status === "recommendee" && afterCard.status=== "recommendee")
        console.log("recommendee,recommendee");
       
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
