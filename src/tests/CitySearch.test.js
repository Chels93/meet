import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CitySearch from "../components/CitySearch";
import App from "../App";
import React from "react";
import { extractLocations, getEvents } from "../api";

describe("<CitySearch /> component", () => {
  test("renders text input", () => {
    render(<CitySearch allLocations={[]} />);
    const cityTextBox = screen.getByRole("textbox");
    expect(cityTextBox).toBeInTheDocument();
    expect(cityTextBox).toHaveClass("city");
  });

  test("suggestions list is hidden by default", () => {
    render(<CitySearch allLocations={[]} />);
    const suggestionList = screen.queryByRole("list");
    expect(suggestionList).not.toBeInTheDocument();
  });

  test("renders a list of suggestions when city textbox gains focus", async () => {
    render(<CitySearch allLocations={[]} />);
    const user = userEvent.setup();
    const cityTextBox = screen.getByRole("textbox");
    await user.click(cityTextBox);
    const suggestionList = screen.getByRole("list");
    expect(suggestionList).toBeInTheDocument();
    expect(suggestionList).toHaveClass("suggestions");
  });

  test("updates list of suggestions correctly when user types in city textbox", async () => {
    const allEvents = await getEvents();
    const allLocations = extractLocations(allEvents);
    render(<CitySearch allLocations={allLocations} />);

    const user = userEvent.setup();
    const cityTextBox = screen.getByRole("textbox");
    await user.type(cityTextBox, "Berlin");

    // filter allLocations to locations matching "Berlin"
    const suggestions = allLocations
      ? allLocations.filter((location) => {
          return (
            location.toUpperCase().indexOf(cityTextBox.value.toUpperCase()) > -1
          );
        })
      : [];

    // get all <li> elements inside the suggestion list
    const suggestionListItems = screen.getAllByRole("listitem");
    expect(suggestionListItems).toHaveLength(suggestions.length + 1);
    suggestions.forEach((suggestion, index) => {
      expect(suggestionListItems[index].textContent).toBe(suggestion);
    });
  });

  test("renders the suggestion text in the textbox upon clicking on the suggestion", async () => {
    const allEvents = await getEvents();
    const allLocations = extractLocations(allEvents);
    render(
      <CitySearch allLocations={allLocations} setCurrentCity={() => {}} />
    );

    const user = userEvent.setup();
    const cityTextBox = screen.getByRole("textbox");
    await user.type(cityTextBox, "Berlin");

    // the suggestion's textContent look like this: "Berlin, Germany"
    const BerlinGermanySuggestion = screen.getAllByRole("listitem")[0];

    await user.click(BerlinGermanySuggestion);

    expect(cityTextBox).toHaveValue(BerlinGermanySuggestion.textContent);
  });
});

describe("<CitySearch /> integration", () => {
  test("renders suggestions list when the app is rendered.", async () => {
    const user = userEvent.setup();
    render(<App />);
    const CitySearchDOM = screen.getByTestId("city-search");
    const cityTextBox = within(CitySearchDOM).getByRole("textbox");
    await user.click(cityTextBox);

    const allEvents = await getEvents();
    const allLocations = extractLocations(allEvents);

    await waitFor(() => {
      const suggestionListItems =
        within(CitySearchDOM).getAllByRole("listitem");
      expect(suggestionListItems.length).toBe(allLocations.length + 1);
    });
  });
});
