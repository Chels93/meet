import { loadFeature, defineFeature } from "jest-cucumber";
import { render, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";
import { getEvents } from "../api";

const feature = loadFeature("./src/features/filterEventsByCity.feature");

defineFeature(feature, (test) => {
  // Scenario 1: When user hasn’t searched for a city, show upcoming events from all cities
  test("When user hasn’t searched for a city, show upcoming events from all cities", ({
    given,
    when,
    then,
  }) => {
    let AppComponent;

    given("the user hasn't searched for a city", () => {
      // No setup needed
    });

    when("the user opens the app", () => {
      AppComponent = render(<App />);
    });

    then("the user should see the list of all upcoming events", async () => {
      const AppDOM = AppComponent.container.firstChild;
      const EventListDOM = AppDOM.querySelector('#event-list');

      await waitFor(() => {
        const EventListItems = within(EventListDOM).queryAllByRole("listitem");
        expect(EventListItems.length).toBe(32); // Replace with actual mock data length
      });
    });
  });

  // Scenario 2: User should see a list of suggestions when they search for a city
  test("User should see a list of suggestions when they search for a city", ({
    given,
    when,
    then,
  }) => {
    let AppComponent;

    given("the user opens the app", () => {
      AppComponent = render(<App />);
    });

    when("the user starts typing a city name in the textbox", async () => {
      const user = userEvent.setup();
      const AppDOM = AppComponent.container.firstChild;
      const CitySearchDOM = AppDOM.querySelector('#city-search');
      const CitySearchInput = within(CitySearchDOM).getByRole('textbox');
      await user.type(CitySearchInput, "Berlin");
    });

    then("the user should see a list of city suggestions from the dropdown", async () => {
      const CitySearchDOM = AppComponent.container.querySelector('#city-search');
      const suggestionListItems = within(CitySearchDOM).queryAllByRole('listitem');
      await waitFor(() => {
        expect(suggestionListItems.length).toBe(2); // Replace with the expected number of suggestions
      });
    });
  });

  // Scenario 3: User can select a city from the suggested list
  test("User can select a city from the suggested list", ({
    given,
    and,
    when,
    then,
  }) => {
    let AppComponent;
    let CitySearchDOM;
    let citySearchInput;

    given("the event list is displayed", async () => {
      AppComponent = render(<App />);
      const user = userEvent.setup();
      const AppDOM = AppComponent.container.firstChild;
      CitySearchDOM = AppDOM.querySelector('#city-search');
      citySearchInput = within(CitySearchDOM).queryByRole('textbox');
      await user.type(citySearchInput, "Berlin");
    });

    and("the list of suggested cities is showing", async () => {
      const suggestionListItems = within(CitySearchDOM).queryAllByRole('listitem');
      await waitFor(() => {
        expect(suggestionListItems.length).toBe(2); // Ensure suggestions are available
      });
    });

    when("the user selects a city (e.g., 'Berlin, Germany') from the list", async () => {
      const user = userEvent.setup();
      const suggestionListItems = within(CitySearchDOM).queryAllByRole('listitem');
      await user.click(suggestionListItems[0]); // Assuming the first suggestion is "Berlin, Germany"
    });

    then("their city should be changed to that city (i.e., “Berlin, Germany”)", () => {
      expect(citySearchInput.value).toBe("Berlin, Germany"); // Check if the input has the selected city
    });

    and("the user should receive a list of upcoming events in that city", async () => {
      const EventListDOM = AppComponent.container.querySelector('#event-list');
      const EventListItems = within(EventListDOM).queryAllByRole('listitem');
      const allEvents = await getEvents();

      // Filtering the list of all events down to events located in "Berlin, Germany"
      const berlinEvents = allEvents.filter(event => event.location === "Berlin, Germany");
      expect(EventListItems.length).toBe(berlinEvents.length);
    });
  });
});
