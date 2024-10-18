import React, { useEffect, useState } from "react";

const NumberOfEvents = ({ setCurrentNOE }) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [numberOfEvents, setNumberOfEvents] = useState(32); // Default value set to 32

  useEffect(() => {
    setCurrentNOE(numberOfEvents); // Update the parent with the number of events
  }, [numberOfEvents, setCurrentNOE]);

  const handleInputChange = (event) => {
    const value = event.target.value.trim(); // Handle extra spaces

    if (value === "") {
      setErrorMessage(""); // Clear error if input is empty
      setNumberOfEvents(0); // Reset number of events to 0
      setCurrentNOE(0); // Update parent state with 0
    } else {
      const numericValue = Number(value); // Convert to number

      if (isNaN(numericValue) || numericValue <= 0) {
        setErrorMessage("Please enter a valid number greater than 0.");
        setCurrentNOE(0); // Reset parent state on invalid input
      } else {
        setErrorMessage(""); // Clear any previous errors
        setNumberOfEvents(numericValue); // Update local state
      }
    }
  };

  return (
    <div>
      <input
        id="number-of-events-input"
        type="number"
        className="number-of-events-input"
        value={numberOfEvents}
        onChange={handleInputChange}
        placeholder="Number of Events"
        aria-label="Number of events"
        min="1" // Add minimum value to prevent negative input
      />
      {errorMessage && <p className="error">{errorMessage}</p>}
    </div>
  );
};

export default NumberOfEvents;
