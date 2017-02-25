import React, { Component } from 'react';
import MappingBoard from './MappingBoard';
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
    };
  }
  // CodeReview : 예제에서 왜 DidMount()로 했는가? WillMount()로 쓸 수 있지 않나?
  componentDidMount(){

    // User & Event List fetch
    fetch('./userevents.json')
    .then((response) => response.json())
    .then((responseData) => {
      this.setState({usercards: responseData});

      // WAY 1 : remake to json with usercard.id

      // WAY 2 : direct mapping
      /*var events = responseData.map((eventcard)=>{
            return <EventCard
            userId={responseData.userId}
            eventId={eventcard.eventid}
            startDateTime={eventcard.startDateTime}
            endDateTime={eventcard.endDateTime}
            eventName={eventcard.eventName}
            location={eventcard.location}
             />
      });*/
      //console.log(responseData.get('userId'));
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


  render() { return (
    <MappingBoard usercards={this.state.usercards} 
    eventcards={this.state.eventcards} recommendcards={this.state.recommendcards}
     />
    )
  }
}
export default MappingBoardContainer;
