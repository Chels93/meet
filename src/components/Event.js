// src/components/Event.js
import { useState } from "react";

const Event = ({ event }) => {
  const [showDetails, setShowDetails] = useState(false);

  // Ensure 'event' has all necessary properties before accessing
  const { summary, location, created, description, id } = event || {};

  return (
    <li className="event">
      <h2>{summary || 'No title available'}</h2>
      <p className="event-location">{location || 'No location available'}</p>
      <p className="event-date">{created ? new Date(created).toUTCString() : 'Date not available'}</p>
      {showDetails && (
        <p data-testid={`event-details-${id}`} className="details">
          {description || 'No description available'}
        </p>
      )}
      <button
        data-testid={`expand-button-${id}`}
        className="details-btn"
        onClick={() => setShowDetails((prev) => !prev)} // Use functional update
      >
        {showDetails ? "Hide details" : "Show details"}
      </button>
    </li>
  );
};

export default Event;
