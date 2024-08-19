import { useState } from "react";

const NumberOfEvents = ({ updateEventCount }) => {
  const [number, setNumber] = useState(32);

  const handleInputChanged = (event) => {
    const value = event.target.value;
    setNumber(value);
    if (updateEventCount) {
      updateEventCount(value);
    }
  };

  return (
    <div id="number-of-events" data-testid="number-of-events">
      <label htmlFor="number-of-events-input">Number of Events: </label>
      <input
        type="number"
        id="number-of-events-input"
        className="number-of-events-input"
        value={number}
        onChange={handleInputChanged}
      />
    </div>
  );
};

export default NumberOfEvents;
