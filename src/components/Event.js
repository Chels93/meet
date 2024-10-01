// src/components/Event.js
import { useState } from "react";

const Event = ({ event }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <li className="event">
      <h2>{event?.summary}</h2>
      <p className="event-location">{event?.location}</p>
      <p className="event-date">{new Date(event?.created).toUTCString()}</p>
      {showDetails && (
        <p data-testid={`event-details-${event.id}`} className="details">
          {event.description}
        </p>
      )}
      <button
        data-testid={`expand-button-${event.id}`}
        className="details-btn"
        onClick={() => setShowDetails(!showDetails)}
      >
        {showDetails ? "Hide details" : "Show details"}
      </button>
    </li>
  );
};

export default Event;
