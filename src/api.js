// src/api.js
import mockData from "./mock-data"; // Import the mockData

// Function to extract unique locations from events
export const extractLocations = (events) => {
  const extractedLocations = events.map((event) => event.location);
  const locations = [...new Set(extractedLocations)];
  return locations;
};

const checkToken = async (accessToken) => {
  console.log("Checking Token:", accessToken); // Log the token being checked
  try {
    const response = await fetch(
      `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accessToken}`
    );
    if (!response.ok) {
      const errorResponse = await response.json();
      console.error("Token validation error response:", errorResponse); // Log error response
      throw new Error(
        `Failed to validate token: ${
          errorResponse.error || response.statusText
        }`
      );
    }
    return await response.json();
  } catch (error) {
    console.error("Error checking token:", error);
    return { error: true }; // Return an error object for consistent handling
  }
};

const getToken = async (code) => {
  const encodeCode = encodeURIComponent(code);
  try {
    const response = await fetch(
      "https://i8ud6jtxbc.execute-api.us-east-1.amazonaws.com/prod/api/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ code: encodeCode })
      }
    );

    if (!response.ok) {
      const errorResponse = await response.json();
      console.error("Error response from token endpoint:", errorResponse);
      throw new Error(`Failed to fetch token: ${errorResponse.error || response.statusText}`);
    }

    const { access_token } = await response.json();
    console.log("Access Token Retrieved:", access_token);

    if (access_token) {
      localStorage.setItem("access_token", access_token);
    }
    return access_token;
  } catch (error) {
    console.error("Error getting token:", error);
    return null; // Return null if there's an error
  }
};

// Function to get access token from local storage or via authentication
export const getAccessToken = async () => {
  const accessToken = localStorage.getItem("access_token");
  const tokenCheck = accessToken && (await checkToken(accessToken));

  if (!accessToken || tokenCheck?.error) {
    await localStorage.removeItem("access_token");
    const searchParams = new URLSearchParams(window.location.search);
    const code = await searchParams.get("code");

    if (!code) {
      console.log("No authorization code found, fetching auth URL..."); // Log this case
      const response = await fetch(
        "https://i8ud6jtxbc.execute-api.us-east-1.amazonaws.com/prod/api/get-auth-url"
      );
      const result = await response.json();
      const { authUrl } = result;
      window.location.href = authUrl; // Redirect to auth URL
      return null; // Explicitly return null after redirection
    }

    const token = await (code && getToken(code));
    console.log("Token after retrieval:", token); // Log the token after retrieval
    return token;
  }
  return accessToken;
};

// Function to fetch events from the Google Calendar API
export const getEvents = async () => {
  if (window.location.href.startsWith("http://localhost")) {
    return mockData;
  }

  const token = await getAccessToken();
  console.log("Access Token Before Fetching Events:", token); // Log the token before fetching events

  if (token) {
    removeQuery();
    const url = "https://i8ud6jtxbc.execute-api.us-east-1.amazonaws.com/prod/api/get-events";
    try {
      const response = await fetch(url);
      const result = await response.json();
      if (result && result.events) {
        console.log("Fetched Events:", result.events); // Log the fetched events
        return result.events;
      } else {
        console.error("No events found in the response."); // Log if no events are found
        return []; // Return an empty array instead of null
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      return []; // Return an empty array in case of an error
    }
  }

  return []; // Return an empty array if no token is found
};

// Function to remove query parameters from the URL
const removeQuery = () => {
  let newurl;
  if (window.history.pushState && window.location.pathname) {
    newurl =
      window.location.protocol +
      "//" +
      window.location.host +
      window.location.pathname;
    window.history.pushState("", "", newurl);
  } else {
    newurl = window.location.protocol + "//" + window.location.host;
    window.history.pushState("", "", newurl);
  }
};
