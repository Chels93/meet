import mockData from "./mock-data";

// Function to retrieve access token
export const getAccessToken = async () => {
  const accessToken = localStorage.getItem("access_token");
  console.log("Access Token from local storage:", accessToken);

  const tokenCheck = accessToken && (await checkToken(accessToken));

  if (!accessToken || tokenCheck?.error) {
    localStorage.removeItem("access_token");
    const searchParams = new URLSearchParams(window.location.search);
    const code = searchParams.get("code");

    // Redirect to authorization URL if no code is found
    if (!code) {
      console.log("No authorization code found, fetching auth URL...");
      try {
        const response = await fetch(
          "https://act2r8xhmk.execute-api.us-east-1.amazonaws.com/dev/api/get-auth-url"
        );
        if (!response.ok) throw new Error("Failed to fetch auth URL");
        const result = await response.json();
        const { authUrl } = result;
        window.location.href = authUrl; // Redirecting user
        return null;
      } catch (error) {
        console.error("Error fetching auth URL:", error);
        return null;
      }
    }

    // Retrieve token using authorization code
    const token = await getToken(code);
    console.log("Token after retrieval:", token);
    return token;
  }

  return accessToken;
};

// Function to extract unique locations from events
export const extractLocations = (events) => {
  const locations = events.map((event) => event.location);
  return [...new Set(locations)];
};

// Function to check the validity of an access token
const checkToken = async (accessToken) => {
  const response = await fetch(
    `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accessToken}`
  );
  return await response.json();
};

// Function to retrieve the access token using the authorization code
const getToken = async (code) => {
  const encodeCode = encodeURIComponent(code);
  try {
    const response = await fetch(
      `https://act2r8xhmk.execute-api.us-east-1.amazonaws.com/dev/api/token/${encodeCode}`
    );
    if (!response.ok) throw new Error("Failed to retrieve token");
    const { access_token } = await response.json();
    if (access_token) {
      localStorage.setItem("access_token", access_token);
    }
    return access_token;
  } catch (error) {
    console.error("Error retrieving token:", error);
    return null;
  }
};

// Function to fetch calendar events
export const getEvents = async () => {
  if (window.location.href.startsWith("http://localhost")) {
    return mockData; // Use mock data during development
  }

  // Check if offline and retrieve last events from local storage
  if (!navigator.onLine) {
    const events = localStorage.getItem("lastEvents");
    return events ? JSON.parse(events) : [];
  }

  const token = await getAccessToken();
  if (token) {
    removeQuery(); // Clean up URL
    const url = `https://act2r8xhmk.execute-api.us-east-1.amazonaws.com/dev/api/get-events/${token}`;
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch events");
      const result = await response.json();
      localStorage.setItem("lastEvents", JSON.stringify(result.events));
      return result.events || [];
    } catch (error) {
      console.error("Error fetching events:", error);
      return [];
    }
  }
};

// Function to remove query parameters from URL
const removeQuery = () => {
  let newurl;
  if (window.history.pushState && window.location.pathname) {
    newurl =
      window.location.protocol +
      "//" +
      window.location.host +
      window.location.pathname;
  } else {
    newurl = window.location.protocol + "//" + window.location.host;
  }
  window.history.pushState("", "", newurl);
};
