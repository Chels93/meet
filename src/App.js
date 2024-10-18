import CitySearch from './components/CitySearch';
import EventList from './components/EventList';
import NumberOfEvents from './components/NumberOfEvents';
import { useEffect, useState, useCallback } from 'react';
import { extractLocations, getEvents } from './api';
import { InfoAlert, ErrorAlert } from './components/Alert';
import './App.css';

const App = () => {
  const [allLocations, setAllLocations] = useState([]);
  const [currentNOE, setCurrentNOE] = useState(32);  
  const [events, setEvents] = useState([]);
  const [currentCity, setCurrentCity] = useState("See all cities");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [infoAlert, setInfoAlert] = useState("");

  // Memoized function to fetch and filter events
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const allEvents = await getEvents();
      console.log("Fetched events:", allEvents);
      const filteredEvents = currentCity === "See all cities" 
        ? allEvents 
        : allEvents.filter(event => event.location === currentCity);
      
      setEvents(filteredEvents.slice(0, currentNOE));
      setAllLocations(extractLocations(allEvents));
    } catch (err) {
      console.error("Error fetching events:", err);
      setError("Could not fetch events. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [currentCity, currentNOE]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="App">
      <div className="alerts-container">
        {infoAlert && <InfoAlert text={infoAlert} />}
        {error && <ErrorAlert text={error} />}
      </div>
      <CitySearch 
        allLocations={allLocations} 
        setCurrentCity={setCurrentCity} 
        setInfoAlert={setInfoAlert} 
      />
      <NumberOfEvents setCurrentNOE={setCurrentNOE} setError={setError} /> {/* Pass setError */}
      {loading && <p>Loading events...</p>} 
      <EventList events={events} /> 
    </div>
  );
}

export default App;
