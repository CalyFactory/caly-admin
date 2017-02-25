import React, { Component, PropTypes } from 'react';
import UserList from './UserList';
import EventList from './EventList';
import RecommendeeList from './RecommendeeList';
import RecommenderList from './RecommenderList';

class MappingBoard extends Component {
  render(){
    return (
      <div className="app">
        <UserList id='users'
              title="Users"
              usercards={ this.props.usercards }
              curruentUser={ this.props.curruentUser }
              eventCallBacks={ this.props.eventCallBacks }
              />
        <EventList id='events'
              title="Events"
              eventcards={ this.props.eventcards }
              eventCallBacks={ this.props.eventCallBacks }
              />
        <RecommendeeList id='recommendee'
              title="Recommendee"
              recommendcards={this.props.recommendcards}
              />
        <RecommenderList id='recommender'
              title='Recommender'
              recommendcards={this.props.recommendcards}
              />
      </div>
    );
  }
};
MappingBoard.propTypes = {
  usercards: PropTypes.arrayOf(PropTypes.object),
  eventcards: PropTypes.arrayOf(PropTypes.object),
  recommendcards: PropTypes.arrayOf(PropTypes.object),
  eventCallBacks: PropTypes.object,
  curruentUser: PropTypes.string
};

export default MappingBoard;
