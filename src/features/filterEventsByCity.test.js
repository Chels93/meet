// src/features/filterEventsByCity.test.js
import { loadFeature, defineFeature } from "jest-cucumber";
import { render, waitFor, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";
import { getEvents } from "../api"; // Adjust the import based on your actual API function

const feature = loadFeature("./src/features/filterEventsByCity.feature");

defineFeature(feature, (test) => {
  let user;
  let citySearchInput;
  let AppDOM;
  let CitySearchDOM;

  // Scenario 1: When user hasn’t searched for a city, show upcoming events from all cities
  test("When user hasn’t searched for a city, show upcoming events from all cities", ({
    given,
    when,
    then,
  }) => {
    given("the user hasn't searched for a city", () => {});
    let AppComponent;
    when("the user opens the app", () => {
      AppComponent = render(<App />);
    });

    then("the user should see the list of all upcoming events", async () => {
      const AppDOM = AppComponent.container.firstChild;
      const EventListDOM = AppDOM.querySelector("#event-list");

      await waitFor(() => {
        const EventListItems = within(EventListDOM).queryAllByRole("listitem");
        expect(EventListItems.length).toBe(32);
      });
    });

    // Scenario 2: User should see a list of suggestions when they search for a city
    test("User should see a list of suggestions when they search for a city", ({
      given,
      when,
      then,
    }) => {
      given("the user opens the app", () => {
        render(<App />);
      });

      when("the user starts typing a city name in the textbox", async () => {
        user = userEvent.setup();
        const CitySearchInput =
          screen.getByPlaceholderText(/search for a city/i);
        await user.type(CitySearchInput, "Berlin");
        await waitFor(() => expect(CitySearchInput.value).toBe("Berlin"));
      });

      then(
        "the user should see a list of city suggestions from the dropdown",
        async () => {
          await waitFor(
            async () => {
              const suggestionListItems = await screen.findAllByRole(
                "listitem"
              );
              expect(suggestionListItems.length).toBeGreaterThan(1);
            },
            { timeout: 3000 }
          );
        }
      );
    });

    // Scenario 3: User can select a city from the suggested list
    test("User can select a city from the suggested list", ({
      given,
      and,
      when,
      then,
    }) => {
      // Set up the initial state
      given("the event list is displayed", async () => {
        // Render the App component and assign the result
        AppDOM = render(<App />).container.firstChild; // Corrected line
        CitySearchDOM = AppDOM.querySelector("#city-search");
        citySearchInput = within(CitySearchDOM).queryByRole("textbox");

        // Wait for user to type the city
        const user = userEvent.setup();
        await user.type(citySearchInput, "Berlin");
      });

      and("the list of suggested cities is showing", async () => {
        await waitFor(
          async () => {
            const suggestionListItems = await screen.findAllByRole("listitem");
            expect(suggestionListItems.length).toBeGreaterThan(0); // Adjust as needed
          },
          { timeout: 3000 }
        );
      });

      when("the user selects a city from the list", async () => {
        const suggestionListItems = await screen.findAllByRole("listitem");
        await userEvent.click(suggestionListItems[0]); // Assuming the first suggestion is "Berlin, Germany"
      });

      then(
        "their city should be changed to that city (i.e., “Berlin, Germany”)",
        () => {
          expect(citySearchInput.value).toBe("Berlin, Germany");
        }
      );

      and('the user should receive a list of upcoming events in that city', async () => {
        const EventListDOM = AppDOM.querySelector('#event-list');
        const EventListItems = within(EventListDOM).queryAllByRole('listitem');
        const allEvents = await getEvents();
  
        // filtering the list of all events down to events located in Germany
        // citySearchInput.value should have the value "Berlin, Germany" at this point
        const berlinEvents = allEvents.filter(event => event.location === citySearchInput.value)
        expect(EventListItems).toHaveLength(berlinEvents.length);
      });
    });
  });
});
