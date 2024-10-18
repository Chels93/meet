// src/__test__/EventList.test.js

import { render, screen, waitFor } from '@testing-library/react';
import { getEvents } from '../api';
import EventList from '../components/EventList';
import App from "../App";

describe("<EventList /> component", () => {
  // If EventList is imported as a default export, no need for a variable declaration
  beforeEach(() => {
    // Any setup that needs to happen before each test
  });

  test('has an element with "list" role', () => {
    // Render the EventList component with an empty events array to prevent errors
    render(<EventList events={[]} />);
    expect(screen.getByRole("list")).toBeInTheDocument();
  });

  test('renders correct number of events', async () => {
    const allEvents = await getEvents();
    render(<EventList events={allEvents} />); // Render the component with events

    // Use screen to check the number of list items
    expect(screen.getAllByRole("listitem")).toHaveLength(allEvents.length);
  });
});

describe("<EventList /> integration", () => { 
  test('renders a list of 32 events when the app is mounted and rendered', async () => {
    render(<App />); // Render the App component

    await waitFor(() => {
      // Use screen to query the event list directly
      const eventListItems = screen.getAllByRole('listitem');
      expect(eventListItems.length).toBe(32);
    });
  }); 
});
