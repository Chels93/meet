import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CitySearch from '../components/CitySearch';
import App from '../App';
import { extractLocations, getEvents } from '../api';

describe('<CitySearch /> component', () => {

  test('renders text input', () => {
    render(<CitySearch allLocations={[]} setCurrentCity={() => {}} />);
    const cityTextBox = screen.getByRole('textbox');
    expect(cityTextBox).toBeInTheDocument();
    expect(cityTextBox).toHaveClass('city');
  });

  test('suggestions list is hidden by default', () => {
    render(<CitySearch allLocations={[]} setCurrentCity={() => {}} />);
    const suggestionList = screen.queryByRole('list');
    expect(suggestionList).not.toBeInTheDocument();
  });

  test('renders a list of suggestions when city text box gains focus', async () => {
    render(<CitySearch allLocations={[]} setCurrentCity={() => {}} />);
    const user = userEvent.setup();
    const cityTextBox = screen.getByRole('textbox');
    await user.click(cityTextBox);

    const suggestionList = screen.getByRole('list');
    expect(suggestionList).toBeInTheDocument();
    expect(suggestionList).toHaveClass('suggestions');
  });

  test('updates list of suggestions correctly when user types in city textbox', async () => {
    const allEvents = await getEvents();
    const allLocations = extractLocations(allEvents);
    render(<CitySearch allLocations={allLocations} setCurrentCity={() => {}} />);

    const user = userEvent.setup();
    const cityTextBox = screen.getByRole('textbox');
    await user.type(cityTextBox, "Berlin");

    const suggestions = allLocations.filter((location) =>
      location.toUpperCase().includes("BERLIN")
    );

    const suggestionListItems = screen.getAllByRole('listitem');
    expect(suggestionListItems).toHaveLength(suggestions.length + 1);
    suggestions.forEach((suggestion, index) => {
      expect(suggestionListItems[index].textContent).toBe(suggestion);
    });
  });

  test('renders the suggestion text in the textbox upon clicking on the suggestion', async () => {
    const allEvents = await getEvents();
    const allLocations = extractLocations(allEvents);
    render(<CitySearch allLocations={allLocations} setCurrentCity={() => {}} />);

    const user = userEvent.setup();
    const cityTextBox = screen.getByRole('textbox');
    await user.type(cityTextBox, "Berlin");

    const BerlinGermanySuggestion = screen.getAllByRole('listitem')[0];
    await user.click(BerlinGermanySuggestion);

    expect(cityTextBox).toHaveValue(BerlinGermanySuggestion.textContent);
  });
});

describe('<CitySearch /> integration', () => {
    test('renders suggestions list when the app is rendered', async () => {
        const allLocations = ['Berlin, Germany', 'Munich, Germany', 'London, UK'];
        const setCurrentCity = jest.fn();
      
        render(<CitySearch allLocations={allLocations} setCurrentCity={setCurrentCity} />);
      
        const input = screen.getByRole('textbox');
        
        // Simulate the input gaining focus
        userEvent.click(input);
      
        // Check if the suggestions list is rendered
        const suggestionItem = await screen.findByText('Berlin, Germany');
        expect(suggestionItem).toBeInTheDocument();
      });
  });
