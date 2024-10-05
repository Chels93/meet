// src/components/Event.js
import { useState } from "react";

const Event = ({ event }) => {
  const [showDetails, setShowDetails] = useState(false);

  // Ensure 'event' has all necessary properties before accessing
  const {
    summary = 'No title available',
    location = 'No location available',
    created,
    description = 'No description available',
    id,
  } = event || {}; // Destructure event and provide defaults

  return (
    <li className="event" key={id}> {/* Add key prop for lists (not necessary here since it's in a map) */}
      <h2>{summary}</h2>
      <p className="event-location">{location}</p>
      <p className="event-date">
        {created ? new Date(created).toUTCString() : 'Date not available'}
      </p>
      {showDetails && (
        <p data-testid={`event-details-${id}`} className="details">
          {description}
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
