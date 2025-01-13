OBJECTIVE:
To build a serverless, progressive web application (PWA) with React using a
test-driven development (TDD) technique. The application fetches upcoming events using the Google Calendar API.

FEATURES: 
- Filter Events by City
- Show/Hide Event Details
- Specify Number of Events
- Use the App When Offline
- Add an App Shortcut to the Home Screen
- Display Charts Visualizing Event Details

TECHNICAL REQUIREMENTS:
- Frontend: React-based single-page application (SPA)
- TDD: Built with a test-driven development approach
- Serverless Architecture: Utilizes AWS Lambda for backend functions
- Google Calendar API: OAuth2 authentication for secure access to event data
- Cross-Browser Support: Compatible with Chrome, Firefox, Safari, Edge, Opera, and IE11
- Responsive Design: Optimized for screen widths ranging from 320px (mobile) to 1920px (desktop)
- Progressive Web App: Passes Lighthouse PWA checklist, supports offline use, and provides an "Add to Home Screen" feature
- Alert System: Implements object-oriented programming (OOP) for user notifications
- Data Visualization: Interactive and visually appealing charts to summarize event data
- Deployment: Hosted on GitHub Pages
- Testing: Coverage rate >= 90%, with unit, integration, and end-to-end tests
- Performance Monitoring: Integrated with an online application performance monitoring tool


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

TECHNICAL STACK:
- React: for building the user interface
- AWS Lambda: for serverless backend implementation
- Google Calendar API: to fetch event data 
- Testing Frameworks: Jest and Enzyme for unit and integration Testing
- Service Worker: for offline support and caching
- D3.js/Chart.js: for data Visualization
- GitHub Pages: for app Deployment
- Lighthouse: for PWA compliance 

DEPLOYMENT:
- Install dependencies using: npm install
- Run the server using: npm start 
- Github link: https://github.com/Chels93/meet