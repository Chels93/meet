// NumberOfEvents.js
import React from "react";

const NumberOfEvents = ({ numberOfEvents, updateEventCount }) => {
  const handleInputChange = (e) => {
    const value = Number(e.target.value);
    updateEventCount(value); // Correct function name to update the parent component state
  };

  return (
    <div>
      <label htmlFor="numberOfEvents">Number of Events:</label>
      <input
        type="number"
        id="numberOfEvents"
        value={numberOfEvents}
        onChange={handleInputChange}
      />
    </div>
  );
};

export default NumberOfEvents;