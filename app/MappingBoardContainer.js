import React, { Component } from 'react';
import MappingBoard from './MappingBoard';
import UserCard from './UserCard';
import EventCard from './EventCard';
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

  commitNotRecommend(notRecommendEvents){
    let notRecommendEventLength = notRecommendEvents.length;

    for(let i=0 ; i<notRecommendEventLength ; i++)
    {
      let token = notRecommendEvents[i].split(":join:");
      
      let userIndex = this.findUserIndex(token[0]);
      if(userIndex == -1)
        continue;

      let eventIndex = this.findEventIndex(userIndex, token[1]);
      if(eventIndex == -1)
        continue;

      // Set timeout is Async?
      console.log("UserId is "+token[0]+" and UserIndex is "+userIndex+", EventId is "+token[1]+" and EventIndex is "+eventIndex);
      this.setState({usercards: update(this.state.usercards, {
        [userIndex]:{
          events: {
            eventInfo: {
              [eventIndex]:{
                status: {$set: 2}
              }
            }
          }
        }
      })});

      //setTimeout(()=>{console.log("5 second")},5000);
    }
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

  findEventIndex(userIndex, eventId){
    let eventIndex=-1;
    let length=this.state.usercards[userIndex].events.eventInfo.length;

    for(let i=0; i<length; i++)
    {
      if(this.state.usercards[userIndex].events.eventInfo[i].eventId == eventId)
        eventIndex=i;
    }
    return eventIndex;
  }

  commitRecommend(){
    let commitCards=this.state.recommendcards.filter((card)=>card.status === "recommended");
    for(let i=0; i<commitCards.length; i++)
    {
      console.log(commitCards[i].id);
    }
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
    />
    )
  }
}
export default MappingBoardContainer;
