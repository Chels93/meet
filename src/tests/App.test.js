import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { getEvents } from "../api";
import App from "../App";
import React from "react";

describe("<App /> component", () => {
  test("renders list of events", () => {
    render(<App />);
    expect(screen.getByTestId("event-list")).toBeInTheDocument();
  });

  test("renders CitySearch", () => {
    render(<App />);
    expect(screen.getByTestId("city-search")).toBeInTheDocument();
  });

  test("renders NumberOfEvents", () => {
    render(<App />);
    expect(screen.getByTestId("number-of-events")).toBeInTheDocument();
  });
});

describe("<App /> integration", () => {
  test("renders a list of events matching the city selected by the user", async () => {
    const user = userEvent.setup();
    render(<App />);

    // Interact with CitySearch component
    const CitySearchInput = screen.getByRole("textbox");
    await user.type(CitySearchInput, "Berlin");

    const berlinSuggestionItem = await screen.findByText("Berlin, Germany");
    await user.click(berlinSuggestionItem);

    // Check events list
    const EventList = screen.getByTestId("event-list");
    const allRenderedEventItems = within(EventList).getAllByRole("listitem");

    const allEvents = await getEvents();
    const berlinEvents = allEvents.filter(
      (event) => event.location === "Berlin, Germany"
    );

    expect(allRenderedEventItems.length).toBe(berlinEvents.length);

    allRenderedEventItems.forEach((event) => {
      expect(event.textContent).toContain("Berlin, Germany");
    });
  });
});
