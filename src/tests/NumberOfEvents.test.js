// src/__tests__/NumberOfEvents.test.js

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NumberOfEvents from '../components/NumberOfEvents';

describe('<NumberOfEvents /> component', () => {
  let setCurrentNOE;

  beforeEach(() => {
    setCurrentNOE = jest.fn(); // Mock the setter function
    render(<NumberOfEvents setCurrentNOE={setCurrentNOE} setErrorAlert={() => {}} />); // Render component before each test
  });

  test('renders number of events text input', () => {
    const numberTextBox = screen.getByRole('spinbutton', { name: /number of events/i });
    expect(numberTextBox).toBeInTheDocument(); // Verify input is rendered
    expect(numberTextBox).toHaveClass('number-of-events-input'); // Check for specific class
  });

  test('default number is 32', () => {
    const numberTextBox = screen.getByRole('spinbutton', { name: /number of events/i });
    expect(numberTextBox).toHaveValue(32); // Assert the default value is 32
  });

  test('number of events text box value changes when the user types in it', async () => {
    const user = userEvent.setup(); // Initialize user interaction

    const numberTextBox = screen.getByRole('spinbutton', { name: /number of events/i });

    await user.clear(numberTextBox); // Clear the input field
    await user.type(numberTextBox, '20'); // Type new value '20'

    expect(numberTextBox).toHaveValue(20); // Assert input value is updated
    expect(setCurrentNOE).toHaveBeenCalledWith(20); // Verify callback is called with 20
  });
});
