import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NumberOfEvents from "../components/NumberOfEvents";
import React from "react";

describe("<NumberOfEvents />", () => {
  test("renders the input element", () => {
    render(<NumberOfEvents />);
    const inputElement = screen.getByRole("spinbutton");
    expect(inputElement).toBeInTheDocument();
  });

  test("renders number of events input", () => {
    render(<NumberOfEvents />);
    const numberInput = screen.getByRole("spinbutton");
    expect(numberInput).toBeInTheDocument();
    expect(numberInput).toHaveClass("number-of-events-input");
  });

  test("default value of input field is 32", () => {
    render(<NumberOfEvents />);
    const numberInput = screen.getByRole("spinbutton");
    expect(numberInput).toHaveValue(32);
  });

  test("value changes when user types in input field", async () => {
    render(<NumberOfEvents />);
    const user = userEvent.setup();
    const numberInput = screen.getByRole("spinbutton");
    await user.clear(numberInput);
    await user.type(numberInput, "123");
    expect(numberInput).toHaveValue(123);
  });

  test("calls updateEventCount function when input value changes", () => {
    const updateEventCount = jest.fn();
    render(<NumberOfEvents updateEventCount={updateEventCount} />);
    const numberInput = screen.getByRole("spinbutton");
    fireEvent.change(numberInput, { target: { value: "20" } });
    expect(updateEventCount).toHaveBeenCalledWith("20");
  });

  test("input value is 32 initially", () => {
    render(<NumberOfEvents />);
    const numberInput = screen.getByRole("spinbutton");
    expect(numberInput).toHaveValue(32);
  });
});
