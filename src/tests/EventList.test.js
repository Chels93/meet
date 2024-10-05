// src/__test__/EventList.test.js

import { render, within, screen } from '@testing-library/react';
import { getCalendarEvents } from '../api';
import EventList from '../components/EventList';
import App from "../App";

describe('<EventList /> component', () => {
  test('has an element with "list" role', () => {
    render(<EventList />); // Render here
    expect(screen.getByRole("list")).toBeInTheDocument();
  });

  test('renders correct number of events', async () => {
    const allEvents = await getCalendarEvents();
    render(<EventList events={allEvents} />); // Render here
    expect(screen.getAllByRole("listitem")).toHaveLength(allEvents.length);
  });
});

describe('<EventList /> integration', () => {
  test('renders a non-empty list of events when the app is mounted and rendered', async () => {
    render(<App />);
    const EventListDOM = await screen.findByRole('list'); // Use findByRole instead of waitFor
    const EventListItems = within(EventListDOM).queryAllByRole('listitem');
    expect(EventListItems.length).toBe(32); // Adjust based on your test data
  });
});
