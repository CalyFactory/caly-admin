import React, { Component } from 'react';
import MappingBoard from './MappingBoard';
import UserCard from './UserCard';
import EventCard from './EventCard';
import update from 'react-addons-update';
import 'whatwg-fetch';
import 'babel-polyfill'

class MappingBoardContainer extends Component {
  constructor(){
    super(...arguments);
    this.state = {
      usercards:[],
      recommendcards:[],
      notrecommendevents:[],
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
    let userIndex = -1;

    for(let i=0; i<5; i++)
    {
      if(this.state.usercards[i].userId == userId)
        userIndex=i;
    }
    if(userIndex == -1)
      return;

    this.setState({currentUser:this.state.usercards[userIndex]});
    //this.componentDidMount();
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

  // List up event to do no recommend
  addNotRecommendEventList(userId, eventId){
    
    let addEvent = update(
      // in Event list, Too difficult to filtering to eventId.
      this.state.notrecommendevents,{ $push: [userId+":join:"+eventId] }
    );
    this.setState({notrecommendevents:addEvent});

  }

  // Except event to do recommend
  cancelNotRecommendEventList(userId, eventId){
    let prevState = this.state;
    let userIndex = -1;
    let joinkey = userId+":join:"+eventId;
    let notRecommendEventLength = this.state.notrecommendevents.length;

    for(let i=0; i<notRecommendEventLength; i++)
    {
      if(this.state.notrecommendevents[i] == joinkey)
        userIndex=i;
    }
    if(userIndex == -1)
      return;
    console.log("userIndex is "+userIndex);

    let delEvent = update(
      this.state.notrecommendevents, {$splice: [[userIndex,1]] }
    );
    this.setState({notrecommendevents:delEvent});
    console.log(this.state.notrecommendevents);
  }

  // Print event to do not recommend ( in actually, insert into event DB )
  declareNotRecommendEvent(){
    let notRecommendEventLength = this.state.notrecommendevents.length;

    for(let i=0 ; i<notRecommendEventLength ; i++){
      let token = this.state.notrecommendevents[i].split(":join:");
      console.log("UserId is "+token[0]+", EventId is "+token[1]);
    }
  }

  render() { return (
    <MappingBoard usercards={this.state.usercards} currentUser={this.state.currentUser}
      recommendcards={this.state.recommendcards}
      currentCategory={this.state.currentCategory} notrecommendevents={this.state.notrecommendevents}
      eventCallBacks={{
        declareNotRecommendEvent: this.declareNotRecommendEvent.bind(this),
        addNotRecommendEventList: this.addNotRecommendEventList.bind(this),
        cancelNotRecommendEventList: this.cancelNotRecommendEventList.bind(this),
        selectEvent: this.selectEvent.bind(this),
        selectUser:this.selectUser.bind(this) 
      }}
      categoryCallBacks={{
        selectCategory:this.selectCategory.bind(this)
      }}
    />
    )
  }
}
export default MappingBoardContainer;
