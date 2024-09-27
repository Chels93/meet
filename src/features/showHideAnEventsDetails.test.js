import { defineFeature, loadFeature } from 'jest-cucumber';
import { render, screen, fireEvent } from '@testing-library/react';
import EventList from '../components/EventList';

// Mock event data
const mockEvents = [
  {
    id: '1', // Use string IDs
    title: 'Event 1',
    details: 'Details of Event 1',
  },
  {
    id: '2', // Use string IDs
    title: 'Event 2',
    details: 'Details of Event 2',
  },
];

const feature = loadFeature('./src/features/showHideAnEventsDetails.feature');

defineFeature(feature, (test) => {
  test('An event element is collapsed by default', ({ given, when, then }) => {
    given('the user is on the event list page', () => {
      render(<EventList events={mockEvents} />); // Pass mock events to EventList
    });

    when('the user views an event', () => {
      // No action, just verifying the default state
    });

    then('the event details should be hidden', () => {
      const eventDetails = screen.queryByTestId('event-details-1'); // Check if the first event's details are hidden
      expect(eventDetails).not.toBeInTheDocument(); // Details should not be rendered yet
    });
  });

  test('User can expand an event to see details', ({ given, when, then }) => {
    given('the user is on the event list page', () => {
      render(<EventList events={mockEvents} />); // Pass mock events to EventList
    });

    when('the user clicks on the expand button for an event', () => {
      const expandButton = screen.getByTestId('expand-button-1'); // Find the expand button for the first event
      fireEvent.click(expandButton); // Simulate clicking the expand button
    });

    then('the event details should be visible', () => {
      const eventDetails = screen.getByTestId('event-details-1'); // Find the first event's details
      expect(eventDetails).toBeInTheDocument(); // Expect details to be rendered
      expect(eventDetails).toBeVisible(); // Check that the details are visible
    });
  });

  test('User can collapse an event to hide details', ({ given, when, then }) => {
    given('the user has expanded an event', () => {
      render(<EventList events={mockEvents} />); // Pass mock events to EventList
      const expandButton = screen.getByTestId('expand-button-1'); // Find the expand button for the first event
      fireEvent.click(expandButton); // Expand the event
    });

    when('the user clicks on the collapse button for that event', () => {
      const collapseButton = screen.getByTestId('expand-button-1'); // Find the collapse button (same as expand button)
      fireEvent.click(collapseButton); // Collapse the event
    });

    then('the event details should be hidden again', () => {
      const eventDetails = screen.queryByTestId('event-details-1'); // Check if the first event's details are hidden again
      expect(eventDetails).not.toBeInTheDocument(); // Expect details to be hidden
    });
  });
});
