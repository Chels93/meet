import { render, screen } from '@testing-library/react';
import EventList from '../components/EventList';
import { getEvents } from '../api';

describe('<EventList /> component', () => {
  test('has an element with "list" role', () => {
    render(<EventList />);
    // Using getByRole to ensure the element is present
    expect(screen.getByRole("list")).toBeInTheDocument();
  });

  test('renders correct number of events', async () => {
    const allEvents = await getEvents();
    // Render the component with the events data
    render(<EventList events={allEvents} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(allEvents.length);
  });
});