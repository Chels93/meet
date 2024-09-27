import React, { useState } from 'react';

const Event = ({ event }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleDetails = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="event" role="article">
      <h2 id={`event-title-${event.id}`}>{event.title}</h2>
      <p>{new Date(event.date).toLocaleDateString() || 'Invalid Date'}</p>
      {isExpanded && (
        <p
          aria-live="polite"
          className="details"
          id={`event-details-${event.id}`}
          data-testid={`event-details-${event.id}`}
        >
          {event.details}
        </p>
      )}
      <button
        aria-controls={`event-details-${event.id}`}
        aria-expanded={isExpanded}
        className="details-btn"
        data-testid={`expand-button-${event.id}`}
        onClick={toggleDetails}
      >
        {isExpanded ? 'Hide Details' : 'Show Details'}
      </button>
    </div>
  );
};

const EventList = ({ events }) => (
  <ul data-testid="event-list" id="event-list">
    {events.map((event) => (
      <li key={event.id}>
        <Event event={event} />
      </li>
    ))}
  </ul>
);

export default EventList;
