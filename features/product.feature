Feature: Manage products

  Scenario: Add a new product
    Given I have the following product
      | id  | name             | description        | category | price | quantity | createdAt                 | updatedAt                 |
      | 50   | Soda Cold | Agua Carbonatada   | Bebida   | 50    | 5        | 2024-05-05T19:44:46.122Z | 2024-05-05T19:44:46.122Z |
    When I send a POST request to /products
    Then the response status should be 201
    And the response body should contain the product

  Scenario: Get all products
    When I send a GET request to /products
    Then the response status should be 200
    And the response body should contain the following products
      | id  | name             | description        | category | price | quantity | createdAt                 | updatedAt                 |
      | 50   | Soda Cold | Agua Carbonatada   | Bebida   | 50    | 5        | 2024-05-05T19:44:46.122Z | 2024-05-05T19:44:46.122Z |
