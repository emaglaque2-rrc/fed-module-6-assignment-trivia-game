# Debugging Analysis Module 6 FED

## Breakpoint 1: 
  
- Breakpoint Location:
  - Line 312

- Explanation and what it represents:
  - This breakpoint captures the moment immediately after username validation which means the form submission can proceed, but this is all
  before any score calculation or any data saving occurs. This represents the critical transition point between user action, which is
  submitting the trivia form, AND application response (validating username, calculating score, and updating localStorage). This is essential because it's where the persistent data is established and the score processing begins.

- Description of what changed after stepping through the code:
  - Before:
    - Passed the validation check for empty username.
    - Username input got sanitized with the escapeHTML function I implemented in also in the handleFormSubmit function.
    - Username cookie just got set with a 7-day expiration.
  - After:
    - UI got updated to hide the username input field
    - Score got calculated by stepping into each div and seeing which input radio buttons with the data-correct attribute were selected.
    - Score has been saved to localStorage under the user's name, alongside the previous scores if it's a returning user.
    - Score table got updated with the latest scores.
  
- Detailed analysis:
  - This breakpoint state demonstrates the core functionality of the trivia game, recording user performances with the questions. We can confirm that user input sanitization is working correctly for the username, which prevents XSS attacks (at least for the username field).
  We can also confirm the cookie management system is functioning as we wouldn't get to this point if it wasnt, and the score calculation logic can properly identify CORRECT answers. This is crucial for maintaining and ensuring that user sessions maintain continuity and scores are accurately recorded.
  
## Breakpoint 2:

- Breakpoint Location:
  - Line 201

- Explanation and what it represents:
  - This breakpoint captures the moment when the raw HTTP response from the open trivia
  DB API has JUST been received, but RIGHT before it is parsed into JSON format. This
  represents that we have successfully received a response from the API, and we're
  about to convert it into a usable JavaScript object, so we're looking at the transition
  particularly. This is essential because it's crucial for us to understand how the application
  handles the API response, and transform external data into interactive trivia questions.

- Description of what changed after stepping through the code:
  - Before:
    - Just finished fetching request to the open trivia DB API, and it successfully sent a response we can work with.
    - That response object returned with raw data, so now we extract it and parse it into JSON format.
    - About to pass data into the displayQuestionss function.
    - At this time, everything is all in memory. Nothing has been displayed.
  - After:
    - Response successfully been parsed into JSON format.
    - The data object now contains structured information including the array of trivia questions in data.results
    - the displayQuestion function cleared out the previous question container.
    - that function loops and for each question, interacts with the DOM and makes a semantic HTML structure.
    - Each question is random and the answer options are randomized in terms of where they have been placed, AND also
    comes with the attribute "data-correct"
    - Loading state now hidden and question container with the NEW fetched questions and answers are now visible.
  
- Detailed analysis:
  - This breakpoint state demonstrates a fundamental aspect of our trivia application
  which is how external data shapes our application's content. Specifically, it is how
  we work with external APIs, which we transform the response of raw data into STRUCTURED
  JavaScript objects. This verifies that the API response is correctly parsed, and that questions
  and answers are properly formatted and randomized. This is crucial as this is what makes the
  dynamic nature of our application, as each API call brings a different vibe to the questions.
  This hopefully shapes a good UX for our players, and hopefully they don't get bored of our app.

## Breakpoint 3:

- Breakpoint Location:
  - Line 161

- Explanation and what it represents:
  - This breakpoint captures the moment when our app is updating the UI and 
  manipulating the DOM to display each player's score data from localStorage
  using HTML elements. It represents the translation of persistent data into visual representation for
  the players. This verifies that each username has an array of a user's previous scores,
  but we are only taking the most recent score as feedback for the player's performance.

- Description of what changed after stepping through the code:
  - Before:
    - The score table is cleared of all entries (for now).
    - The user score data has been retrieved from the localStorage and have already
    been parsed into JSON format.
    - About to loop through each username in the data object, specifically working with
    the current user's (in the loop) most recent score.
  - After:
    - For each user in the data, a new table row has been created.
    - PLayer's username and their most recent score have been inserted into corresponding 2 table cells.
    - The cells have been appended to the row.
    - Now, the row itself has been appended into the score table body.
    - After the loop, the score table now displays all of the stored player's usernames/scores.
  
- Detailed analysis:
  - This breakpoint state demonstrates how our app handles data visualization and
  provides user's instant feedback of their trivia performance by displaying the
  MOST RECENT score. This verifies that the localStorage data is correctly retrieved,
  parsed, and displayed with only the chosen values that we want. Also, as we step through
  the code, we can observe the DOM manipulation in action, like creation of elements, setting
  their textcontent, and nesting them. This is a key point to check for any issues with
  score display (like missing data or formatting problems), which is important for quickly
  debugging things.
