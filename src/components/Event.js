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
        data-testid={`expand-button-${event.id}`} // Set data-testid for testing
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
    id: PropTypes.string.isRequired, // Ensure id is a string
    title: PropTypes.string,
    location: PropTypes.string,
    date: PropTypes.string,
    details: PropTypes.string,
  }).isRequired,
};

export default Event;
