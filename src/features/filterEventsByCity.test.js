import { loadFeature, defineFeature } from "jest-cucumber";
import { render, waitFor, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";
import { act } from "react";

const feature = loadFeature("./src/features/filterEventsByCity.feature");

defineFeature(feature, (test) => {
  let AppComponent;
  let user;

  test("When user hasn’t searched for a city, show upcoming events from all cities", ({ given, when, then }) => {
    given("the user hasn't searched for a city", () => {});

    when("the user opens the app", async () => {
      await act(async () => {
        AppComponent = render(<App />);
      });
    });

    then("the user should see the list of all upcoming events", async () => {
      // Wait for the events to be displayed
      await waitFor(() => {
        const eventListItems = screen.getAllByRole("listitem");
        expect(eventListItems.length).toBe(32); // Adjust this number based on your expected results
      });
    });
  });

  test("User should see a list of suggestions when they search for a city", ({ given, when, then }) => {
    given("the user opens the app", async () => {
      await act(async () => {
        AppComponent = render(<App />);
      });
    });

    when("the user starts typing a city name in the textbox", async () => {
      user = userEvent.setup();
      const citySearchInput = screen.getByPlaceholderText(/search for a city/i);
      await user.type(citySearchInput, "Berlin");
      expect(citySearchInput.value).toBe("Berlin");
    });

    then("the user should see a list of city suggestions from the dropdown", async () => {
      await waitFor(() => {
        const suggestionListItems = screen.getAllByRole("listitem");
        expect(suggestionListItems.length).toBeGreaterThan(0);
      });
    });
  });

  test("User can select a city from the suggested list", ({ given, and, when, then }) => {
    given("the event list is displayed", async () => {
      await act(async () => {
        AppComponent = render(<App />);
      });
      user = userEvent.setup();
      const citySearchInput = screen.getByPlaceholderText(/search for a city/i);
      await user.type(citySearchInput, "Berlin");
    });

    and("the list of suggested cities is showing", async () => {
      await waitFor(() => {
        const suggestionListItems = screen.getAllByRole("listitem");
        expect(suggestionListItems.length).toBeGreaterThan(0);
      });
    });

    when("the user selects a city from the list", async () => {
      const suggestionListItems = await screen.findAllByRole("listitem");
      await userEvent.click(suggestionListItems[0]);
    });

    then("their city should be changed to that city (i.e., “Berlin, Germany”)", async () => {
      const citySearchInput = screen.getByPlaceholderText(/search for a city/i);
      expect(citySearchInput.value).toBe("Berlin, Germany");
    });

    and("the user should receive a list of upcoming events in that city", async () => {
      // Here, you can check that the events are updated based on the selected city
      await waitFor(() => {
        const eventListItems = screen.getAllByRole("listitem");
        // Assuming there are upcoming events for Berlin
        expect(eventListItems.length).toBeGreaterThan(0); // Replace this with an appropriate check for your application
      });
    });
  });
});
