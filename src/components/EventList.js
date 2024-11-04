import Event from './Event';

const EventList = ({ events = [], citySearch }) => {
  // Filter events based on the city search input
  const filteredEvents = events.filter(event => {
    return !citySearch || event.location.includes(citySearch);
  });

  return (
    <ul>
      {filteredEvents.length > 0 ? (
        filteredEvents.map((event, index) => (
          <Event key={`${event.id}-${index}`} event={event} />
        ))
      ) : (
        <li>No events found.</li> // Optional: Display a message if no events match the filter
      )}
    </ul>
  );
};

export default EventList;
