// src/__tests__/CitySearch.test.js

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CitySearch from '../components/CitySearch';
import { extractLocations, getEvents } from '../api';

describe('<CitySearch /> component', () => {
  
  test('renders text input', () => {
    render(<CitySearch allLocations={[]} setCurrentCity={() => { }} setInfoAlert={() => { }} />);
    
    const cityTextBox = screen.getByRole('textbox');
    expect(cityTextBox).toBeInTheDocument();
    expect(cityTextBox).toHaveClass('city');
  });

  test('suggestions list is hidden by default', () => {
    render(<CitySearch allLocations={[]} setCurrentCity={() => { }} setInfoAlert={() => { }} />);

    const suggestionList = screen.queryByRole('list');
    expect(suggestionList).not.toBeInTheDocument(); // Fixed: "not" instead of "read"
  });

  test('renders a list of suggestions when city text box gains focus', async () => {
    const user = userEvent.setup();
    render(<CitySearch allLocations={[]} setCurrentCity={() => { }} setInfoAlert={() => { }} />);

    const cityTextBox = screen.getByRole('textbox');
    await user.click(cityTextBox);

    const suggestionList = screen.getByRole('list');
    expect(suggestionList).toBeInTheDocument();
    expect(suggestionList).toHaveClass('suggestions');
  });

  test('updates list of suggestions correctly when user types in city textbox', async () => {
    const user = userEvent.setup();
    const allEvents = await getEvents();
    const allLocations = extractLocations(allEvents);
    render(<CitySearch allLocations={allLocations} setCurrentCity={() => { }} setInfoAlert={() => { }} />);

    // User types "Berlin" in city textbox
    const cityTextBox = screen.getByRole('textbox');
    await user.type(cityTextBox, "Berlin");

    // Filter allLocations to locations matching "Berlin"
    const suggestions = allLocations.filter((location) => {
      return location.toUpperCase().includes(cityTextBox.value.toUpperCase());
    });

    // Get all <li> elements inside the suggestion list
    const suggestionListItems = await screen.findAllByRole('listitem'); // Await here
    expect(suggestionListItems).toHaveLength(suggestions.length + 1); // +1 for the default suggestion
    suggestions.forEach((suggestion, index) => {
      expect(suggestionListItems[index].textContent).toBe(suggestion);
    });
  });

  test('renders the suggestion text in the textbox upon clicking on the suggestion', async () => {
    const user = userEvent.setup();
    const allEvents = await getEvents();
    const allLocations = extractLocations(allEvents);
    render(<CitySearch allLocations={allLocations} setCurrentCity={() => { }} setInfoAlert={() => { }} />);

    const cityTextBox = screen.getByRole('textbox');
    await user.type(cityTextBox, "Berlin");

    const BerlinGermanySuggestion = await screen.findAllByRole('listitem'); // Await here
    await user.click(BerlinGermanySuggestion[0]); // Clicking the first suggestion

    expect(cityTextBox).toHaveValue(BerlinGermanySuggestion[0].textContent);
  });
});

describe('<CitySearch /> integration', () => {
    const allLocations = [
      'London, UK',
      'Berlin, Germany',
      'New York, USA'
    ]; // Adjust this based on what you expect to test
  
    const mockSetCurrentCity = jest.fn();
    const mockSetInfoAlert = jest.fn();
  
    beforeEach(() => {
      jest.clearAllMocks(); // Clear mock calls before each test
    });
  
    test('renders suggestions list when the app is rendered', async () => {
      render(
        <CitySearch
          allLocations={allLocations}
          setCurrentCity={mockSetCurrentCity}
          setInfoAlert={mockSetInfoAlert}
        />
      );
  
      // Input to trigger suggestions
      const input = screen.getByPlaceholderText('Search for a city...');
      await userEvent.type(input, 'London');
  
      // Wait for the suggestion list to be populated
      await waitFor(() => {
        const suggestionListItems = screen.getAllByRole('listitem');
        expect(suggestionListItems.length).toBe(2); // 1 suggestion + 1 "See all cities"
      });
      
    });
  });
