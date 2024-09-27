import puppeteer from 'puppeteer';

describe('End-to-End Testing for Event App', () => {
    let browser; // Define browser
    let page;    // Define page

    // Set Jest timeout to a higher value if needed
    jest.setTimeout(120000); // Increase timeout to 120 seconds for testing

    // Before all tests, launch the browser and navigate to the app
    beforeAll(async () => {
        browser = await puppeteer.launch({
            headless: false, 
            slowMo: 250, // slow down by 250ms
            timeout: 0 
        }); 
        page = await browser.newPage();
        await page.goto('http://localhost:3000/');  
        await page.waitForSelector('.city');
    });

    // After all tests, close the browser
    afterAll(() => { 
        browser.close();
    }); 

    // Add your tests here...
    
    // Test for collapsing/expanding event details
    describe('show/hide event details', () => {
        test('An event element is collapsed by default', async () => {
            const eventDetails = await page.$('.event .details');
            expect(eventDetails).toBeNull();  // Event details should be hidden
        });

        test('User can expand an event to see details', async () => {
            await page.click('.event .details-btn');
            await page.waitForTimeout(500); // Wait for the details to expand
            const eventDetails = await page.$('.event .details');
            expect(eventDetails).toBeDefined();  // Event details should be visible
        });

        test('User can collapse an event to hide details', async () => {
            await page.click('.event .details-btn'); // Click to collapse
            await page.waitForTimeout(500); // Wait for the details to collapse
            const eventDetails = await page.$('.event .details');
            expect(eventDetails).toBeNull();  // Event details should be hidden again
        });
    });

    // Tests for specifying the number of events
    describe('specify number of events', () => {
        test('By default, 32 events are shown', async () => {
            const eventItems = await page.$$eval('.event', events => events.length);
            expect(eventItems).toBe(32);
        });

        test('User can change the number of events displayed', async () => {
            await page.waitForSelector('.number-of-events input'); // Wait for the input to be available
            await page.type('.number-of-events input', '10');
            await page.waitForTimeout(500); // Wait for the events to update
            const eventItems = await page.$$eval('.event', events => events.length);
            expect(eventItems).toBe(10);  // Ensure that only 10 events are displayed
        });
    });

    // Tests for filtering events by city
    describe('filter events by city', () => {
        test('When user hasn’t searched for a city, show upcoming events from all cities', async () => {
            const eventItems = await page.$$eval('.event', events => events.length);
            expect(eventItems).toBe(32);  // Ensure 32 events from all cities are displayed by default
        });

        test('User should see a list of suggestions when they search for a city', async () => {
            await page.type('#city-search input', 'Berlin');
            await page.waitForTimeout(500); // Wait for suggestions to appear
            const suggestionItems = await page.$$eval('.suggestions li', suggestions => suggestions.length);
            expect(suggestionItems).toBeGreaterThan(0);  // Ensure city suggestions appear
        });

        test('User can select a city from the suggested list', async () => {
            await page.click('.suggestions li:first-child');  // Select the first city suggestion
            await page.waitForTimeout(500); // Wait for the city to be selected and the input to update
            const citySearchValue = await page.$eval('#city-search input', input => input.value);
            expect(citySearchValue).toBe('Berlin, Germany');  // Ensure the correct city is selected

            const eventItems = await page.$$eval('.event', events => events.length);
            expect(eventItems).toBeGreaterThan(0);  // Ensure events are shown for Berlin
        });
    });
});
