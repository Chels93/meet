import React, { useState } from "react";

const Event = ({ event }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div>
      <h2>{event.title}</h2>
      <p>{event.location}</p>
      <p>{event.date}</p>
      {showDetails && <p>{event.details}</p>}
      <button onClick={() => setShowDetails(!showDetails)}>
        {showDetails ? "Hide Details" : "Show Details"}
      </button>
    </div>
  );
};

export default Event;
