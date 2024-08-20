import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import EventList from "../components/EventList";
import { getEvents } from "../api";
import App from "../App";

// Mock the API call
jest.mock("../api", () => ({
  getEvents: jest.fn(),
}));

describe("<EventList /> component", () => {
  test("has an element with 'list' role", () => {
    render(<EventList events={[]} />); // Render with an empty array to avoid undefined issues
    expect(screen.getByRole("list")).toBeInTheDocument();
  });

  test("renders correct number of events", () => {
    const mockEvents = [
      {
        id: "1",
        summary: "Event 1",
        location: "Location 1",
        start: { dateTime: "2024-01-01T10:00:00" },
        end: { dateTime: "2024-01-01T11:00:00" },
        description: "Details for Event 1",
      },
      {
        id: "2",
        summary: "Event 2",
        location: "Location 2",
        start: { dateTime: "2024-01-02T11:00:00" },
        end: { dateTime: "2024-01-02T12:00:00" },
        description: "Details for Event 2",
      },
    ];

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
      start: { dateTime: "2024-01-01T10:00:00" },
      end: { dateTime: "2024-01-01T11:00:00" },
      description: `Details for Event ${i + 1}`,
    }));
    getEvents.mockResolvedValue(mockEvents);

    render(<App />);

    await waitFor(() => {
      const eventListItems = screen.getAllByRole("listitem");
      expect(eventListItems.length).toBe(32);
    });
  });
});