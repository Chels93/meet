import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { getEvents } from "../api"; // Ensure getEvents is correctly fetching events
import Event from "../components/Event";

describe("<Event /> component", () => {
  let event;

  beforeEach(async () => {
    const allEvents = await getEvents();
    event = allEvents[0]; // Assuming you're getting at least one event

    // Fallback values if properties are missing
    event.details = event.details || "No details available"; // Provide a default value for details
    event.title = event.title || "Default Title"; // Provide a default title if missing
    event.location = event.location || "Default Location"; // Provide a default location if missing
    event.date = event.date || new Date().toISOString(); // Provide a default date if missing
    event.id = event.id || "default-id"; // Provide a default id if missing
  });

  test("renders event title", () => {
    render(<Event event={event} />);
    expect(screen.getByText(event.title)).toBeInTheDocument();
  });

  test("renders event location", () => {
    render(<Event event={event} />);
    expect(screen.getByText(event.location)).toBeInTheDocument();
  });

  test("renders event details button with the title (show details)", () => {
    render(<Event event={event} />);
    expect(screen.getByText("Show Details")).toBeInTheDocument();
  });

  test("by default, event's details section should be hidden", () => {
    render(<Event event={event} />);
    expect(screen.queryByText(event.details)).not.toBeInTheDocument();
  });

  test("shows the details section when the user clicks on the 'show details' button", async () => {
    const user = userEvent.setup();
    render(<Event event={event} />);
    await user.click(screen.getByText("Show Details"));

    // Check if the details are displayed.
    expect(screen.getByText(event.details)).toBeInTheDocument();
    expect(screen.getByText("Hide Details")).toBeInTheDocument();
    expect(screen.queryByText("Show Details")).not.toBeInTheDocument();
  });

  test("hides the details section when the user clicks on the 'hide details' button", async () => {
    const user = userEvent.setup();
    render(<Event event={event} />);

    await user.click(screen.getByText("Show Details"));
    expect(screen.getByText(event.details)).toBeInTheDocument();
    expect(screen.getByText("Hide Details")).toBeInTheDocument();
    expect(screen.queryByText("Show Details")).not.toBeInTheDocument();

    await user.click(screen.getByText("Hide Details"));
    expect(screen.queryByText(event.details)).not.toBeInTheDocument();
    expect(screen.getByText("Show Details")).toBeInTheDocument();
  });
});
