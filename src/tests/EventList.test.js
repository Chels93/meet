// src/__tests__/EventList.test.js

import { render, screen, waitFor, within } from '@testing-library/react';
import { getEvents } from '../api';
import EventList from '../components/EventList';
import App from '../App';

jest.mock('../api'); // Mock the API call to avoid making real network requests

describe('<EventList /> component', () => {
  test('has an element with "list" role', () => {
    render(<EventList events={[]} />); // Render with an empty list
    expect(screen.getByRole('list')).toBeInTheDocument();
  });

  test('renders correct number of events', async () => {
    const allEvents = [{ id: 1, name: 'Event 1' }, { id: 2, name: 'Event 2' }]; // Mocked event data
    getEvents.mockResolvedValueOnce(allEvents); // Mock getEvents to return the event data

    render(<EventList events={allEvents} />);

    const listItems = await screen.findAllByRole('listitem'); // Wait until the items are rendered
    expect(listItems).toHaveLength(allEvents.length); // Check if the number of items matches
  });
});

describe('<EventList /> integration', () => {
  test('renders a non-empty list of events when the app is mounted and rendered', async () => {
    const allEvents = [{ id: 1, name: 'Event 1' }, { id: 2, name: 'Event 2' }]; // Mock event data
    getEvents.mockResolvedValueOnce(allEvents); // Mock the API call

    render(<App />);

    const EventListDOM = await screen.findByTestId('event-list'); // Find the event list by its data-testid
    await waitFor(() => {
      const EventListItems = within(EventListDOM).getAllByRole('listitem'); // Get all list items within the list
      expect(EventListItems.length).toBeGreaterThan(0); // Check that there is at least one event
    });
  });
});
