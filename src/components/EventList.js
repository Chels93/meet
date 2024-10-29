import Event from './Event';

const EventList = ({ events = [], citySearch }) => {
  // Filter events based on the city search input
  const filteredEvents = events.filter(event => {
    // Return all events if no city search input is provided, otherwise filter by location
    return !citySearch || event.location.includes(citySearch);
  });

  return (
    <ul id="event-list" role="list">
      {filteredEvents.length > 0 ? (
        filteredEvents.map(event => (
          <Event key={event.id} event={event} />
        ))
      ) : (
        <li>No events found.</li> 
      )}
    </ul>
  );
};

export default EventList;