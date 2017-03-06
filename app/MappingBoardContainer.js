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
      currentCategory:""
    };

    this.updateCardStatus = throttle(this.updateCardStatus.bind(this));
    this.updateCardPosition = throttle(this.updateCardPosition.bind(this),500);

    let getHeader={
      method: 'get',
      dataType: 'json',
      headers:{
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }

    // User List up
    fetch('/admin-users',getHeader)
    .then((response) => response.json())
    .then((responseData) => {
      // Mapping User & Event JSON data
      console.log('admin-user count is '+responseData.length);
      this.setState({usercards: responseData});
    })
    .catch((error)=>{
      console.log('Error fetching admin-users',error);
    });

    // Recommend Data fetch
    fetch('/admin-recommend')
    .then((response) => response.json())
    .then((responseData) => {
      let length=responseData.length;

      for(let i=0; i<length; i++)
        responseData[i].status="recommender";
      console.log(responseData);
      this.setState({recommendcards: responseData});
    })
    .catch((error)=>{
      console.log('Error fetching admin-recommend',error);
    });
  }
  
  componentDidMount(){
    
  }

  // Set current user. using flag for event list
  updateEventList(userHashkey){
    let prevState = this.state;
    let userIndex = this.findUserIndex(userHashkey);

    if(userIndex == -1)
      return;

    // PT
    let currentUserBirth = new Date().getFullYear() - this.state.usercards[userIndex].user_birth;
    let currentUserGender = this.state.usercards[userIndex].user_gender;    
    console.log("current user is "+ currentUserBirth+", "+currentUserGender+", "+userHashkey);

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

      this.state.eventcards?
      this.setState({
        currentUser:this.state.usercards[userIndex],
        eventcards: responseData
      })
      :this.setState({
        currentUser:this.state.usercards[userIndex],
        eventcards: update(this.state.eventcards, responseData)
      });
    })
    .catch((error)=>{
      console.log('Error fetching admin-events',error);
    });
  }

  // Set current category from selectedCategory. using RecommendeeList tap
  selectCategory(selectedCategory){
    let prevState = this.state;
    this.setState({currentCategory:selectedCategory});
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

  // Print, What is clicked event
  selectEvent(userId, eventId){
    console.log("Current Event Info, "+userId+"'s "+eventId);
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
    let commitUser=this.state.currentUser.userId;
    let commitCards=this.state.recommendcards.filter((card)=>card.status === "recommendee");
    
    console.log("current user : "+commitUser);
    for(let i=0; i<commitCards.length; i++)
    {
      console.log("recommendee "+i);
      console.log("recommended item : "+commitCards[i].id);
    }
  }

  // Commit to event table
  commitNotRecommend(notRecommendEvents){
    let notRecommendEventLength = notRecommendEvents.length;
    console.log("Commit NotRecommend ");
    for(let i=0 ; i<notRecommendEventLength ; i++)
    {
      let eventIndex = this.findEventIndex(notRecommendEvents[i]);
      if(eventIndex == -1)
        continue;
      console.log("eventIndex is "+eventIndex);

      // update DB
      let notRecommendEvent={
        'event_hashkey':notRecommendEvents[i]
      };

      fetch('/admin-notrecommend',{
        method: 'POST',
        headers:{
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(notRecommendEvent)
      })

      // update setState
      console.log(this.state.eventcards[eventIndex].reco_state);
      this.setState({eventcards: update(this.state.eventcards, {
        [eventIndex]:{
          reco_state: {$set: 2}
        }
      })});
    }

    this.updateEventList(this.state.currentUser.user_hashkey);
  }

  findRecommendIndex(RecommendId)
  {
    let recommendIndex=-1;
    let length = this.state.recommendcards.length;

    for(let i=0; i<length ; i++)
    {
      if(this.state.recommendcards[i].id==RecommendId)
        recommendIndex=i;
    }
    return recommendIndex;
  }

  updateCardStatus(cardId, listId) {
    // Find the index of the card
    let cardIndex = this.findRecommendIndex(cardId);
    // Get the current card
    let card = this.state.recommendcards[cardIndex]
    // Only proceed if hovering over a different list
    if(card.status !== listId){
      // set the component state to the mutated object
      this.setState(update(this.state, {
          recommendcards: {
            [cardIndex]: {
              status: { $set: listId }
            }
          }
      }));

      console.log("updateCardStatus, listId is "+listId);
    }
  }

  updateCardPosition(cardId , afterId){
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

  render() { return (
    <MappingBoard usercards={this.state.usercards} eventcards={this.state.eventcards}
      currentUser={this.state.currentUser}  recommendcards={this.state.recommendcards}
      notrecommendevents={this.state.notrecommendevents}
      currentCategory={this.state.currentCategory}
      eventCallBacks={{
        selectEvent: this.selectEvent.bind(this),
        updateEventList:this.updateEventList.bind(this) 
      }}
      categoryCallBacks={{
        selectCategory:this.selectCategory.bind(this)
      }}
      recommendCallBacks={{
        commitRecommend:this.commitRecommend.bind(this),
        commitNotRecommend:this.commitNotRecommend.bind(this)
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
