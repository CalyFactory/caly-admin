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
      notrecommendevents:[],
      currentUser:[],
      currentCategory:""
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
            notrecommendevents={this.state.notrecommendevents}
            eventCallBacks={{
              addNotRecommendEventList: this.addNotRecommendEventList.bind(this),
              cancelNotRecommendEventList: this.cancelNotRecommendEventList.bind(this),
              selectEvent: this.selectEvent.bind(this),
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
    this.componentDidMount();
  }

  selectCategory(selectedCategory){
    let prevState = this.state;
    this.setState({currentCategory:selectedCategory});
  }

  selectEvent(userId, eventId){
    console.log("Current Event Info, "+userId+"'s "+eventId);
  }

  addNotRecommendEventList(userId, eventId){
    //console.log("Not Recommend Info, "+userId+"'s "+eventId);

    let addEvent = update(
      this.state.notrecommendevents,{ $push: [userId+":join:"+eventId] }
    );
    this.setState({notrecommendevents:addEvent});

    //console.log(this.state.notrecommendevents);
  }

  cancelNotRecommendEventList(userId, eventId){
    console.log("Cancel Not Recommend Info, "+userId+"'s "+eventId); 
    let prevState = this.state;
    let userIndex = -1;
    let joinkey = userId+":join:"+eventId;
    for(let i=0; i<5; i++)
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

  declareNotRecommendEvent(){
    console.log("Declare Not Recommend");
    for(let i=0; i<this.state.notrecommendevents.length; i++){
      let token = this.state.notrecommendevents[i].split(":join:");
      console.log("UserId is "+token[0]+", EventId is "+token[1]);
    }
  }

  render() { return (
    <MappingBoard usercards={this.state.usercards} currentUser={this.state.currentUser}
      eventcards={this.state.eventcards} recommendcards={this.state.recommendcards}
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
