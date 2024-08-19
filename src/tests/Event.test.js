import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Event from "../components/Event";

describe("<Event /> component", () => {
  const event = {
    title: "Learn JavaScript",
    location: "London, UK",
    date: "Tue, 19 May 2020 19:17:46 GMT",
    details:
      "Have you wondered how you can ask Google to show you the list of the top ten must-see places in London? And how Google presents you the list? How can you submit the details of an application? Well, JavaScript is doing these. :) Javascript offers interactivity to a dull, static website. Come, learn JavaScript with us and make those beautiful websites.",
  };

  test("by default, event's details section is hidden", () => {
    render(<Event event={event} />);
    // Ensure the details are not visible by checking if the 'details' paragraph is not in the document
    expect(screen.queryByText(/Have you wondered/i)).toBeNull();
  });

  test("shows event details when 'Show Details' button is clicked", async () => {
    render(<Event event={event} />);

    // Ensure the 'Show Details' button is present initially
    expect(screen.getByText("Show Details")).toBeInTheDocument();

    // Click the 'Show Details' button
    fireEvent.click(screen.getByText("Show Details"));

    // Wait for the details and 'Hide Details' button to be in the document
    expect(await screen.findByText(/Have you wondered/i)).toBeInTheDocument();
    expect(await screen.findByText("Hide Details")).toBeInTheDocument();

    // Ensure 'Show Details' button is no longer in the document
    expect(screen.queryByText("Show Details")).toBeNull();
  });

  test("hides event details when 'Hide Details' button is clicked", async () => {
    render(<Event event={event} />);

    // Click the 'Show Details' button to reveal details
    fireEvent.click(screen.getByText("Show Details"));

    // Ensure details are visible
    expect(await screen.findByText(/Have you wondered/i)).toBeInTheDocument();
    expect(await screen.findByText("Hide Details")).toBeInTheDocument();

    // Click the 'Hide Details' button
    fireEvent.click(screen.getByText("Hide Details"));

    // Verify that the details and 'Hide Details' button are no longer in the document
    expect(screen.queryByText(/Have you wondered/i)).toBeNull();
    expect(screen.queryByText("Hide Details")).toBeNull();

    // Ensure the 'Show Details' button reappears
    expect(screen.getByText("Show Details")).toBeInTheDocument();
  });
});
