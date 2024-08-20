import React, { useState } from 'react';

const Event = ({ event }) => {
  const [showDetails, setShowDetails] = useState(false);

  const startTime = new Date(event.start.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const endTime = new Date(event.end.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const handleButtonClick = () => {
    setShowDetails(prev => !prev);
  };

  return (
    <div className="event">
      <h2>{event.title}</h2>
      <p>{event.location}</p>
      <p>{startTime} - {endTime}</p>
      <button onClick={handleButtonClick}>
        {showDetails ? 'Hide Details' : 'Show Details'}
      </button>
      {showDetails && <p>{event.description}</p>}
    </div>
  );
};

export default Event;