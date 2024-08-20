"use strict";

const { google } = require("googleapis");
const calendar = google.calendar("v3");
const SCOPES = [
  "https://www.googleapis.com/auth/calendar.events.readonly",
];
const { CLIENT_SECRET, CLIENT_ID, CALENDAR_ID } = process.env;
const redirectUris = ["https://Chels93.github.io/meet/"];

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  redirectUris[0]
);

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

module.exports.getAccessToken = async (event) => {
  const code = decodeURIComponent(event.pathParameters.code);
  try {
    const { tokens } = await oAuth2Client.getToken(code);
    console.log("Access token obtained:", tokens);
    oAuth2Client.setCredentials(tokens);

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(tokens),
    };
  } catch (e) {
    console.error("Error getting access token:", e);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({ error: e.message, details: e }),
    };
  }
};

module.exports.getCalendarEvents = async (event) => {
  try {
    const { access_token } = JSON.parse(event.body); // Assume access token is in the request body
    oAuth2Client.setCredentials({ access_token });

    const response = await calendar.events.list({
      calendarId: CALENDAR_ID || 'primary', // Use 'primary' for primary calendar
      auth: oAuth2Client,
      timeMin: new Date().toISOString(),
      singleEvents: true,
      orderBy: "startTime",
    });

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({ events: response.data.items }),
    };
  } catch (error) {
    console.error("Error fetching calendar events:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
    };
  }
};