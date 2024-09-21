import React, { useState } from 'react';
import PropTypes from 'prop-types';

const Event = ({ event }) => {
  const [detailsVisible, setDetailsVisible] = useState(false);

  const toggleDetails = () => {
    setDetailsVisible((prev) => !prev);
  };

  return (
    <div className="event" role="article">
      <h2 id={`event-title-${event.id}`}>{event.title}</h2>
      <p>{event.location}</p>
      <p>{new Date(event.date).toLocaleString()}</p>
      {detailsVisible && (
        <p aria-live="polite" className="details" id={`event-details-${event.id}`}>
          {event.details || 'No details available'}
        </p>
      )}
      <button
        aria-controls={`event-details-${event.id}`}
        aria-expanded={detailsVisible}
        onClick={toggleDetails}
        className="details-btn"
      >
        {detailsVisible ? 'Hide Details' : 'Show Details'}
      </button>
    </div>
  );
};

Event.propTypes = {
  event: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string,
    location: PropTypes.string.isRequired,
    date: PropTypes.string,
    details: PropTypes.string,
  }).isRequired,
};

export default Event;
