import React, { useEffect, useState, useCallback } from "react"; 
import CitySearch from "./components/CitySearch"; 
import CityEventsChart from "./components/CityEventsChart"; 
import EventGenresChart from "./components/EventGenresChart"; 
import EventList from "./components/EventList"; 
import NumberOfEvents from "./components/NumberOfEvents"; 
import { extractLocations, getEvents } from "./api"; 
import { InfoAlert, ErrorAlert, WarningAlert } from "./components/Alert"; 
import "./App.css"; 

const App = () => {
  const [allLocations, setAllLocations] = useState([]); 
  const [currentNOE, setCurrentNOE] = useState(32); 
  const [events, setEvents] = useState([]); 
  const [currentCity, setCurrentCity] = useState("See all cities"); 
  const [loading, setLoading] = useState(false); 
  const [alert, setAlert] = useState({ error: "", info: "", warning: "" }); 

  const fetchData = useCallback(async () => {
    setLoading(true); 
    setAlert((prev) => ({ ...prev, error: "" })); 

    try {
      // Fetch events with currentNOE as parameter
      const allEvents = await getEvents(currentNOE); 
      if (!Array.isArray(allEvents) || allEvents.length === 0) {
        throw new Error("No events found"); 
      }

      const filteredEvents =
        currentCity === "See all cities"
          ? allEvents
          : allEvents.filter((event) => event.location === currentCity);

      setEvents(filteredEvents.slice(0, currentNOE)); 
      setAllLocations(extractLocations(allEvents)); 
    } catch (err) {
      console.error("Error fetching events:", err); 
      setAlert({
        error: "Could not fetch events. Please try again later.", 
        warning: "Warning: Unable to load some events.", 
      });
    } finally {
      setLoading(false); 
    }
  }, [currentCity, currentNOE]); 

  useEffect(() => {
    fetchData(); 
  }, [fetchData]); 

  useEffect(() => {
    const dataToSave = { currentCity, currentNOE }; 
    localStorage.setItem("unsavedData", JSON.stringify(dataToSave)); 
  }, [currentCity, currentNOE]); 

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        const dataToSave = { currentCity, currentNOE }; 
        localStorage.setItem("unsavedData", JSON.stringify(dataToSave)); 
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange); 
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange); 
    };
  }, [currentCity, currentNOE]); 

  const { error, info, warning } = alert;

  return (
    <div className="App">
      <h1>Meet App</h1>
      <div className="alerts-container">
        {info && <InfoAlert text={info} />}
        {warning && <WarningAlert text={warning} />}
        {error && <ErrorAlert text={error} />}
      </div>
      <CitySearch
        allLocations={allLocations}
        setCurrentCity={setCurrentCity}
        setInfoAlert={(msg) => setAlert((prev) => ({ ...prev, info: msg }))}
      />
      <NumberOfEvents
        setCurrentNOE={setCurrentNOE}
        setErrorAlert={(msg) => setAlert((prev) => ({ ...prev, error: msg }))}
      />
      <div className="charts-container">
        <EventGenresChart events={events} />
        <CityEventsChart allLocations={allLocations} events={events} />
      </div>
      {loading ? <p>Loading events...</p> : <EventList events={events} />}
    </div>
  );
};

export default App;
