// src/api.js

import NProgress from "nprogress";
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

// Function to remove query parameters from URL
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

// Function to get access token using authorization code
const getToken = async (code) => {
  const encodeCode = encodeURIComponent(code);
  try {
    const response = await fetch(
      `https://i8ud6jtxbc.execute-api.us-east-1.amazonaws.com/dev/api/token/${encodeCode}`
    );
    if (!response.ok) throw new Error("Failed to fetch access token");
    const { access_token } = await response.json();
    if (access_token) {
      localStorage.setItem("access_token", access_token);
    }
    return access_token;
  } catch (error) {
    console.error("Error fetching token:", error);
    return null;
  }
};

// Function to get access token from local storage or via authentication
const getAccessToken = async () => {
  const accessToken = localStorage.getItem("access_token");
  if (accessToken) {
    const tokenCheck = await checkToken(accessToken);
    if (tokenCheck && !tokenCheck.error) {
      return accessToken;
    }
  }

  localStorage.removeItem("access_token");
  const searchParams = new URLSearchParams(window.location.search);
  const code = searchParams.get("code");

  if (!code) {
    try {
      const response = await fetch(
        "https://i8ud6jtxbc.execute-api.us-east-1.amazonaws.com/dev/api/get-auth-url"
      );
      if (!response.ok) throw new Error("Failed to fetch auth URL");
      const { authUrl } = await response.json();
      window.location.href = authUrl;
      return null; // No further code execution after redirect
    } catch (error) {
      console.error("Error fetching auth URL:", error);
      return null;
    }
  }

  return code && (await getToken(code));
};

// Function to fetch events from the Google Calendar API
export const getEvents = async (numberOfEvents) => {
  NProgress.start();

  if (window.location.href.startsWith("http://localhost")) {
    NProgress.done();
    return mockData.slice(0, numberOfEvents); // Only return the requested number of events from mock data
  }

  try {
    const token = await getAccessToken();
    if (!token) {
      NProgress.done();
      return []; // No token means we cannot fetch events
    }

    removeQuery();
    const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events?maxResults=${numberOfEvents}&access_token=${token}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch events");
    const result = await response.json();
    NProgress.done();
    return result.items || [];
  } catch (error) {
    NProgress.done();
    console.error("Error fetching events:", error);
    return [];
  }
};
