import { useEffect, useState, useCallback } from "react";
import CitySearch from "./components/CitySearch";
import EventList from "./components/EventList";
import NumberOfEvents from "./components/NumberOfEvents";
import { extractLocations, getEvents } from "./api";
import "./App.css";

const App = () => {
  const [events, setEvents] = useState([]);
  const [allLocations, setAllLocations] = useState([]);
  const [currentCity, setCurrentCity] = useState("See all cities");
  const [numberOfEvents, setNumberOfEvents] = useState(32); // State for number of events

  // Fetch data when currentCity or numberOfEvents changes
  const fetchData = useCallback(async () => {
    try {
      const allEvents = await getEvents();
      if (!Array.isArray(allEvents)) {
        throw new Error("Events data is not an array");
      }

      // Filter events based on currentCity
      const filteredEvents = 
        currentCity === "See all cities" 
        ? allEvents 
        : allEvents.filter((event) => event.location === currentCity);

      // Update state with filtered and limited events
      setEvents(filteredEvents.slice(0, numberOfEvents));
      setAllLocations(extractLocations(allEvents));
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  }, [currentCity, numberOfEvents]);

  // Use useEffect to call fetchData when dependencies change
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="App">
      <CitySearch 
        allLocations={allLocations} 
        setCurrentCity={setCurrentCity} 
      />
      <NumberOfEvents 
        numberOfEvents={numberOfEvents} 
        updateEventCount={setNumberOfEvents} // Correctly pass the function
      />
      <EventList events={events} />
    </div>
  );
};

export default App;