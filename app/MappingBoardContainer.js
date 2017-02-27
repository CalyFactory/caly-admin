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
      eventcards:[],
      recommendcards:[],
      currentUser:UserCard
    };
  }
  // CodeReview : 예제에서 왜 DidMount()로 했는가? WillMount()로 쓸 수 있지 않나?
  componentDidMount(){
    // User & Event List fetch
    fetch('./userevents.json')
    .then((response) => response.json())
    .then((responseData) => {

      // Mapping User & Event JSON data
      this.setState({usercards: responseData});

      // Extract usercard.id & event info
      let eventcards=this.state.usercards.map((usercard)=>{

        // Get EventRoot & Direct Mapping to EventCard
        return usercard.events.eventInfo.map((eventcard)=>{
          return <EventCard 
            userId={usercard.userId}
            eventId={eventcard.eventId}
            currentUser={this.state.currentUser}
            eventCallBacks={{
              selectUser:this.selectUser.bind(this)
            }}
            {...eventcard}
            />
        });
      });

      this.setState({eventcards: eventcards});
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
    

    /*this.setState(update(this.state, {
      currentUser: { $apply: (currentUser)=>{
          return userId;
      }}
    }));*/
    
    console.log(this.state.currentUser);
    this.componentDidMount();
  }

  render() { return (
    <MappingBoard usercards={this.state.usercards} currentUser={this.state.currentUser}
      eventcards={this.state.eventcards} recommendcards={this.state.recommendcards}
      eventCallBacks={{
        selectUser:this.selectUser.bind(this) 
      }}
    />
    )
  }
}
export default MappingBoardContainer;
