const { google } = require("googleapis");
const calendar = google.calendar("v3");
const SCOPES = [
  "https://www.googleapis.com/auth/calendar.events.public.readonly",
];
const { CLIENT_SECRET, CLIENT_ID, CALENDAR_ID } = process.env;
const redirect_uris = ["https://Chels93.github.io/meet/"];

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  redirect_uris[0]
);

const getResponseHeaders = () => ({
  "Access-Control-Allow-Origin": "*", // Allow all origins
  "Access-Control-Allow-Credentials": true,
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
});

module.exports.getAuthURL = async () => {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });

  return {
    statusCode: 200,
    headers: getResponseHeaders(),
    body: JSON.stringify({
      authUrl,
    }),
  };
};

module.exports.getAccessToken = async (event) => {
  const code = decodeURIComponent(`${event.pathParameters.code}`);
  try {
    const res = await oAuth2Client.getToken(code);

    console.log("Access token obtained:", res.tokens);
    return {
      statusCode: 200,
      headers: getResponseHeaders(),
      body: JSON.stringify(res.tokens),
    };
  } catch (e) {
    return {
      statusCode: 500,
      headers: getResponseHeaders(),
      body: JSON.stringify({ error: e.message, details: e }),
    };
  }
};

module.exports.getCalendarEvents = async (event) => {
  console.log("Event received:", event);

  if (!event.pathParameters || !event.pathParameters.access_token) {
    return {
      statusCode: 400,
      headers: getResponseHeaders(),
      body: JSON.stringify({ error: "access_token is required" }),
    };
  }

  const access_token = decodeURIComponent(
    `${event.pathParameters.access_token}`
  );
  console.log("Access token received:", access_token);

  try {
    oAuth2Client.setCredentials({ access_token });
    console.log("OAuth2 client set with credentials");

    const response = await calendar.events.list({
      calendarId: CALENDAR_ID,
      auth: oAuth2Client,
      timeMin: new Date().toISOString(),
      singleEvents: true,
      orderBy: "startTime",
    });
    console.log("Received events:", response.data.items);

    return {
      statusCode: 200,
      headers: getResponseHeaders(),
      body: JSON.stringify({ events: response.data.items }),
    };
  } catch (error) {
    return {
      statusCode: error.response.status || 500,
      headers: getResponseHeaders(),
      body: JSON.stringify({ error: error.message }),
    };
  }
};
