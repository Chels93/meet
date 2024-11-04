import { render, waitFor, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { getEvents } from "../api";
import App from "../App";

// Mock the getEvents function
jest.mock("../api", () => ({
  getEvents: jest.fn(),
}));

describe("<App /> component", () => {
  beforeEach(async () => {
    getEvents.mockResolvedValue([
      {
        id: 1,
        location: "Berlin, Germany",
        date: "2020-05-19",
        summary: "Event 1 Summary",
      },
      {
        id: 2,
        location: "Berlin, Germany",
        date: "2020-05-20",
        summary: "Event 2 Summary",
      },
    ]);

    await act(async () => {
      render(<App />);
    });

    // Wait for the API to be called
    await waitFor(() => expect(getEvents).toHaveBeenCalled());
  });

  test("renders list of events", async () => {
    // Mock the events to be returned
    const mockEvents = [
      { location: "Berlin, Germany", summary: "Event 1", date: "2024-11-01" },
      { location: "Berlin, Germany", summary: "Event 2", date: "2024-11-02" },
    ];
    getEvents.mockResolvedValueOnce(mockEvents);

    render(<App />);

    // Wait for the event list to appear
    const eventListItems = await screen.findAllByRole("listitem");
    expect(eventListItems).toHaveLength(mockEvents.length);
  });

  test("renders CitySearch", () => {
    expect(screen.getByTestId("city-search")).toBeInTheDocument();
  });

  test("renders NumberOfEvents", () => {
    expect(screen.getByLabelText(/number of events/i)).toBeInTheDocument();
  });
});

describe("<App /> integration", () => {
  test("updates event list when number of events is changed", async () => {
    const mockEvents = Array.from({ length: 5 }, (_, i) => ({
      location: "Berlin, Germany",
      summary: `Event ${i + 1}`,
      date: `2024-11-0${i + 1}`,
    }));
    getEvents.mockResolvedValueOnce(mockEvents); // Ensure this is the first resolution

    render(<App />);

    // Change the number of events input
    const input = screen.getByLabelText(/number of events/i);
    await userEvent.clear(input);
    await userEvent.type(input, "2");

    // Wait for the expected call count
    await waitFor(() => expect(getEvents).toHaveBeenCalledTimes(3)); // Adjust based on your expectations

    const eventListItems = screen.getAllByRole("listitem");
    expect(eventListItems).toHaveLength(5);
  });
});
