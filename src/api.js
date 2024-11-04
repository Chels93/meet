import mockData from "./mock-data";

export const getAccessToken = async () => {
  const accessToken = localStorage.getItem("access_token");
  console.log("Access Token from local storage:", accessToken);

  const tokenCheck = accessToken && (await checkToken(accessToken));

  if (!accessToken || tokenCheck?.error) {
    localStorage.removeItem("access_token");
    const searchParams = new URLSearchParams(window.location.search);
    const code = searchParams.get("code");

    if (!code) {
      console.log("No authorization code found, fetching auth URL...");
      return await fetchAuthUrl();
    }

    return await getToken(code);
  }

  return accessToken;
};

const fetchAuthUrl = async () => {
  try {
    const response = await fetch("https://act2r8xhmk.execute-api.us-east-1.amazonaws.com/dev/api/get-auth-url");
    if (!response.ok) throw new Error("Failed to fetch auth URL");
    const { authUrl } = await response.json();
    window.location.href = authUrl;
    return null;
  } catch (error) {
    console.error("Error fetching auth URL:", error);
    return null;
  }
};

export const extractLocations = (events) => {
  const locations = events.map((event) => event.location);
  return [...new Set(locations)];
};

const checkToken = async (accessToken) => {
  const response = await fetch(`https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accessToken}`);
  return await response.json();
};

const getToken = async (code) => {
  const encodeCode = encodeURIComponent(code);
  try {
    const response = await fetch(`https://act2r8xhmk.execute-api.us-east-1.amazonaws.com/dev/api/token/${encodeCode}`);
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

export const getEvents = async () => {
  if (window.location.href.startsWith("http://localhost")) {
    return mockData;
  }

  if (!navigator.onLine) {
    const events = localStorage.getItem("lastEvents");
    return events ? JSON.parse(events) : [];
  }

  const token = await getAccessToken();
  if (token) {
    removeQuery();
    return await fetchEvents(token);
  }
};

const fetchEvents = async (token) => {
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
};

const removeQuery = () => {
  const newurl = window.location.protocol + "//" + window.location.host + window.location.pathname;
  window.history.pushState("", "", newurl);
};
