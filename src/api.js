import mockData from "./mock-data";

/**
 * Extracts unique locations from an array of events.
 * @param {Array} events - An array of event objects, each containing a location property.
 * @returns {Array} - An array of unique locations.
 */
export const extractLocations = (events) => {
  // Extract location from each event and create a Set to remove duplicates
  const extractedLocations = events.map((event) => event.location);
  const locations = [...new Set(extractedLocations)];
  return locations;
};

/**
 * Checks if the provided access token is valid by calling the tokeninfo endpoint.
 * @param {string} accessToken - The access token to check.
 * @returns {Object} - The result from the tokeninfo endpoint.
 */
const checkToken = async (accessToken) => {
  const response = await fetch(
    `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accessToken}`
  );
  const result = await response.json();
  return result;
};

/**
 * Retrieves events from the API or mock data based on the environment.
 * @returns {Array|null} - An array of events or null if no events are found.
 */
export const getEvents = async () => {
  if (window.location.href.startsWith("http://localhost")) {
    return mockData; // Return mock data if running locally
  }

  const token = await getAccessToken();

  if (token) {
    removeQuery(); // Clean the URL query parameters
    const url = `https://i8ud6jtxbc.execute-api.us-east-1.amazonaws.com/dev/api/get-events/${token}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      return result.events || null;
    } catch (error) {
      console.error('Error fetching events:', error);
      return null;
    }
  }
  return null; // Return null if no token is available
};

/**
 * Removes query parameters from the URL.
 */
const removeQuery = () => {
  let newUrl;
  if (window.history.pushState && window.location.pathname) {
    newUrl =
      window.location.protocol +
      "//" +
      window.location.host +
      window.location.pathname;
    window.history.pushState("", "", newUrl);
  } else {
    newUrl = window.location.protocol + "//" + window.location.host;
    window.history.pushState("", "", newUrl);
  }
};

/**
 * Retrieves an access token either from local storage or by exchanging an authorization code.
 * @param {string} [code] - The authorization code to exchange for an access token.
 * @returns {Promise<string|void>} - The access token or void if a redirect is required.
 */
export const getAccessToken = async (code) => {
  const accessToken = localStorage.getItem("access_token");
  const tokenCheck = accessToken && (await checkToken(accessToken));

  if (!accessToken || tokenCheck.error) {
    await localStorage.removeItem("access_token");
    const searchParams = new URLSearchParams(window.location.search);
    code = code || searchParams.get("code"); // Use the provided code or get it from URL

    if (!code) {
      // Redirect to authorization URL if no code is available
      const response = await fetch(
        "https://i8ud6jtxbc.execute-api.us-east-1.amazonaws.com/dev/api/get-auth-url"
      );
      const result = await response.json();
      const { authUrl } = result;
      window.location.href = authUrl; // Redirect to authentication URL
    } else {
      // Exchange the authorization code for an access token
      const response = await fetch(
        `https://i8ud6jtxbc.execute-api.us-east-1.amazonaws.com/dev/api/token/${code}`
      );
      const result = await response.json();
      const { access_token } = result;
      if (access_token) {
        localStorage.setItem("access_token", access_token);
        return access_token;
      }
    }
  }
  return accessToken; // Return the access token if valid
};