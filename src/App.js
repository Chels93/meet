import { useEffect, useState, useCallback } from "react";
import CitySearch from "./components/CitySearch";
import EventList from "./components/EventList";
import NumberOfEvents from "./components/NumberOfEvents";
import { extractLocations, getEvents } from "./api";
import "./App.css";

const App = () => {
  const [events, setEvents] = useState([]);
  const [allLocations, setAllLocations] = useState({});
  const [currentCity, setCurrentCity] = useState("See all cities");

  const fetchData = useCallback(async () => {
    try {
      const allEvents = await getEvents();
      if (!Array.isArray(allEvents))
        throw new Error("Events data is not an array");

      const filteredEvents =
        currentCity === "See all cities"
          ? allEvents
          : allEvents.filter((event) => event.location === currentCity);

      setEvents(filteredEvents.slice(0, 32));
      setAllLocations(extractLocations(allEvents));
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  }, [currentCity]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="App">
      <CitySearch allLocations={allLocations} setCurrentCity={setCurrentCity} />
      <NumberOfEvents />
      <EventList events={events} />
    </div>
  );
};

export default App;
