Feature: Product management
  Scenario: Add a product
    Given I am an admin
    When I add a new product
    Then I should see the product in the list