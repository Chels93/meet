const { google } = require("googleapis");
const calendar = google.calendar("v3");
const SCOPES = [
  "https://www.googleapis.com/auth/calendar.events.public.readonly",
];
const { CLIENT_SECRET, CLIENT_ID, CALENDAR_ID } = process.env;
const redirectUris = ["https://Chels93.github.io/meet/"];

// Create OAuth2 client
const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  redirectUris[0]
);

// Get authorization URL
module.exports.getAuthURL = async () => {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify({
      authUrl,
    }),
  };
};

// Get access token
module.exports.getAccessToken = async (event) => {
  try {
    const code = decodeURIComponent(`${event.pathParameters.code}`);
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens); // Set credentials after getting the token

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify(tokens), // Return the tokens
    };
  } catch (error) {
    // Handle error
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error retrieving access token",
        error: error.message,
      }),
    };
  }
};

// Get calendar events
module.exports.getEvents = async (event) => {
  try {
    const access_token = decodeURIComponent(`${event.pathParameters.access_token}`);
    oAuth2Client.setCredentials({ access_token });

    const response = await calendar.events.list({
      calendarId: CALENDAR_ID,
      auth: oAuth2Client,
      timeMin: new Date().toISOString(),
      singleEvents: true,
      orderBy: "startTime",
    });

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({ events: response.data.items }),
    };
  } catch (error) {
    // Handle error
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error retrieving events",
        error: error.message,
      }),
    };
  }
};
