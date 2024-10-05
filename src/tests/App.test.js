// src/__tests__/App.test.js

import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getCalendarEvents } from '../api';
import App from '../App';

describe('<App /> component', () => {
  test('renders list of events', () => {
    render(<App />);
    expect(screen.getByTestId('event-list')).toBeInTheDocument();
  });

  test('render CitySearch', () => {
    render(<App />);
    expect(screen.getByTestId('city-search')).toBeInTheDocument();
  });

  test('render NumberOfEvents', () => {
    render(<App />);
    expect(screen.getByTestId('number-of-events')).toBeInTheDocument();
  });
});

describe('<App /> integration', () => {
  test('renders a list of events matching the city selected by the user', async () => {
    const user = userEvent.setup();
    render(<App />);

    const CitySearchDOM = screen.getByTestId('city-search');
    const CitySearchInput = within(CitySearchDOM).getByRole('textbox');

    await user.type(CitySearchInput, "Berlin");
    const berlinSuggestionItem = within(CitySearchDOM).getByText('Berlin, Germany');
    await user.click(berlinSuggestionItem);

    const EventListDOM = screen.getByTestId('event-list');
    const allRenderedEventItems = within(EventListDOM).getAllByRole('listitem');

    const allEvents = await getCalendarEvents();
    const berlinEvents = allEvents.filter(event => event.location === 'Berlin, Germany');

    expect(allRenderedEventItems.length).toBe(berlinEvents.length);

    allRenderedEventItems.forEach(event => {
      expect(event.textContent).toContain("Berlin, Germany");
    });
  });
});
