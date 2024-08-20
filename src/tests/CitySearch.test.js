import { render, screen, within, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CitySearch from "../components/CitySearch";
import { extractLocations, getEvents } from "../api"; // Ensure these imports are correct

jest.mock("../api", () => ({
  extractLocations: jest.fn(),
  getEvents: jest.fn()
}));

describe("<CitySearch /> component", () => {
  test("renders text input", () => {
    render(<CitySearch allLocations={[]} setCurrentCity={jest.fn()} />);
    const input = screen.getByRole("textbox");
    expect(input).toBeInTheDocument();
  });

  test("suggestions list is hidden by default", () => {
    render(<CitySearch allLocations={[]} setCurrentCity={jest.fn()} />);
    const suggestionList = screen.queryByRole("list");
    expect(suggestionList).not.toBeInTheDocument();
  });

  test("renders a list of suggestions when city textbox gains focus", async () => {
    const allLocations = ["Berlin, Germany", "Munich, Germany"];
    render(<CitySearch allLocations={allLocations} setCurrentCity={jest.fn()} />);
    
    const input = screen.getByRole("textbox");
    userEvent.click(input);

    // Wait for suggestions to appear
    const suggestionListItems = await screen.findAllByRole("listitem");
    expect(suggestionListItems.length).toBeGreaterThan(0); // Expect some suggestions
  });

  test("updates list of suggestions correctly when user types in city textbox", async () => {
    const allLocations = ["Berlin, Germany", "Munich, Germany"];
    render(<CitySearch allLocations={allLocations} setCurrentCity={jest.fn()} />);
    
    const input = screen.getByRole("textbox");
    await userEvent.type(input, "Berlin");

    // Wait for suggestions to appear
    const suggestionListItems = await screen.findAllByRole("listitem");
    expect(suggestionListItems.length).toBe(2); // Berlin plus "See all cities"
    expect(suggestionListItems[0]).toHaveTextContent("Berlin, Germany");
    expect(suggestionListItems[1]).toHaveTextContent("See all cities");
  });

  test("renders suggestions list when the app is rendered", async () => {
    const mockEvents = [{ location: "Berlin, Germany" }, { location: "Munich, Germany" }];
    extractLocations.mockReturnValue(["Berlin, Germany", "Munich, Germany"]);
    getEvents.mockResolvedValue(mockEvents);

    render(<CitySearch allLocations={["Berlin, Germany", "Munich, Germany"]} setCurrentCity={jest.fn()} />);
    
    // Wait for CitySearch component to be rendered
    const CitySearchDOM = await screen.findByTestId("city-search");
    const cityTextBox = within(CitySearchDOM).getByRole("textbox");

    // Simulate user interaction to trigger suggestions
    await userEvent.type(cityTextBox, "B");
    
    // Ensure that the suggestions list contains at least one item
    await waitFor(() => {
      const suggestionListItems = screen.getAllByRole("listitem");
      expect(suggestionListItems.length).toBeGreaterThan(0); // Expect some suggestions
    });
  });

  test("renders suggestion text in the textbox upon clicking on the suggestion", async () => {
    const allLocations = ["Berlin, Germany", "Munich, Germany"];
    render(<CitySearch allLocations={allLocations} setCurrentCity={jest.fn()} />);
    
    const input = screen.getByRole("textbox");
    await userEvent.type(input, "Berlin");

    // Wait for suggestions to appear
    const suggestion = await screen.findByText("Berlin, Germany");
    userEvent.click(suggestion);

    // Check if the input value has been updated with the selected suggestion
    await waitFor(() => {
      expect(input).toHaveValue("Berlin, Germany");
    });
  });
});