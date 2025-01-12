Feature: Marvel Dashboard Character Display and Search Functionality

  Background:
    Given the user navigates to the dashboard home page

  @test
  Scenario: Display List of Marvel Characters
    Then a list of Marvel characters is displayed automatically without requiring additional user action
    And each character has the following details:
      | Field             |
      | Thumbnail image   |
      | Name              |
      | Short description |
      | Number of comics  |
      | Published date    |

  @test
  Scenario: Infinite Scrolling
    Given the characters are displayed on the dashboard home page
    When the user scrolls down the list
    Then additional characters are loaded dynamically

  @test
  Scenario: Search Characters by Name
    Given the characters are displayed on the dashboard home page
    When the user enters a search term in the search bar
    Then the list updates to display characters matching the search term

  @test
  Scenario: No Characters Found for Search Term
    Given the characters are displayed on the dashboard home page
    When the user performs a search
    Then no characters match the user’s search term
    Then a message is displayed: "No characters found."

  @test
  Scenario: View Detailed Information for a Character
    Given the characters are displayed on the dashboard home page
    When the user clicks on a character
    Then detailed information about the character is shown
