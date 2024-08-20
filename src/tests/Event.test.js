import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Event from "../components/Event";

describe('<Event /> component', () => {
    let event;

    beforeEach(() => {
        event = {
            title: "Event Title",
            location: "Event Location",
            start: { dateTime: "2024-08-20T10:00:00" },
            end: { dateTime: "2024-08-20T12:00:00" },
            description: "Event Details",
        };
    });

    test("renders event title", () => {
        render(<Event event={event} />);
        expect(screen.getByText((content, element) =>
            content.startsWith("Event Title")
        )).toBeInTheDocument();
    });

    test("renders event location", () => {
        render(<Event event={event} />);
        expect(screen.getByText((content, element) =>
            content.startsWith("Event Location")
        )).toBeInTheDocument();
    });

    test("renders event start time", () => {
        render(<Event event={event} />);
        const startTime = new Date(event.start.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        expect(screen.getByText((content, element) =>
            content.includes(startTime)
        )).toBeInTheDocument();
    });

    test("renders event end time", () => {
        render(<Event event={event} />);
        const endTime = new Date(event.end.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        expect(screen.getByText((content, element) =>
            content.includes(endTime)
        )).toBeInTheDocument();
    });

    test("by default, event's details section is hidden", () => {
        render(<Event event={event} />);
        expect(screen.queryByText(event.description)).not.toBeInTheDocument();
    });

    test("shows event details when 'Show Details' button is clicked", async () => {
        render(<Event event={event} />);
        await userEvent.click(screen.getByText("Show Details"));
        expect(await screen.findByText(event.description)).toBeInTheDocument();
        expect(screen.getByText("Hide Details")).toBeInTheDocument();
        expect(screen.queryByText("Show Details")).not.toBeInTheDocument();
    });

    test("hides event details when 'Hide Details' button is clicked", async () => {
        render(<Event event={event} />);
        await userEvent.click(screen.getByText("Show Details"));
        await userEvent.click(screen.getByText("Hide Details"));
        expect(screen.queryByText(event.description)).not.toBeInTheDocument();
        expect(screen.queryByText("Hide Details")).not.toBeInTheDocument();
        expect(screen.getByText("Show Details")).toBeInTheDocument();
    });
});