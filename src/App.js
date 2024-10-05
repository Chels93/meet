import CitySearch from './components/CitySearch';
import EventList from './components/EventList';
import NumberOfEvents from './components/NumberOfEvents';
import { useEffect, useState, useCallback } from 'react';
import { extractLocations, getCalendarEvents } from './api';
import './App.css';

const App = () => {
  const [allLocations, setAllLocations] = useState([]);
  const [currentNOE, setCurrentNOE] = useState(32);  
  const [events, setEvents] = useState([]);
  const [currentCity, setCurrentCity] = useState("See all cities");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Memoized function to fetch and filter events
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const allEvents = await getCalendarEvents(); // Fetch all events
      console.log("Fetched events:", allEvents); // Log fetched events
      const filteredEvents = currentCity === "See all cities" ?
        allEvents :
        allEvents.filter(event => event.location === currentCity); // Filter based on selected city
      setEvents(filteredEvents.slice(0, currentNOE)); // Set the first `currentNOE` events
      setAllLocations(extractLocations(allEvents)); // Update locations
    } catch (err) {
      console.error("Error fetching events:", err);
      setError("Could not fetch events. Please try again later."); // Set error message
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  }, [currentCity, currentNOE]);

  // Use useEffect to call fetchData on component mount and when dependencies change
  useEffect(() => {
    fetchData(); // Call fetchData when the component mounts and dependencies change
  }, [fetchData]); // Add fetchData to the dependency array

  return (
    <div className="App">
      <CitySearch allLocations={allLocations} setCurrentCity={setCurrentCity} />
      <NumberOfEvents currentNOE={currentNOE} setCurrentNOE={setCurrentNOE} />
      {loading && <p>Loading events...</p>} {/* Display loading message */}
      {error && <p className="error">{error}</p>} {/* Display error message */}
      <EventList events={events} /> {/* Render the list of events */}
    </div>
  );
}

export default App;
