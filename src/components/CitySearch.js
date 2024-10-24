import { useState, useEffect } from "react";

const CitySearch = ({ allLocations, setCurrentCity, setInfoAlert }) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const handleItemClicked = (event) => {
    const value = event.target.textContent;
    setQuery(value);
    setShowSuggestions(false);
    setCurrentCity(value);
    setInfoAlert("");
  };

  const handleInputChanged = (event) => {
    const value = event.target.value;
    const filteredLocations = allLocations
      ? allLocations.filter((location) =>
          location.toUpperCase().includes(value.toUpperCase())
        )
      : [];

    setQuery(value);
    setSuggestions(filteredLocations);

    const infoText =
      filteredLocations.length === 0
        ? "We cannot find the city you are looking for. Please try another city"
        : "";
    setInfoAlert(infoText);
  };

  useEffect(() => {
    setSuggestions(allLocations);
  }, [allLocations]);

  return (
    <div id="city-search" data-testid="city-search">
      <label htmlFor="city" id="city-label">
        Search City:
        <input
          type="text"
          id="city" // Add this line
          className="city"
          value={query}
          placeholder="Search for a city..."
          onFocus={() => setShowSuggestions(true)}
          onChange={handleInputChanged}
          onInput={() =>
            query.length === 0
              ? setShowSuggestions(false)
              : setShowSuggestions(true)
          }
          data-testid="city-input"
        />
      </label>

      {showSuggestions && (
        <ul className="suggestions" data-testid="suggestions-list">
          {suggestions.map((suggestion) => (
            <li
              key={suggestion}
              onClick={handleItemClicked}
              data-testid="suggestion-item"
            >
              {suggestion}
            </li>
          ))}
          <li
            key="See all cities"
            onClick={handleItemClicked}
            data-testid="suggestion-item"
          >
            <b>See all cities</b>
          </li>
        </ul>
      )}
    </div>
  );
};

export default CitySearch;
