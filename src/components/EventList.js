import React from "react";
import Event from "./Event";

const EventList = ({ events }) => {
  return (
    <ul className="event-list" data-testid="event-list">
      {events.map((event, index) => (
        <li key={index} data-testid="event-item">
          <Event event={event} />
        </li>
      ))}
    </ul>
  );
};

export default EventList;