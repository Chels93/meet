import { useState } from "react";

const Event = ({ event }) => {
  const [showDetails, setShowDetails] = useState(false);

  // Ensure 'event' has all necessary properties before accessing
  const { summary = 'No title available', location = 'No location available', created, description = 'No description available', id } = event || {};

  return (
    <li className="event" key={id}> {/* Add key prop for lists */}
      <h2>{summary}</h2>
      <p className="event-location">{location}</p>
      <p className="event-date">{created ? new Date(created).toUTCString() : 'Date not available'}</p>
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
