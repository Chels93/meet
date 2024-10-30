import CitySearch from "./components/CitySearch";
import CityEventsChart from "./components/CityEventsChart"; // Default import
import EventList from "./components/EventList";
import NumberOfEvents from "./components/NumberOfEvents";
import { useEffect, useState, useCallback } from "react";
import { extractLocations, getEvents } from "./api";
import { InfoAlert, ErrorAlert, WarningAlert } from "./components/Alert"; // Added WarningAlert import
import "./App.css";

const App = () => {
  const [allLocations, setAllLocations] = useState([]);
  const [currentNOE, setCurrentNOE] = useState(32);
  const [events, setEvents] = useState([]);
  const [currentCity, setCurrentCity] = useState("See all cities");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [infoAlert, setInfoAlert] = useState("");
  const [warningAlert, setWarningAlert] = useState(""); // Added state for warning alert

  // Memoized function to fetch and filter events
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(""); // Clear previous errors
    try {
      const allEvents = await getEvents();

      // Validate fetched events
      if (!Array.isArray(allEvents) || allEvents.length === 0) {
        throw new Error("No events found");
      }

      // Filter events based on the current city
      const filteredEvents =
        currentCity === "See all cities"
          ? allEvents
          : allEvents.filter((event) => event.location === currentCity);

      // Update state with filtered events
      setEvents(filteredEvents.slice(0, currentNOE));
      setAllLocations(extractLocations(allEvents));
    } catch (err) {
      console.error("Error fetching events:", err);
      setError("Could not fetch events. Please try again later.");
      setWarningAlert("Warning: Unable to load some events.");
    } finally {
      setLoading(false);
    }
  }, [currentCity, currentNOE]);

  // Fetch data on component mount and when dependencies change
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Save current city and number of events to local storage on change
  useEffect(() => {
    const dataToSave = { currentCity, currentNOE };
    localStorage.setItem("unsavedData", JSON.stringify(dataToSave));
  }, [currentCity, currentNOE]);

  // Use visibilitychange to save data when the tab loses focus
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

  return (
    <div className="App">
      <h1>Meet App</h1>
      <div className="alerts-container">
        {infoAlert.length ? <InfoAlert text={infoAlert} /> : null}
        {warningAlert.length ? <WarningAlert text={warningAlert} /> : null}{" "}
        {error.length ? <ErrorAlert text={error} /> : null}{" "}
      </div>
      <CitySearch
        allLocations={allLocations}
        setCurrentCity={setCurrentCity}
        setInfoAlert={setInfoAlert}
      />
      <NumberOfEvents setCurrentNOE={setCurrentNOE} setErrorAlert={setError} />
      <div className="charts-container">
        <CityEventsChart allLocations={allLocations} events={events} />
      </div>
      {loading ? <p>Loading events...</p> : <EventList events={events} />}
    </div>
  );
};

export default App;
