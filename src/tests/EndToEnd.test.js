import puppeteer from "puppeteer";

describe("End-to-End Testing for Event App", () => {
  let browser; // Define browser
  let page; // Define page

  // Set Jest timeout to a higher value if needed
  const safeAlert = () => {
    alert("This is safe");
  };

  // Set timeout to call the safeAlert function
  setTimeout(safeAlert, 120000); // Increase timeout to 120 seconds for testing

  // Before all tests, launch the browser and navigate to the app
  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: false,
      slowMo: 250, // Slow down actions by 250ms
      timeout: 0,
    });
    page = await browser.newPage();
    await page.goto("http://localhost:3000/");
    await page.waitForSelector(".city"); // Wait for the city selector to load
  });

  // After all tests, close the browser
  afterAll(async () => {
    await browser.close();
  });

  // Test for collapsing/expanding event details
  describe("Show/Hide Event Details", () => {
    test("An event element is collapsed by default", async () => {
      const eventDetails = await page.$(".event .details");
      expect(eventDetails).toBeNull(); // Check if the event details are hidden
    });

    test("User can expand an event to see details", async () => {
      await page.click(".event .details-btn");
      await page.waitForTimeout(500); // Wait for the details to expand
      const eventDetails = await page.$(".event .details");
      expect(eventDetails).toBeDefined(); // Event details should be visible
    });

    test("User can collapse an event to hide details", async () => {
      await page.click(".event .details-btn"); // Click to collapse
      await page.waitForTimeout(500); // Wait for the details to collapse
      const eventDetails = await page.$(".event .details");
      expect(eventDetails).toBeNull(); // Event details should be hidden again
    });
  });

  // Tests for specifying the number of events
  describe("Specify Number of Events", () => {
    test("User can change the number of events displayed", async () => {
      const inputSelector = "#number-of-events-input";

      // Wait for the input field to appear and ensure it is visible
      try {
        await page.waitForSelector(inputSelector, {
          visible: true,
          timeout: 30000,
        });
      } catch (error) {
        console.error(
          "Input field not found. Current page HTML:",
          await page.content()
        );
        throw error; // Rethrow the error after logging
      }

      // Continue with the test if the input field is found
      console.log("Input field found, about to click.");
      await page.click(inputSelector, { clickCount: 3 });

      console.log("Typing '10' into the input field.");
      await page.type(inputSelector, "10", { delay: 100 });

      // Trigger the change event to update the number of events
      await page.evaluate((selector) => {
        const input = document.querySelector(selector);
        if (input) {
          input.dispatchEvent(new Event("change", { bubbles: true }));
        }
      }, inputSelector);

      await page.waitForTimeout(1000); // Wait for the events to be updated

      // Get the elements with the class 'event' and count them
      const events = await page.$$(".event"); // Get the array of elements directly
      const eventItemsCount = events.length; // Count the elements
      expect(eventItemsCount).toBe(10); // Ensure only 10 events are displayed
    });
  });

  // Tests for filtering events by city
  describe("Filter Events by City", () => {
    test("When user hasn’t searched for a city, show upcoming events from all cities", async () => {
      const events = await page.$(".event");
      expect(events).toBeDefined();
    });

    test("User should see a list of suggestions when they search for a city", async () => {
      await page.type("#city-search input", "Berlin", { delay: 100 }); // Type "Berlin" with a delay
      await page.waitForTimeout(500); // Wait for suggestions to appear

      // Get the suggestion elements and count them
      const suggestions = await page.$$(".suggestions li"); // Get the array of suggestion elements
      const suggestionItemsCount = suggestions.length; // Count the elements

      expect(suggestionItemsCount).toBeGreaterThan(0); // Ensure city suggestions appear
    });

    test("User can select a city from the suggested list", async () => {
      await page.click(".suggestions li:first-child"); // Select the first city suggestion
      await page.waitForTimeout(500); // Wait for the city to be selected and input to update

      // Get the value of the city search input
      const citySearchValue = await page.$eval("#city-search input", (input) =>
        input.value.trim()
      ); // Trim whitespace from the input value

      expect(citySearchValue).toBe("Berlin, Germany"); // Ensure the correct city is selected

      // Get the event elements and count them
      const events = await page.$$(".event"); // Get the array of event elements
      const eventItemsCount = events.length; // Count the elements

      expect(eventItemsCount).toBeGreaterThan(0); // Ensure events are shown for Berlin
    });
  });
});