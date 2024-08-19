import React from "react";

const EventList = ({ events = [] }) => {
  return (
    <ul className="event-list" data-testid="event-list">
      {events.map((event) => (
        <li key={event.id} data-testid={`event-item-${event.id}`}>
          {event.summary} - {event.location}
        </li>
      ))}
    </ul>
  );
};

export default EventList;
