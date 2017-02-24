import React, { Component, PropTypes } from 'react';
import List from './List';
import UserList from './UserList';
import EventList from './EventList';
import RecommendList from './RecommendList';

class KanbanBoard extends Component {
  render(){
    return (
      <div className="app">
        <UserList id='users'
              title="Users"
              usercards={ this.props.usercards }
              />
        <EventList id='events'
              title="Events"
              usercards={ this.props.usercards }
              eventcards={ this.props.eventcards }
              />
        <List id='recommendee'
              title="Recommendee"
              cards={this.props.cards.filter((card) => card.status === "in-progress")}
              taskCallbacks={this.props.taskCallbacks} />
        <RecommendList id='recommender'
              title='Recommender'
              recommendcards={this.props.recommendcards}
              />
      </div>
    );
  }
};
KanbanBoard.propTypes = {
  cards: PropTypes.arrayOf(PropTypes.object),
  usercards: PropTypes.arrayOf(PropTypes.object),
  eventcards: PropTypes.arrayOf(PropTypes.object),
  recommendcards: PropTypes.arrayOf(PropTypes.object),
  taskCallbacks: PropTypes.object
};

export default KanbanBoard;
