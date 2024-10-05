import CitySearch from './components/CitySearch';
import EventList from './components/EventList';
import NumberOfEvents from './components/NumberOfEvents';
import { useEffect, useState, useCallback } from 'react';
import { extractLocations, getEvents } from './api';
import './App.css';

const App = () => {
  const [allLocations, setAllLocations] = useState([]);
  const [currentNOE, setCurrentNOE] = useState(32);  
  const [events, setEvents] = useState([]);
  const [currentCity, setCurrentCity] = useState("See all cities");
  const [loading, setLoading] = useState(true); // New loading state
  const [error, setError] = useState(null); // New error state

  // Memoize fetchData using useCallback
  const fetchData = useCallback(async () => {
    setLoading(true); // Set loading to true before fetching
    setError(null); // Reset error state
    try {
      const allEvents = await getEvents();
      const filteredEvents = currentCity === "See all cities" ?
        allEvents :
        allEvents.filter(event => event.location === currentCity);
      setEvents(filteredEvents.slice(0, currentNOE)); 
      setAllLocations(extractLocations(allEvents));
    } catch (err) {
      console.error("Error fetching events:", err);
      setError("Could not fetch events. Please try again later."); // Set error message
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  }, [currentCity, currentNOE]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="App">
      <CitySearch allLocations={allLocations} setCurrentCity={setCurrentCity} />
      <NumberOfEvents currentNOE={currentNOE} setCurrentNOE={setCurrentNOE} />
      {loading && <p>Loading events...</p>} {/* Display loading message */}
      {error && <p className="error">{error}</p>} {/* Display error message */}
      <EventList events={events} />
    </div>
  );
}

export default App;
