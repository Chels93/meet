import React, { useState, useEffect } from 'react';
import CitySearch from './components/CitySearch';
import EventList from './components/EventList';
import NumberOfEvents from './components/NumberOfEvents';
import { getEvents, extractLocations } from './api';

const App = () => {
  const [events, setEvents] = useState([]);
  const [currentNOE, setCurrentNOE] = useState(32); // Current number of events state
  const [allLocations, setAllLocations] = useState([]);
  const [currentCity, setCurrentCity] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const allEvents = await getEvents();
      const filteredEvents = currentCity
        ? allEvents.filter(event => event.location === currentCity)
        : allEvents;
      setEvents(filteredEvents.slice(0, currentNOE)); // Use currentNOE here
      setAllLocations(extractLocations(allEvents));
    };

    fetchData();
  }, [currentCity, currentNOE]); // Re-run when currentCity or currentNOE changes

  return (
    <div className="App">
      <div id="city-search" data-testid="city-search">
        <CitySearch allLocations={allLocations} setCurrentCity={setCurrentCity} />
      </div>
      <div id="number-of-events" data-testid="number-of-events">
        <NumberOfEvents numberOfEvents={currentNOE} setNumberOfEvents={setCurrentNOE} /> {/* Pass currentNOE */}
      </div>
      <EventList events={events} />
    </div>
  );
};

export default App;
