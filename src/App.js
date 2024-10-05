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

  // Use useCallback to memoize fetchData to avoid unnecessary recreation
  const fetchData = useCallback(async () => {
    const allEvents = await getEvents();
    if (!allEvents) {
      console.error("No events fetched.");
      return; // Exit if no events are fetched
    }

    const filteredEvents = currentCity === "See all cities" ?
      allEvents :
      allEvents.filter(event => event.location === currentCity);

    // Apply the currentNOE to limit the number of events displayed
    setEvents(filteredEvents.slice(0, currentNOE)); 
    setAllLocations(extractLocations(allEvents));
  }, [currentCity, currentNOE]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);  

  return (
    <div className="App">
      <CitySearch allLocations={allLocations} setCurrentCity={setCurrentCity} />
      <NumberOfEvents currentNOE={currentNOE} setCurrentNOE={setCurrentNOE} />
      <EventList allLocations={allLocations} events={events} />
    </div>
  );
}

export default App;
