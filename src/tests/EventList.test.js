// src/__tests__/EventList.test.js

import { render, screen, waitFor, within } from '@testing-library/react';
import { getEvents } from '../api';
import EventList from '../components/EventList';
import App from "../App";

describe('<EventList /> component', () => {
  test('has an element with "list" role', () => {
    render(<EventList events={[]} />); // Render with an empty list
    expect(screen.getByRole("list")).toBeInTheDocument();
  });

  test('renders correct number of events', async () => {
    const allEvents = await getEvents();
    render(<EventList events={allEvents} />);
    const listItems = await screen.findAllByRole("listitem");
    expect(listItems).toHaveLength(allEvents.length);
  });
});

describe('<EventList /> integration', () => {
  test('renders a non-empty list of events when the app is mounted and rendered', async () => {
    render(<App />);
    const EventListDOM = await screen.findByTestId('event-list'); // Find by data-testid
    await waitFor(() => {
      const EventListItems = within(EventListDOM).getAllByRole('listitem');
      expect(EventListItems.length).toBeGreaterThan(0); // Check for at least one item
    });
  });
});
