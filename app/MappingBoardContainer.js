import React, { Component } from 'react';
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
      recommendcards:[],
      currentUser:[],
      currentCategory:""
    };

    this.updateCardStatus = throttle(this.updateCardStatus.bind(this));
    this.updateCardPosition = throttle(this.updateCardPosition.bind(this),500);
  }
  
  componentDidMount(){
    // User & Event List fetch
    fetch('./userevents.json')
    .then((response) => response.json())
    .then((responseData) => {
      // Mapping User & Event JSON data
      this.setState({usercards: responseData});
    })
    .catch((error)=>{
      console.log('Error fetching userevents.json',error);
    });

    // Recommend Data fetch
    fetch('./container.json')
    .then((response) => response.json())
    .then((responseData) => {
      this.setState({recommendcards: responseData});
    })
    .catch((error)=>{
      console.log('Error fetching container.json',error);
    });
  }

  // Set current user. using flag for event list
  selectUser(userId){
    let prevState = this.state;
    let userIndex = this.findUserIndex(userId);
    if(userIndex == -1)
      return;
    this.setState({currentUser:this.state.usercards[userIndex]});
  }

  // Set current category from selectedCategory. using RecommendeeList tap
  selectCategory(selectedCategory){
    let prevState = this.state;
    this.setState({currentCategory:selectedCategory});
  }

  // Print, What is clicked event
  selectEvent(userId, eventId){
    console.log("Current Event Info, "+userId+"'s "+eventId);
  }

  findUserIndex(userId){
    let userIndex=-1;
    let length=this.state.usercards.length;

    for(let i=0; i<length ; i++)
    {
      if(this.state.usercards[i].userId == userId)
        userIndex=i;
    }
    return userIndex;
  }

  findCalendarIndex(userIndex, calendarId){
    let calendarIndex=-1;
    let length=this.state.usercards[userIndex].calendars.length;

    for(let i=0; i<length; i++)
    {
      if(this.state.usercards[userIndex].calendars[i].calendarId == calendarId)
        calendarIndex=i;
    }
    return calendarIndex;
  }

  findEventIndex(userIndex, calendarIndex, eventId){
    let eventIndex=-1;
    let length=this.state.usercards[userIndex].calendars[calendarIndex].events.length;

    for(let i=0; i<length; i++)
    {
      if(this.state.usercards[userIndex].calendars[calendarIndex].events[i].eventId == eventId)
        eventIndex=i;
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

    for(let i=0 ; i<notRecommendEventLength ; i++)
    {
      let token = notRecommendEvents[i].split(":join:");
      
      let userIndex = this.findUserIndex(token[0]);
      if(userIndex == -1)
        continue;

      let calendarIndex = this.findCalendarIndex(userIndex, token[1]);
      if(calendarIndex == -1)
        continue;

      let eventIndex = this.findEventIndex(userIndex, calendarIndex, token[2]);
      if(eventIndex == -1)
        continue;

      // this.setState with for issue 
      this.setState({usercards: update(this.state.usercards, {
        [userIndex]:{
          calendars: {
            [calendarIndex]:{
              events: {
                [eventIndex]:{
                  status: {$set: 2}
                }
              }
            }
          }
        }
      })});

    }
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
    <MappingBoard usercards={this.state.usercards} currentUser={this.state.currentUser}
      recommendcards={this.state.recommendcards}
      currentCategory={this.state.currentCategory}
      eventCallBacks={{
        selectEvent: this.selectEvent.bind(this),
        selectUser:this.selectUser.bind(this) 
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
    />
    )
  }
}
export default MappingBoardContainer;
