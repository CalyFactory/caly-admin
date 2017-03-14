import React, { Component, PropTypes } from 'react';
import UserList from './UserList';
import EventList from './EventList';
import RecommendeeList from './RecommendeeList';
import RecommenderList from './RecommenderList';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

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
              notrecommendevents={ this.props.notrecommendevents }
              currentUser={ this.props.currentUser }
              currentEvent={ this.props.currentEvent }
              eventCallBacks={ this.props.eventCallBacks }
              recommendCallBacks={ this.props.recommendCallBacks }
              notRecommendCallBacks= {this.props.notRecommendCallBacks}
              />
        <RecommendeeList id='recommendee'
              title="Recommendee"
              recommendcards={this.props.recommendcards.filter((card) => card.status === "recommendee")}
              currentEvent={this.props.currentEvent}
              currentCategory={this.props.currentCategory}
              recommendCallBacks={this.props.recommendCallBacks}
              dndCallBacks={this.props.dndCallBacks}
              />
        <RecommenderList id='recommender'
              title='Recommender'
              recommendcards={this.props.recommendcards.filter((card) => card.status === "recommender")}
              currentUser={this.props.currentUser}
              currentEvent={this.props.currentEvent}
              categoryCallBacks={this.props.categoryCallBacks}
              dndCallBacks={this.props.dndCallBacks}
              />
      </div>
    );
  }
};

MappingBoard.propTypes = {
  usercards: PropTypes.arrayOf(PropTypes.object),
  eventcards: PropTypes.arrayOf(PropTypes.object),
  recommendcards: PropTypes.arrayOf(PropTypes.object),
  notrecommendevents: PropTypes.arrayOf(PropTypes.string),  // Declare list about disrecommending event
  currentUser: PropTypes.object,
  currentEvent: PropTypes.string,
  currentCategory: PropTypes.string,
  eventCallBacks: PropTypes.object,
  categoryCallBacks: PropTypes.object,
  recommendCallBacks: PropTypes.object,
  notRecommendCallBacks: PropTypes.object,
  dndCallBacks: PropTypes.object
};

export default DragDropContext(HTML5Backend)(MappingBoard);