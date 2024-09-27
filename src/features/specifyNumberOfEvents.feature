Feature: Specify Number of Events

  Scenario: When user hasn’t specified a number, 32 events are shown by default
    Given the user opens the app
    When the user does not specify a number of events
    Then the user should see 32 events displayed

  Scenario: User can change the number of events displayed
    Given the user is on the event list page
    When the user specifies to display a different number of events (e.g., 10)
    Then the user should see 10 events displayed
