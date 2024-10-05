// src/__tests__/CitySearch.test.js

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CitySearch from '../components/CitySearch';
import App from '../App';
import { extractLocations, getCalendarEvents } from '../api';

describe('<CitySearch /> component', () => {
  test('renders text input', () => {
    render(<CitySearch allLocations={[]} />);
    
    const cityTextBox = screen.queryByRole('textbox');
    expect(cityTextBox).toBeInTheDocument();
    expect(cityTextBox).toHaveClass('city');
  });

  test('suggestions list is hidden by default', () => {
    render(<CitySearch allLocations={[]} />);

    const suggestionList = screen.queryByRole('list');
    expect(suggestionList).not.toBeInTheDocument();
  });

  test('renders a list of suggestions when city text box gains focus', async () => {
    const user = userEvent.setup();
    render(<CitySearch allLocations={[]} />);

    const cityTextBox = screen.queryByRole('textbox');
    await user.click(cityTextBox);

    const suggestionList = screen.queryByRole('list');
    expect(suggestionList).toBeInTheDocument();
    expect(suggestionList).toHaveClass('suggestions');
  });

  test('updates list of suggestions correctly when user types in city textbox', async () => {
    const user = userEvent.setup();
    const allEvents = await getCalendarEvents();
    const allLocations = extractLocations(allEvents);
    render(<CitySearch allLocations={allLocations} />);

    // user types "Berlin" in city textbox
    const cityTextBox = screen.queryByRole('textbox');
    await user.type(cityTextBox, "Berlin");

    // filter allLocations to locations matching "Berlin"
    const suggestions = allLocations.filter((location) => {
      return location.toUpperCase().includes(cityTextBox.value.toUpperCase());
    });

    // get all <li> elements inside the suggestion list
    const suggestionListItems = screen.queryAllByRole('listitem');
    expect(suggestionListItems).toHaveLength(suggestions.length + 1); // +1 for the default suggestion
    suggestions.forEach((suggestion, index) => {
      expect(suggestionListItems[index].textContent).toBe(suggestion);
    });
  });

  test('renders the suggestion text in the textbox upon clicking on the suggestion', async () => {
    const user = userEvent.setup();
    const allEvents = await getCalendarEvents();
    const allLocations = extractLocations(allEvents);
    render(<CitySearch allLocations={allLocations} setCurrentCity={() => { }} />);

    const cityTextBox = screen.queryByRole('textbox');
    await user.type(cityTextBox, "Berlin");

    const BerlinGermanySuggestion = screen.queryAllByRole('listitem')[0];
    await user.click(BerlinGermanySuggestion);

    expect(cityTextBox).toHaveValue(BerlinGermanySuggestion.textContent);
  });
});

describe('<CitySearch /> integration', () => {
  test('renders suggestions list when the app is rendered.', async () => {
    const user = userEvent.setup();
    render(<App />);

    const cityTextBox = screen.getByRole('textbox');
    await user.click(cityTextBox);

    const allEvents = await getCalendarEvents();
    const allLocations = extractLocations(allEvents);

    await waitFor(() => {
      const suggestionListItems = screen.getAllByRole('listitem');
      expect(suggestionListItems.length).toBe(allLocations.length + 1); // +1 for the default suggestion
    });
  });
});
