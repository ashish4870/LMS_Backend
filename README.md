# Test Update Endpoint

## Overview

This API endpoint updates a test with a new question and provides the next question based on the current state of the test. It adjusts the difficulty level of subsequent questions based on the user’s responses and ensures that no previously asked questions are repeated.

## Mongo URI
Please create mongo atlas cluster. Create .env file and add Mongo URI or I'm attaching mongo URI to the email 

## Seed script
Please execute seed script first to add 500 random maths questions

## Endpoint

### Update Test

**POST** `/tests/:testId/update`

#### URL Parameters

- `testId` (string): The ID of the test to be updated.

#### Request Body

- `questionId` (string): The ID of the question to be added to the test.
- `answer` (string): The user's answer to the question.
- `score` (number): The score given for the question.
- `difficulty` (number): The difficulty level of the question.

#### Response

- **Success (200 OK)**
  - Returns the next question and the total score if the test is not completed.
  - If the test has 5 or more questions, marks it as completed and returns the total score.

- **Error (404 Not Found)**
  - If the question or test is not found.
  - If no available questions exist for the next difficulty level.

- **Error (400 Bad Request)**
  - If there is a failure in updating the test.

## Algorithm for Selecting the Next Question

1. **Retrieve Current Question:**
   - Fetch the question specified by `questionId` from the `Question` collection in the database.
   - If the question is not found, return a 404 error.

2. **Update Test with New Question:**
   - Fetch the test specified by `testId` from the `Test` collection in the database.
   - If the test is not found, return a 404 error.
   - Add the current question to the test's list of questions with the provided `answer`, `score`, and `difficulty`.
   - Update the test's total score by summing the scores of all questions in the test.

3. **Determine Next Difficulty Level:**
   - Adjust the difficulty level for the next question based on the current `difficulty` and `score`.
     - If the score is positive (`score > 0`), increase the difficulty level.
     - If the score is zero or negative (`score <= 0`), decrease the difficulty level.

4. **Filter Available Questions:**
   - Query the `Question` collection for questions that match the newly determined difficulty level.
   - Create a set of questions that have already been asked in the current test.
   - Filter out questions that have already been asked from the available questions.

5. **Select the Next Question:**
   - If there are no available questions for the next difficulty level, return a 404 error.
   - Randomly select a question from the filtered list of available questions.
   - If no question is found, return a 404 error.

6. **Complete the Test Check:**
   - Check if the test now contains 5 or more questions.
   - If so, mark the test as completed and return a completion message along with the total score.
   - Otherwise, return the next question and the total score.

## Example Request

```http
POST /tests/test123/update
Content-Type: application/json

{
  "questionId": "question456",
  "answer": "Paris",
  "score": 10,
  "difficulty": 2
}
