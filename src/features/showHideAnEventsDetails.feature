Feature: Show or hide event details

Scenario: An event element is collapsed by default
  Given the user is on the event list page
  When the user views an event
  Then the event details should be hidden

Scenario: User can expand an event to see details
  Given the user is on the event list page
  When the user clicks on the expand button for an event
  Then the event details should be visible

Scenario: User can collapse an event to hide details
  Given the user has expanded an event
  When the user clicks on the collapse button for that event
  Then the event details should be hidden again
