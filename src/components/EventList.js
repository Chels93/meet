import Event from './Event';

const EventList = ({ events }) => {
  return (
    <ul id="event-list" data-testid="event-list"> {/* Add data-testid for testing */}
      {events && events.length > 0 ? (
        events.map(event => (
          <li key={event.id}>
            {/* Ensure Event does not render another <li> */}
            <div>
              <Event event={event} />
            </div>
          </li>
        ))
      ) : (
        <li>No events available</li> // Handle case when there are no events
      )}
    </ul>
  );
};

export default EventList;
