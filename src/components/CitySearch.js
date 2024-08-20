import { useState, useEffect } from "react";

const CitySearch = ({ allLocations = [], setCurrentCity }) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    setSuggestions(allLocations);
  }, [allLocations]);

  const handleInputChanged = (event) => {
    const value = event.target.value;
    setQuery(value);

    if (value) {
      const filteredLocations = allLocations.filter((location) =>
        location.toUpperCase().includes(value.toUpperCase())
      );
      setSuggestions(filteredLocations);
      setShowSuggestions(true);
    } else {
      // Show "See all cities" if the input is cleared
      setSuggestions(allLocations);
      setShowSuggestions(true);
    }
  };

  const handleItemClicked = (event) => {
    const value = event.currentTarget.dataset.value; // Use data-value attribute
    setQuery(value);
    setShowSuggestions(false);
    setCurrentCity(value === "See all cities" ? "See all cities" : value);
  };

  return (
    <div id="city-search" data-testid="city-search">
      <input
        type="text"
        className="city"
        placeholder="Search for a city"
        value={query}
        onFocus={() => setShowSuggestions(true)}
        onChange={handleInputChanged}
        data-testid="city-search-input"
      />
      {showSuggestions && (
        <ul className="suggestions">
          {suggestions.length > 0 ? (
            <>
              {suggestions.map((suggestion) => (
                <li
                  onClick={handleItemClicked}
                  key={suggestion}
                  data-value={suggestion} // Add data-value attribute
                  data-testid={`suggestion-${suggestion}`}
                >
                  {suggestion}
                </li>
              ))}
              <li
                onClick={handleItemClicked}
                key="see-all-cities"
                data-value="See all cities" // Add data-value attribute
                data-testid="see-all-cities"
              >
                <b>See all cities</b>
              </li>
            </>
          ) : (
            <li data-testid="no-suggestions">No suggestions</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default CitySearch;