// src/tests/Event.test.js
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Event from "../components/Event";

describe("<Event /> component", () => {
  const mockData = [
    {
      id: "1",
      summary: "Sample Event",
      location: "Sample Location",
      details: "Event details go here.",
    },
    // Add more mock events if needed
  ];

  const event = mockData[0]; // Use the first mock event

  let EventComponent;

  beforeEach(() => {
    EventComponent = render(<Event event={event} />);
  });

  test("renders event component", () => {
    expect(EventComponent).toBeTruthy();
  });

  test("renders event location", () => {
    expect(screen.getByText(event.location)).toBeInTheDocument();
  });

  test("renders event details button with the title (show details)", () => {
    expect(screen.getByText("Show details")).toBeInTheDocument();
  });

  test("by default, event's details section should be hidden", () => {
    expect(
      screen.queryByTestId(`event-details-${event.id}`)
    ).not.toBeInTheDocument();
  });

  test("shows the details section when the user clicks on the 'show details' button", async () => {
    const user = userEvent.setup();

    // Simulate user clicking on the 'show details' button
    await user.click(screen.getByText("Show details"));

    // Verify that details are visible
    expect(
      screen.getByTestId(`event-details-${event.id}`)
    ).toBeInTheDocument();
    expect(screen.getByText("Hide details")).toBeInTheDocument();
    expect(screen.queryByText("Show details")).not.toBeInTheDocument();
  });

  test("hides the details section when the user clicks on the 'hide details' button", async () => {
    const user = userEvent.setup();

    // Expand event details first
    await user.click(screen.getByText("Show details"));

    // Now collapse the details
    await user.click(screen.getByText("Hide details"));

    // Verify that details are hidden again
    expect(
      screen.queryByTestId(`event-details-${event.id}`)
    ).not.toBeInTheDocument();
    expect(screen.getByText("Show details")).toBeInTheDocument();
    expect(screen.queryByText("Hide details")).not.toBeInTheDocument();
  });
});