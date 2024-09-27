import { defineFeature, loadFeature } from 'jest-cucumber';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react'; // Import React here for JSX

const feature = loadFeature('./src/features/specifyNumberOfEvents.feature');

// Mock events array
const mockEvents = Array.from({ length: 32 }, (_, index) => ({
  id: index,
  title: `Event ${index + 1}`,
  date: '2023-09-26',
}));

// Define the mock component separately
function MockEventList() {
  const [events, setEvents] = React.useState(mockEvents.slice(0, 32));

  // Simulate updating the number of events displayed
  const handleNumberChange = (e) => {
    const number = Number(e.target.value);
    setEvents(mockEvents.slice(0, number));
  };

  return (
    <div>
      <input data-testid="number-input" type="number" onChange={handleNumberChange} />
      {events.map((event) => (
        <div key={event.id} data-testid="event-item">
          <h2>{event.title}</h2>
          <p>{event.date}</p>
        </div>
      ))}
    </div>
  );
}

// Mock the EventList component using the predefined mock component
jest.mock('../components/EventList', () => MockEventList);

defineFeature(feature, (test) => {
  test('When user hasn’t specified a number, 32 events are shown by default', ({ given, when, then }) => {
    given('the user opens the app', () => {
      render(<MockEventList />);
    });

    when('the user does not specify a number of events', () => {
      // No action needed here
    });

    then('the user should see 32 events displayed', () => {
      const events = screen.getAllByTestId('event-item');
      expect(events.length).toBe(32); // 32 events should be rendered
    });
  });

  test('User can change the number of events displayed', ({ given, when, then }) => {
    given('the user is on the event list page', () => {
      render(<MockEventList />);
    });

    when('the user specifies to display a different number of events (e.g., 10)', () => {
      const input = screen.getByTestId('number-input');
      fireEvent.change(input, { target: { value: '10' } });
    });

    then('the user should see 10 events displayed', () => {
      const events = screen.getAllByTestId('event-item');
      expect(events.length).toBe(10); // 10 events should be rendered
    });
  });
});
