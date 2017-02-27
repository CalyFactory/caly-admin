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
              currentUser={ this.props.currentUser }
              eventCallBacks={ this.props.eventCallBacks }
              />
        <EventList id='events'
              title="Events"
              eventcards={ this.props.eventcards }
              eventCallBacks={ this.props.eventCallBacks }
              />
              {
                // Refactoring Point !
                // MappingBoard.js MUST mapping userId to each events in EventList
                // So, make a MappingBoardContainer.js structure to be correct.
              }
        <RecommendeeList id='recommendee'
              title="Recommendee"
              recommendcards={this.props.recommendcards}
              currentCategory={this.props.currentCategory}
              />
        <RecommenderList id='recommender'
              title='Recommender'
              recommendcards={this.props.recommendcards}
              currentUser={this.props.currentUser}
              categoryCallBacks={this.props.categoryCallBacks}
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
  categoryCallBacks: PropTypes.object,
  currentUser: PropTypes.object,
  currentCategory: PropTypes.string
};

export default MappingBoard;