import React, { Component, PropTypes } from 'react';
import List from './List';
import UserList from './UserList';
import EventList from './EventList';

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
              eventcards={ this.props.eventcards }
              />
        <List id='recommend'
              title="Recommend"
              cards={this.props.cards.filter((card) => card.status === "in-progress")}
              taskCallbacks={this.props.taskCallbacks} />
        <List id='container'
              title='Container'
              cards={this.props.cards}
              taskCallbacks={this.props.taskCallbacks} />
      </div>
    );
  }
};
KanbanBoard.propTypes = {
  cards: PropTypes.arrayOf(PropTypes.object),
  usercards: PropTypes.arrayOf(PropTypes.object),
  eventcards: PropTypes.arrayOf(PropTypes.object),
  taskCallbacks: PropTypes.object
};

export default KanbanBoard;
