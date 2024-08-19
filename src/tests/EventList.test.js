import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import EventList from "../components/EventList";
import { getEvents } from "../api";
import App from "../App";

// Mock getEvents API call if necessary
jest.mock("../api", () => ({
  getEvents: jest.fn(),
}));

describe("<EventList /> component", () => {
  test("has an element with 'list' role", () => {
    render(<EventList events={[]} />); // Render with an empty array to avoid undefined issues
    expect(screen.getByRole("list")).toBeInTheDocument();
  });

  test("renders correct number of events", async () => {
    const mockEvents = [
      { id: "1", summary: "Event 1", location: "Location 1" },
      { id: "2", summary: "Event 2", location: "Location 2" },
    ];
    getEvents.mockResolvedValue(mockEvents);
    render(<EventList events={mockEvents} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(mockEvents.length);
  });
});

describe("<EventList /> integration", () => {
  test("renders a list of events when the app is mounted and rendered", async () => {
    const mockEvents = Array.from({ length: 32 }, (_, i) => ({
      id: `${i + 1}`,
      summary: `Event ${i + 1}`,
      location: `Location ${i + 1}`,
    }));
    getEvents.mockResolvedValue(mockEvents); // Mock the resolved value

    render(<App />);

    await waitFor(() => {
      const EventListItems = screen.getAllByRole("listitem");
      expect(EventListItems.length).toBe(32);
    });
  });
});
