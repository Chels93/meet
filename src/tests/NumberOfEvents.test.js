import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NumberOfEvents from '../components/NumberOfEvents';

describe('<NumberOfEvents /> component', () => {
  test('renders number of events text input', () => {
    render(<NumberOfEvents />);
    const numberTextBox = screen.queryByRole('textbox');
    expect(numberTextBox).toBeInTheDocument();
    expect(numberTextBox).toHaveClass('number-of-events-input');
  });

  test('default number is 32', () => {
    render(<NumberOfEvents />);
    const numberTextBox = screen.queryByRole('textbox');
    expect(numberTextBox).toHaveValue("32");
  });

  test('number of events text box value changes when the user types in it', async () => {
    render(<NumberOfEvents />);
    const user = userEvent.setup();
    const numberTextBox = screen.queryByRole('textbox');
    await user.clear(numberTextBox); // Clear default value before typing
    await user.type(numberTextBox, "123");

    expect(numberTextBox).toHaveValue("123");
  });
});
