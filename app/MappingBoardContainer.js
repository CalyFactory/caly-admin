import React, { Component } from 'react';
import MappingBoard from './MappingBoard';
import UserCard from './UserCard';
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
      currentEvent:"", // CR :naming? object? 확장성 ? 검색기능이나 추천완료나 7일 이내나 ...
      currentCategory:"",
      currentMainRegions:[],
      currentGenders:[]
    };

    this.updateCardStatus = throttle(this.updateCardStatus.bind(this));
    this.updateCardPosition = throttle(this.updateCardPosition.bind(this),500);

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
      console.log('admin-user count is '+responseData.length);
      let length = responseData.length;
      
      for(let i=0; i<length; i++)
        responseData[i].status="ready";
      //console.log(responseData);
      this.setState({usercards: responseData});
    })
    .catch((error)=>{
      console.log('Error fetching admin-users',error);
    });

  }
  
  componentDidMount(){
    // Recommend Data fetch
    this.loadRecommendData();    
  }

  loadRecommendData(){
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

      // CR : loadRecommendData()에 이 부분만
      for(let i=0; i<length; i++)
        responseData[i].status="recommender";

      this.setState({recommendcards: responseData});
    })
    .catch((error)=>{
      console.log('Error fetching admin-recommend',error);
    });
  }

  // Set current user. using flag for event list
  updateEventList(userHashkey){
    let userIndex = this.findUserIndex(userHashkey);

    if(userIndex == -1)
      return;

    // PT
    let currentUserBirth = new Date().getFullYear() - this.state.usercards[userIndex].user_birth;
    let currentUserGender = this.state.usercards[userIndex].user_gender;    
    //console.log("current user is "+ currentUserBirth+", "+currentUserGender+", "+userHashkey);

    fetch(`/admin-events?userHashkey=`+userHashkey,{
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
      this.state.eventcards?
      this.setState({
        currentUser:this.state.usercards[userIndex],
        eventcards: responseData,
        currentEvent:""
      })
      :this.setState({
        currentUser:this.state.usercards[userIndex],
        eventcards: update(this.state.eventcards, responseData),
        currentEvent:""
      });
    })
    .catch((error)=>{
      console.log('Error fetching admin-events',error);
    });
  }

  // Set current status from selectedCategory.
  // Input from Recommenderlist, Output to RecommendeeList tap
  selectCategory(selectedCategory){
    this.setState({currentCategory:selectedCategory});
  }
  selectMainRegions(selectedMainRegions){
    let inputs=new Array(3);
    let items=selectedMainRegions.toString().split(',');
    for ( let i in items)
    {
      inputs.push(items[i].toString());
    }
    this.setState({currentMainRegions:inputs});
  }
  selectGenders(selectedGenders){
    let inputs=new Array(3);
    let items=selectedGenders.toString().split(',');
    for ( let i in items)
    {
      inputs.push(items[i].toString());
    }
    this.setState({currentGenders:inputs});
  }

  // List up event to do no recommend
  addNotRecommendEventList(eventHashKey){

    let addEvent = update(
      // in Event list, Too difficult to filtering to eventId.
      this.state.notrecommendevents,{ $push: [eventHashKey] }
    );
    this.setState({notrecommendevents:addEvent});

  }

  // Except event to do recommend
  cancelNotRecommendEventList(eventHashKey){
    let prevState = this.state;
    let userIndex = -1;
    let notRecommendEventLength = this.state.notrecommendevents.length;

    for(let i=0; i<notRecommendEventLength; i++)
    {
      if(this.state.notrecommendevents[i] == eventHashKey)
        userIndex=i;
    }
    if(userIndex == -1)
      return;

    let delEvent = update(
      this.state.notrecommendevents, {$splice: [[userIndex,1]] }
    );
    this.setState({notrecommendevents:delEvent});
  }

  // Print, clicked event
  selectEvent(userHashKey, eventHashKey){
    this.setState({currentEvent:eventHashKey});
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

  // Commit to event-recommend join table
  commitRecommend(){
    let commitUser=this.state.currentUser.user_hashkey;
    let commitCards=this.state.recommendcards.filter((card)=>card.status === "recommendee");
    let recoList=[]
    //console.log("current user : "+commitUser);
    for(let i=0; i<commitCards.length; i++)
    {
      recoList.push(commitCards[i].reco_hashkey);
    }
    let recommendEvent={
      'user_hashkey':commitUser,
      'event_hashkey':this.state.currentEvent,
      'reco_hashkey_list':recoList
    };
    fetch('/admin-map-recommend',{
      method: 'POST',
      headers:{
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(recommendEvent)
    })

    // event handling to set 2
    let completeRecommendEvent={
      'event_hashkey':this.state.currentEvent
    };

    fetch('/admin-update-event-recostate',{
      method: 'POST',
      headers:{
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(completeRecommendEvent)
    })

    let eventIndex = this.findEventIndex(this.state.currentEvent);
    if(eventIndex == -1)
    {
      console.log('error event index during set complete mapping');
      return;
    }
    this.setState({
      eventcards: update(this.state.eventcards, {
        [eventIndex]:{
          status: {$set:2}
        }
      }),
      currentCategory:"",
      currentMainRegions:[],
      currentGenders:[]
    });
    this.updateEventList(commitUser); // CR : API 다시 콜하지 않게
    this.loadRecommendData();
  }

  // Commit to event table
  completeRecommend(notRecommendEvents){
    console.log("completeRecommend : "+notRecommendEvents);
    // update DB 
    let notRecommendEventBody={
      'event_hashkey_list': notRecommendEvents
    };

    // CR : API 콜 한번에 insert - for
    fetch('/admin-complete-recommend',{
      method: 'POST',
      headers:{
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(notRecommendEventBody)
    })


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
            status: {$set: 3}
          }
        }
      )};
    }
    this.setState(notRecommendLetList);

    //Usercard status update "ready" to "done"
    let userCardIndex = this.findUserIndex(this.state.currentUser.user_hashkey);
    let userCard = this.state.usercards[userCardIndex]

    this.setState(update(this.state, {
        usercards: {
          [userCardIndex]: {
            status: { $set: "done" }
          }
        }
    }));

    this.updateEventList(this.state.currentUser.user_hashkey);
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

  updateCardStatus(cardId, listStatus) { // CR : naming p
    // Find the index of the card
    let cardIndex = this.findRecommendIndex(cardId);
    // Get the current card
    let card = this.state.recommendcards[cardIndex]
    // Only proceed if hovering over a different list
    if(card.status !== listStatus){
      // set the component state to the mutated object
      this.setState(update(this.state, {
          recommendcards: {
            [cardIndex]: {
              status: { $set: listStatus }
            }
          }
      }));

      console.log("updateCardStatus, listStatus is "+listStatus);
    }
  }

  updateCardPosition(cardId , afterId){ // naming?
    // Only proceed if hovering over a different card
    if(cardId !== afterId) {
      // Find the index of the card
      let cardIndex = this.findRecommendIndex(cardId);
      // Get the current card
      let card = this.state.recommendcards[cardIndex]
      // Find the index of the card the user is hovering over
      let afterIndex = this.findRecommendIndex(afterId);
      // Use splice to remove the card and reinsert it a the new index
      this.setState(update(this.state, {
        recommendcards: {
          $splice: [
            [cardIndex, 1],
            [afterIndex, 0, card]
          ]
        }
      }));
      console.log("updateCardPosition, afterId is "+afterId);
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
      eventCallBacks={{
        selectEvent: this.selectEvent.bind(this),
        updateEventList:this.updateEventList.bind(this),
        reloadRecommendList:this.loadRecommendData.bind(this)
      }}
      categoryCallBacks={{
        selectCategory:this.selectCategory.bind(this),
        selectMainRegions:this.selectMainRegions.bind(this),
        selectGenders:this.selectGenders.bind(this)
      }}
      recommendCallBacks={{
        commitRecommend:this.commitRecommend.bind(this),
        completeRecommend:this.completeRecommend.bind(this),
        reloadRecommendList:this.loadRecommendData.bind(this)
      }}
      dndCallBacks={{
        updateStatus: this.updateCardStatus,
        updatePosition: this.updateCardPosition,
        persistCardDrag: this.persistCardDrag.bind(this)
      }}
      notRecommendCallBacks={{
        addNotRecommendEventList: this.addNotRecommendEventList.bind(this),
        cancelNotRecommendEventList: this.cancelNotRecommendEventList.bind(this)
      }}
    />
    )
  }
}
export default MappingBoardContainer;
