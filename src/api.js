// src/api.js
import mockData from "./mock-data"; // Import the mockData

// Function to extract unique locations from events
export const extractLocations = (events) => {
  const extractedLocations = events.map((event) => event.location);
  const locations = [...new Set(extractedLocations)];
  return locations;
};

// Function to check if the access token is valid
const checkToken = async (accessToken) => {
  try {
    const response = await fetch(
      `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accessToken}`
    );
    if (!response.ok) throw new Error("Failed to validate token");
    return await response.json();
  } catch (error) {
    console.error("Error checking token:", error);
    return null;
  }
};

// Function to get access token using authorization code
const getToken = async (code) => {
  const encodeCode = encodeURIComponent(code);
  const response = await fetch(
    `https://i8ud6jtxbc.execute-api.us-east-1.amazonaws.com/dev/api/token/${encodeCode}`
  );
  const { access_token } = await response.json();
  if (access_token) {
    localStorage.setItem("access_token", access_token);
  }
  return access_token;
};

// Function to get access token from local storage or via authentication
export const getAccessToken = async () => {
  const accessToken = localStorage.getItem("access_token");
  const tokenCheck = accessToken && (await checkToken(accessToken));

  if (!accessToken || tokenCheck.error) {
    await localStorage.removeItem("access_token");
    const searchParams = new URLSearchParams(window.location.search);
    const code = await searchParams.get("code");
    if (!code) {
      const response = await fetch(
        "https://i8ud6jtxbc.execute-api.us-east-1.amazonaws.com/dev/api/get-auth-url"
      );
      const result = await response.json();
      const { authUrl } = result;
      return (window.location.href = authUrl);
    }
    return code && getToken(code);
  }
  return accessToken;
};

// Function to fetch events from the Google Calendar API
export const getEvents = async () => {
  if (window.location.href.startsWith("http://localhost")) {
    return mockData;
  }

  const token = await getAccessToken();
  
  if (token) {
    removeQuery();
    const url = `https://i8ud6jtxbc.execute-api.us-east-1.amazonaws.com/dev/api/get-events/${token}`;
    const response = await fetch(url);
    const result = await response.json();
    if (result) {
      return result.events;
    } else {
      return null;
    }
  }
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
