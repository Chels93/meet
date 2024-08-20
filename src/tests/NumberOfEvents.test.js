import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";
import { getEvents, extractLocations } from "../api";
import mockData from "../mock-data";

// Mock the API calls
jest.mock("../api", () => ({
  getEvents: jest.fn(),
  extractLocations: jest.fn(),
}));

describe("<App /> integration", () => {
  beforeEach(() => {
    getEvents.mockResolvedValue(mockData);
    extractLocations.mockReturnValue(["Berlin, Germany", "New York", "London"]);
  });

  test("renders a list of events matching the number of events selected by the user", async () => {
    render(<App />);
    
    // Ensure that the initial number of events is displayed
    const numberOfEventsInput = screen.getByRole("spinbutton");
    await userEvent.clear(numberOfEventsInput);
    await userEvent.type(numberOfEventsInput, "10");
    
    // Wait for the events to update
    await waitFor(() => {
      const eventItems = screen.getAllByTestId("event-item");
      expect(eventItems.length).toBe(10); // Ensure the number of events matches
    });
  });

  test("Users can change the number of events displayed", async () => {
    render(<App />);

    // Change the number of events
    const numberOfEventsInput = screen.getByRole("spinbutton");
    await userEvent.clear(numberOfEventsInput);
    await userEvent.type(numberOfEventsInput, "10");

    // Wait for the events to update
    await waitFor(() => {
      const eventItems = screen.getAllByTestId("event-item");
      expect(eventItems.length).toBe(10); // Ensure the number of events matches
    });
  });
});