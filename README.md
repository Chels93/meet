OBJECTIVE:
To build a serverless, progressive web application (PWA) with React using a
test-driven development (TDD) technique. The application uses the Google
Calendar API to fetch upcoming events.

PROJECT REQUIREMENTS: 
Key Features:
● Filter Events by City.
● Show/Hide Event Details.
● Specify Number of Events.
● Use the App When Offline.
● Add an App Shortcut to the Home Screen.
● Display Charts Visualizing Event Details.
Technical Requirements:
● The app must be a React application.
● The app must be built using the TDD technique.
● The app must use the Google Calendar API and OAuth2 authentication flow.
● The app must use serverless functions (AWS lambda is preferred) for the authorization server instead of using a traditional server.
● The app’s code must be hosted in a Git repository on GitHub.
● The app must work on the latest versions of Chrome, Firefox, Safari, Edge, and Opera, as well as on IE11.
● The app must display well on all screen sizes (including mobile and tablet) widths of 1920px and 320px.
● The app must pass Lighthouse’s PWA checklist.
● The app must work offline or in slow network conditions with the help of a service worker.
● Users may be able to install the app on desktop and add the app to their home screen on mobile.
● The app must be deployed on GitHub Pages.
● The app must implement an alert system using an OOP approach to show information to the user.
● The app must make use of data visualization.
● The app must be covered by tests with a coverage rate >= 90%.
● The app must be monitored using an online performance monitoring tool.

USER STORIES AND SCENARIOS: (Gherkin Syntax)
-	Filter Events by City
    Given user hasn’t searched for any city, 
    When the user opens the app, 
    Then the user should see a list of upcoming events. 

-	Show/Hide Event Details
    Given the user has not found any Event details, 
    When the user clicks on an event, 
    Then the user will have an option of viewing or hiding all of the details about that event, as needed. 

-	Specify Number of Events. 
    Given the user does not know how many Events are occurring, 
    When the user opens the app, 
    Then the user will see a visual representation of the number of events occurring at a specified time. 	

-	Use the App When Offline. 
    Given the user does not have an internet connection, 
    When the user is offline, 
    Then the user will have the ability to utilize all of the stored data within the app pertaining to Events. 
    
-	Add an App Shortcut to the Home Screen.
    Given the user needs a quick access to the home screen or loses themselves in the navigation, 
    When the user selects the home button,
    Then the user will be directed immediately to the home screen. 

-	Display Charts Visualizing Event Details.
    Given the user would like a visual representation (chart) of the events occurring at any specific date or time, 
    When the user selects to view details of an event, 
    Then there will appear a visual representation of when and where Events are occurring for better accessibility. 

SERVERLESS FUNCTIONS PURPOSE:
- Optimize token management 
- Prioritize scalability and backend management
- Ensure responsiveness by default with Lambda functions
- Enhance user experience with on demand functions to fetch upcoming events 
- Facilitate ideal integration of calendar data into frontend by having serverless functions interact with REACT PWA via API endpoints 
- Efficiently utilize cloud resources 

