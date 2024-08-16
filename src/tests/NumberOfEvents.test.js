import { render, screen, fireEvent } from '@testing-library/react';
import NumberOfEvents from '../components/NumberOfEvents';
import React from 'react';

describe('<NumberOfEvents />', () => {
  const updateEventCount = jest.fn();

  test('renders the input element', () => {
    render(<NumberOfEvents updateEventCount={updateEventCount} />);
    const inputElement = screen.getByRole('spinbutton');
    expect(inputElement).toBeInTheDocument();
  });

  test('default value of input field is 32', () => {
    render(<NumberOfEvents updateEventCount={updateEventCount} />);
    const inputElement = screen.getByRole('spinbutton');
    expect(inputElement.value).toBe('32');
  });

  test('value changes when user types in input field', () => {
    render(<NumberOfEvents updateEventCount={updateEventCount} />);
    const inputElement = screen.getByRole('spinbutton');
    fireEvent.change(inputElement, { target: { value: '10' } });
    expect(inputElement.value).toBe('10');
  });

  test('calls updateEventCount function when input value changes', () => {
    render(<NumberOfEvents updateEventCount={updateEventCount} />);
    const inputElement = screen.getByRole('spinbutton');
    fireEvent.change(inputElement, { target: { value: '20' } });
    expect(updateEventCount).toHaveBeenCalledWith('20');
  });
});