import PropTypes from 'prop-types';
import React, { useState } from 'react';

function NumberOfEvents({ updateEventCount }) {
  const [number, setNumber] = useState(32);

  const handleChange = (event) => {
    const newValue = event.target.value;
    setNumber(newValue);
    updateEventCount(newValue);
  };

  return (
    <div className="number-of-events">
      <label htmlFor="event-number">Number of Events</label>
      <input
        aria-label="Number of events to display"
        id="event-number"
        type="number"
        value={number}
        onChange={handleChange}
      />
    </div>
  );
}

NumberOfEvents.propTypes = {
  updateEventCount: PropTypes.func.isRequired,
};

export default NumberOfEvents;