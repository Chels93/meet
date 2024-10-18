Feature: Filter Events By City

    Scenario: When user hasn’t searched for a city, show upcoming events from all cities
        Given the user hasn't searched for a city
        When the user opens the app
        Then the user should see the list of all upcoming events

    Scenario: User should see a list of suggestions when they search for a city
        Given the user opens the app
        When the user starts typing a city name in the textbox
        Then the user should see a list of city suggestions from the dropdown

    Scenario: User can select a city from the suggested list
        Given the event list is displayed
        And the list of suggested cities is showing
        When the user selects a city from the list
        Then their city should be changed to that city (i.e., “Berlin, Germany”)
        And the user should receive a list of upcoming events in that city
