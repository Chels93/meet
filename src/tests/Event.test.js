// src/tests/Event.test.js
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getCalendarEvents } from '../api'; // Ensure mock or fixture for event fetching
import Event from '../components/Event';

describe('<Event /> component', () => {
  let allEvents;

  beforeEach(async () => {
    allEvents = await getCalendarEvents(); // Replace this with your actual mock API call
  });

  test('renders event title', () => {
    render(<Event event={allEvents[0]} />); // Moved render into the test
    expect(screen.getByText(allEvents[0].summary)).toBeInTheDocument();
  });

  test('renders event location', () => {
    render(<Event event={allEvents[0]} />); // Moved render into the test
    expect(screen.getByText(allEvents[0].location)).toBeInTheDocument();
  });

  test('renders event details button with the title (show details)', () => {
    render(<Event event={allEvents[0]} />); // Moved render into the test
    expect(screen.getByText('Show details')).toBeInTheDocument();
  });

  test("by default, event's details section should be hidden", () => {
    render(<Event event={allEvents[0]} />); // Moved render into the test
    expect(screen.queryByTestId(`event-details-${allEvents[0].id}`)).not.toBeInTheDocument();
  });

  test("shows the details section when the user clicks on the 'show details' button", async () => {
    const user = userEvent.setup();
    render(<Event event={allEvents[0]} />); // Moved render into the test

    // Simulate user clicking on the 'show details' button
    await user.click(screen.getByText('Show details'));

    // Verify that details are visible
    expect(screen.getByTestId(`event-details-${allEvents[0].id}`)).toBeInTheDocument();
    expect(screen.getByText('Hide details')).toBeInTheDocument();
    expect(screen.queryByText('Show details')).not.toBeInTheDocument();
  });

  test("hides the details section when the user clicks on the 'hide details' button", async () => {
    const user = userEvent.setup();
    render(<Event event={allEvents[0]} />); // Moved render into the test

    // Expand event details first
    await user.click(screen.getByText('Show details'));

    // Now collapse the details
    await user.click(screen.getByText('Hide details'));

    // Verify that details are hidden again
    expect(screen.queryByTestId(`event-details-${allEvents[0].id}`)).not.toBeInTheDocument();
    expect(screen.getByText('Show details')).toBeInTheDocument();
    expect(screen.queryByText('Hide details')).not.toBeInTheDocument();
  });
});
