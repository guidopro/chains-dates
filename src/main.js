// main.js

const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;

const SCOPES = "https://www.googleapis.com/auth/calendar";

// Chains & Dates Events calendar (public)
const CALENDAR_ID =
  "84e87b31ca20c6cf2c2bd40a8fb144b8091cd96da2a938d3c4d3688c0382b7fb@group.calendar.google.com";

let gapiInited = false;
let gisInited = false;
let tokenClient;

// Hide buttons initially
document.getElementById("authorize_button").style.visibility = "hidden";
document.getElementById("signout_button").style.visibility = "hidden";
document.getElementById("create_event_button").style.visibility = "hidden";

// Enable buttons when both GAPI and GIS are ready
function maybeEnableButtons() {
  if (gapiInited && gisInited) {
    document.getElementById("authorize_button").style.visibility = "visible";
  }
}

// --- Load GAPI dynamically ---
const gapiScript = document.createElement("script");
gapiScript.src = "https://apis.google.com/js/api.js";
gapiScript.onload = () => {
  // Load the 'client' module
  gapi.load("client", async () => {
    await gapi.client.init({
      discoveryDocs: [
        "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
      ],
    });
    gapiInited = true;
    maybeEnableButtons();
  });
};
document.head.appendChild(gapiScript);

// --- Load GIS dynamically ---
const gisScript = document.createElement("script");
gisScript.src = "https://accounts.google.com/gsi/client";
gisScript.async = true;
gisScript.defer = true;
gisScript.onload = () => {
  // Initialize token client
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: async (resp) => {
      if (resp.error) throw resp;
      document.getElementById("signout_button").style.visibility = "visible";
      document.getElementById("authorize_button").innerText = "Refresh";
      document.getElementById("create_event_button").style.visibility =
        "visible";

      await listUpcomingEvents();
    },
  });
  gisInited = true;
  maybeEnableButtons();
};
document.head.appendChild(gisScript);

// --- Auth / Token Handling ---
function handleAuthClick() {
  if (!tokenClient) return;
  tokenClient.requestAccessToken({ prompt: "consent" });
}

function handleSignoutClick() {
  const token = gapi.client.getToken();
  if (token) {
    google.accounts.oauth2.revoke(token.access_token);
    gapi.client.setToken("");
    document.getElementById("content").innerText = "";
    document.getElementById("authorize_button").innerText = "Authorize";
    document.getElementById("signout_button").style.visibility = "hidden";
  }
}

// --- List upcoming events ---
async function listUpcomingEvents() {
  try {
    const response = await gapi.client.calendar.events.list({
      calendarId: CALENDAR_ID,
      timeMin: new Date().toISOString(),
      showDeleted: false,
      singleEvents: true,
      maxResults: 10,
      orderBy: "startTime",
    });
    const events = response.result.items;
    if (!events || events.length === 0) {
      document.getElementById("content").innerText = "No events found.";
      return;
    }
    const output = events
      .map(
        (event) =>
          `${event.summary} (${event.start.dateTime || event.start.date})`
      )
      .join("\n");
    document.getElementById("content").innerText = "Events:\n" + output;
  } catch (err) {
    document.getElementById("content").innerText = "Error: " + err.message;
  }
}

async function addEventToCalendar() {
  const testEvent = {
    summary: "TEST EVENT INSERTION",
    location: "Manchester",
    description: "further testing",
    start: {
      dateTime: new Date().toISOString(),
      timeZone: "Europe/London",
    },
    end: {
      dateTime: new Date(new Date().getTime() + 60 * 60 * 1000).toISOString(),
      timeZone: "Europe/London",
    },
  };

  try {
    const request = gapi.client.calendar.events.insert({
      calendarId: CALENDAR_ID,
      resource: testEvent,
    });

    request.execute(function (event) {
      console.log("Event created: " + event.htmlLink);
      listUpcomingEvents();
    });
  } catch (err) {
    console.log(err);
  }
}

// --- Expose auth functions to global scope for HTML buttons ---
window.handleAuthClick = handleAuthClick;
window.handleSignoutClick = handleSignoutClick;
window.addEventToCalendar = addEventToCalendar;
