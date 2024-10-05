// src/api.js
import mockData from "./mock-data"; // Import the mockData

// Function to extract unique locations from events
export const extractLocations = (events) => {
  const extractedLocations = events.map((event) => event.location);
  const locations = [...new Set(extractedLocations)];
  return locations;
};

// Function to check the validity of an access token
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
        `Failed to validate token: ${errorResponse.error || response.statusText}`
      );
    }

    return await response.json(); // Return token info
  } catch (error) {
    console.error("Error checking token:", error);
    return { error: true }; // Return an error object for consistent handling
  }
};

// Function to retrieve the access token using the authorization code
const getToken = async (code) => {
  const encodedCode = encodeURIComponent(code);
  try {
    const response = await fetch(
      "https://i8ud6jtxbc.execute-api.us-east-1.amazonaws.com/prod/api/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: encodedCode }),
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
      localStorage.setItem("access_token", access_token); // Store the access token
    }
    return access_token; // Return the access token
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
    const code = searchParams.get("code"); // Get authorization code from URL

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

    const token = await getToken(code); // Retrieve token using the authorization code
    console.log("Token after retrieval:", token); // Log the token after retrieval
    return token;
  }

  return accessToken; // Return the existing access token
};

// Function to fetch calendar events
export const getCalendarEvents = async () => {
  // Check for mock data during local development
  if (window.location.href.startsWith("http://localhost")) {
    console.log("Returning mock data:", mockData);
    return mockData;
  }

  const token = await getAccessToken(); // Get the access token

  if (!token) {
    console.error("No access token found.");
    return []; // Return an empty array if no token is available
  }

  removeQuery(); // Clean up the URL
  const url = "https://i8ud6jtxbc.execute-api.us-east-1.amazonaws.com/prod/api/get-events";

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`, // Include the access token in the header
      },
    });

    const result = await response.json();
    console.log("API response:", result);

    if (result && result.events) {
      console.log("Fetched Events:", result.events);
      return result.events; // Return the events
    } else {
      console.error("No events found in the response.");
      return []; // Return empty array if no events found
    }
  } catch (error) {
    console.error("Error fetching events:", error);
    return []; // Return empty array on error
  }
};

// Function to remove query parameters from the URL
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
