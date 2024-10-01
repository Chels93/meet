// src/features/showHideAnEventsDetails.feature

import { defineFeature, loadFeature } from 'jest-cucumber';
import { render, screen, fireEvent } from '@testing-library/react';
import EventList from '../components/EventList';

// Mock event data
const mockEvents = [
  {
    id: '1',
    summary: 'Event 1',
    location: 'Location 1',
    created: new Date().toISOString(),
    description: 'Details of Event 1',
  },
  {
    id: '2',
    summary: 'Event 2',
    location: 'Location 2',
    created: new Date().toISOString(),
    description: 'Details of Event 2',
  },
];

const feature = loadFeature('./src/features/showHideAnEventsDetails.feature');

defineFeature(feature, (test) => {
  test('An event element is collapsed by default', ({ given, when, then }) => {
    given('the user is on the event list page', () => {
      render(<EventList events={mockEvents} />);
    });

    when('the user views an event', () => {
      // No action, just verifying the default state
    });

    then('the event details should be hidden', () => {
      const eventDetails = screen.queryByTestId('event-details-1');
      expect(eventDetails).not.toBeInTheDocument();
    });
  });

  test('User can expand an event to see details', ({ given, when, then }) => {
    given('the user is on the event list page', () => {
      render(<EventList events={mockEvents} />);
    });

    when('the user clicks on the expand button for an event', () => {
      const expandButton = screen.getByTestId('expand-button-1');
      fireEvent.click(expandButton);
    });

    then('the event details should be visible', () => {
      const eventDetails = screen.getByTestId('event-details-1');
      expect(eventDetails).toBeInTheDocument();
      expect(eventDetails).toBeVisible();
    });
  });

  test('User can collapse an event to hide details', ({ given, when, then }) => {
    given('the user has expanded an event', () => {
      render(<EventList events={mockEvents} />);
      const expandButton = screen.getByTestId('expand-button-1');
      fireEvent.click(expandButton);
    });

    when('the user clicks on the collapse button for that event', () => {
      const collapseButton = screen.getByTestId('expand-button-1');
      fireEvent.click(collapseButton);
    });

    then('the event details should be hidden again', () => {
      const eventDetails = screen.queryByTestId('event-details-1');
      expect(eventDetails).not.toBeInTheDocument();
    });
  });
});
