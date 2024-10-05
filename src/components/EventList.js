import React from 'react';
import Event from './Event'; 

const EventList = ({ events }) => {
  return (
    <div>
      <h2>Upcoming Events</h2>
      <ul id="event-list">
        {events && events.length > 0 ? (
          events.map(event => (
            <Event key={event.id} event={event} />
          ))
        ) : (
          <p>No events available</p>
        )}
      </ul>
    </div>
  );
};

export default EventList;
