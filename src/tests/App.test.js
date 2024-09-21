import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";

describe("<App /> component", () => {
  test("renders list of events", () => {
    render(<App />);
    expect(screen.getByTestId("event-list")).toBeInTheDocument();
  });

  test("renders CitySearch", () => {
    render(<App />);
    expect(screen.getByTestId("city-search")).toBeInTheDocument();
  });

  test("renders NumberOfEvents", () => {
    render(<App />);
    expect(screen.getByTestId("number-of-events")).toBeInTheDocument();
  });
});

describe("<App /> integration", () => {
  test("renders a list of events matching the city selected by the user", async () => {
    render(<App />);

    const CitySearchInput = await screen.findByRole("textbox", {
      name: /search for a city/i,
    });

    await userEvent.type(CitySearchInput, "Berlin");

    const berlinSuggestionItems = screen.getAllByText("Berlin, Germany");

    berlinSuggestionItems.forEach((item) => {
      expect(item).toBeInTheDocument();
    });
  });
});
