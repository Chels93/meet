// src/tests/Event.test.js
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getEvents } from '../api'; // Ensure mock or fixture for event fetching
import Event from '../components/Event';

describe('<Event /> component', () => {
  let EventComponent;
  let allEvents;

  beforeEach(async () => {
    allEvents = await getEvents(); // Replace this with your actual mock API call
    EventComponent = render(<Event event={allEvents[0]} />);
  });

  test('renders event title', () => {
    expect(EventComponent.getByText(allEvents[0].summary)).toBeInTheDocument();
  });

  test('renders event location', () => {
    expect(EventComponent.getByText(allEvents[0].location)).toBeInTheDocument();
  });

  test('renders event details button with the title (show details)', () => {
    expect(EventComponent.getByText('Show details')).toBeInTheDocument();
  });

  test("by default, event's details section should be hidden", () => {
    expect(EventComponent.queryByTestId(`event-details-${allEvents[0].id}`)).not.toBeInTheDocument();
  });

  test("shows the details section when the user clicks on the 'show details' button", async () => {
    const user = userEvent.setup();

    // Simulate user clicking on the 'show details' button
    await user.click(EventComponent.getByText('Show details'));

    // Verify that details are visible
    expect(EventComponent.getByTestId(`event-details-${allEvents[0].id}`)).toBeInTheDocument();
    expect(EventComponent.getByText('Hide details')).toBeInTheDocument();
    expect(EventComponent.queryByText('Show details')).not.toBeInTheDocument();
  });

  test("hides the details section when the user clicks on the 'hide details' button", async () => {
    const user = userEvent.setup();

    // Expand event details first
    await user.click(EventComponent.getByText('Show details'));

    // Now collapse the details
    await user.click(EventComponent.getByText('Hide details'));

    // Verify that details are hidden again
    expect(EventComponent.queryByTestId(`event-details-${allEvents[0].id}`)).not.toBeInTheDocument();
    expect(EventComponent.getByText('Show details')).toBeInTheDocument();
    expect(EventComponent.queryByText('Hide details')).not.toBeInTheDocument();
  });
});
