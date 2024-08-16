import { render, screen, waitFor } from "@testing-library/react";
import Event from "../components/Event";
import userEvent from "@testing-library/user-event";
import React from "react";

describe("<Event /> component", () => {
  const event = {
    title: "Sample Event Title",
    location: "Sample Location",
    description: "Sample Description",
    date: "Sample Date",
    time: "Sample Time"
  };

  test("renders event location", async () => {
    render(<Event event={event} />);
    expect(await screen.findByText(event.location)).toBeInTheDocument();
  });

  test("renders event details button with the title (Show Details)", () => {
    render(<Event event={event} />);
    expect(screen.getByText("Show Details")).toBeInTheDocument();
  });

  test("shows event details when 'Show Details' button is clicked", async () => {
    render(<Event event={event} />);
    const showDetailsButton = screen.getByText("Show Details");
    userEvent.click(showDetailsButton);

    // Wait for the description to appear
    await waitFor(() => {
      expect(screen.getByText(event.description)).toBeInTheDocument();
    });

    // Check if the 'Hide Details' button appears
    expect(screen.getByText("Hide Details")).toBeInTheDocument();
  });

  test("hides event details when 'Hide Details' button is clicked", async () => {
    render(<Event event={event} />);
    const showDetailsButton = screen.getByText("Show Details");
    userEvent.click(showDetailsButton);

    const hideDetailsButton = await screen.findByText("Hide Details");
    userEvent.click(hideDetailsButton);

    // Wait for the description to be removed
    await waitFor(() => {
      expect(screen.queryByText(event.description)).not.toBeInTheDocument();
    });

    // Check if the 'Show Details' button appears
    expect(screen.getByText("Show Details")).toBeInTheDocument();
  });
});