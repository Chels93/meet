// src/__tests__/NumberOfEvents.test.js

import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NumberOfEvents from '../components/NumberOfEvents';

describe('<NumberOfEvents /> component', () => {
  test('renders number of events text input', () => {
    const { screen } = render(<NumberOfEvents />);
    const numberTextBox = screen.queryByRole('textbox');
    expect(numberTextBox).toBeInTheDocument();
    expect(numberTextBox).toHaveClass('number-of-events-input');
  });

  test('default number is 32', () => {
    const { screen } = render(<NumberOfEvents />);
    const numberTextBox = screen.queryByRole('textbox');
    expect(numberTextBox).toHaveValue("32");
  });

  test('number of events text box value changes when the user types in it', async () => {
    const user = userEvent.setup();
    const { screen } = render(<NumberOfEvents />);
    const numberTextBox = screen.queryByRole('textbox');
    await user.type(numberTextBox, "123");

    // 32 (the default value already written) + 123
    expect(numberTextBox).toHaveValue("32123");
  });
});
