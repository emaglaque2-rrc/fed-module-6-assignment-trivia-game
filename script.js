/**
 * Initializes the Trivia Game when the DOM is fully loaded.
 */
document.addEventListener("DOMContentLoaded", function () {
	const form = document.getElementById("trivia-form");
	const questionContainer = document.getElementById("question-container");
	const newPlayerButton = document.getElementById("new-player");
    const usernameInputNode = document.getElementById("username");
    const usernameLabelNode = document.getElementById("username-label");
    const feedbackMessageNode = document.getElementById("feedback-message");
    const scoreTableBodyNode = document.querySelector("#score-table tbody");
    const finishGameButtonNode = document.getElementById("submit-game");

	// Initialize the game
	try {
        checkUsername();
        fetchQuestions();
        displayScores();
    } catch (error) {
        errorDisplay("Failed to initialize game. Please refresh.");
        throw new Error("Unable to get questions " + error);
    }

    /**
     * Sets cookie with specife name, value, and expiration days.
     * @param {string} name - The cookie key
     * @param {Any} value - The data that will be stored in the cookie
     * @param {Number} days - The cookie's expiration days
     */
    function setCookie(name, value, days) {

        try {
            let expiration = "";
        
            // if days is undefined, do not add to the expiration string
            if (days) {
                const date = new Date();
                // get the current time, and add a number of milliseconds to it
                date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        
                expiration = `; expires=${date.toUTCString()}`;
            }
        
            // either create a new cookie (if the name is not taken) or replace it if it is
            document.cookie = `${name}=${value}${expiration}`;
        } catch (error) {
            errorDisplay("Failed to set cookie. Please refresh.");
            throw new Error("Cookie set error: " + error);
        }

    }

    /**
     * Retrieves the value of the cookie that it's passed to.
     * @param {string} name - The cookie key
     * @returns {string} returns value of the cookie.
     */
    function getCookie(name) {
        try {
            return document.cookie
            .split("; ")
            .find(str => {return str.startsWith(`${name}=`)})
            ?.split("=")[1];
        } catch (error) {
            errorDisplay("Failed to retrieve cookie. Please refresh.");
            throw new Error("Cookie get error: " + error);
        }
    }

    /**
     * Checks for the presence of a username cookie.
     */
    function checkUsername() {
        try {
            const username = getCookie("username");
    
            if (username) {
                usernameInputNode.value = username;
                usernameInputNode.classList.add("hidden");
                usernameLabelNode.classList.add("hidden");
                finishGameButtonNode.classList.add("hidden");
                newPlayerButton.classList.remove("hidden");
            } else {
                usernameInputNode.value = "";
                usernameInputNode.classList.remove("hidden");
                usernameLabelNode.classList.remove("hidden");
                finishGameButtonNode.classList.remove("hidden");
                newPlayerButton.classList.add("hidden");
            }
        } catch (error) {
            errorDisplay("Failed to check username. Please refresh.");
            throw new Error("User check error: " + error);
        }
    }

    /**
     * Calculates user's score based on their answers.
     * @returns {Number} User's score
     */
    function calculateScore() {
        try {
            let score = 0;
            const questions = questionContainer.querySelectorAll(".question");
    
            questions.forEach((questionDivElement) =>{
                // CITATION: https://stackoverflow.com/questions/63564351/what-is-the-right-way-to-select-input-type-radio-in-dom
                const selectedAnswer = questionDivElement.querySelector("input[type='radio']:checked");
                if (selectedAnswer && selectedAnswer.hasAttribute("data-correct")) {
                    score++
                }
            });
    
            return score;
        } catch (error) {
            errorDisplay("Failed to calculate score. Please refresh.");
            throw new Error("Score calculation error: " + error);
        }
    }

    /**
     * Saves user's score to localStorage
     * @param {string} username - Player's username
     * @param {Number} score - Player's score to be saved
     */
    function saveScore(username, score) {
        try {
            // either gets existng object or initializes an empty object
            // CITATION: https://stackoverflow.com/questions/20948372/what-does-means-in-javascript
            let playersScoreData = JSON.parse(localStorage.getItem("userScores")) || {};
            
            // initialize user's score array if it doesn't exist
            if (!playersScoreData[username]) {
                playersScoreData[username] = [];
            }
            // add the new score to the user's array, this lets see their previous scores too
            // CITATION: https://www.w3schools.com/jsref/jsref_push.asp
            playersScoreData[username].push(score);
            
            localStorage.setItem("userScores", JSON.stringify(playersScoreData));
            // TEST PURPOSES: console.log(JSON.parse(localStorage.getItem("userScores")))
        } catch (error) {
            errorDisplay("Failed to save score. Please refresh.");
            throw new Error("Failed to save score: " + error);
        }
    }

    /**
     * Retrieves scores from ocalStorage and displays them on score table by creating elements in HTML.
     */
    function displayScores() {
        try {
            scoreTableBodyNode.innerHTML = "";
    
            playersScoreData = JSON.parse(localStorage.getItem("userScores"));
    
            for (const username in playersScoreData) {
                const scores = playersScoreData[username];
                // CITATION: https://builtin.com/articles/javascript-get-last-element-of-array#:~:text=Square%20Bracket%20Notation-,To%20get%20the%20last%20element%20of%20an%20array%20in%20JavaScript,the%20element%20at%20that%20index.
                const mostRecentScore = scores[scores.length - 1];
    
                const row = document.createElement("tr");
    
                // username display
                const usernameCell = document.createElement("td");
                usernameCell.textContent = username;
                row.appendChild(usernameCell);
    
                // score display
                const scoreCell = document.createElement("td");
                scoreCell.textContent = mostRecentScore;
                row.appendChild(scoreCell);
    
                scoreTableBodyNode.appendChild(row);
            }
        } catch (error) {
            errorDisplay("Failed to display scores. Please refresh.");
            throw new Error("Failed to display scores: " + error);
        }
    }

    /**
     * Resets game for new player by updating the UI and clearing cookie.
     */
    function newPlayer() {
        try {
            setCookie("username", "",-1);
    
            checkUsername();
        } catch (error) {
            errorDisplay("Failed to reset game. Please refresh.");
            throw new Error("Failed to reset game: " + error);
        }
    }

	/**
	 * Fetches trivia questions from the API and displays them.
	 */
	function fetchQuestions() {
		showLoading(true); // Show loading state
        fetch("https://opentdb.com/api.php?amount=10&type=multiple")
            .then((response) => response.json())
            .then((data) => {
                displayQuestions(data.results);
                showLoading(false); // Hide loading state
            })
            .catch((error) => {
                console.error("Error fetching questions:", error);
                showLoading(false); // Hide loading state on error
                errorDisplay("Failed to load questions. Please refresh!");
            });
	}

	/**
	 * Toggles the display of the loading state and question container.
	 *
	 * @param {boolean} isLoading - Indicates whether the loading state should be shown.
	 */
	function showLoading(isLoading) {
		document.getElementById("loading-container").classList = isLoading
			? ""
			: "hidden";
		document.getElementById("question-container").classList = isLoading
			? "hidden"
			: "";
	}

	/**
	 * Displays fetched trivia questions.
	 * @param {Object[]} questions - Array of trivia questions.
	 */
	function displayQuestions(questions) {
        try {
            questionContainer.innerHTML = ""; // Clear existing questions
            questions.forEach((question, index) => {
                const questionDiv = document.createElement("div");
                questionDiv.classList.add("question")
                questionDiv.innerHTML = `
                    <p>${question.question}</p>
                    ${createAnswerOptions(
                        question.correct_answer,
                        question.incorrect_answers,
                        index
                    )}
                `;
                questionContainer.appendChild(questionDiv);
            })
        } catch (error) {
            errorDisplay("Failed to display questions. Please refresh.");
            throw new Error("Question display error: " + error);
	    }
    }

	/**
	 * Creates HTML for answer options.
	 * @param {string} correctAnswer - The correct answer for the question.
	 * @param {string[]} incorrectAnswers - Array of incorrect answers.
	 * @param {number} questionIndex - The index of the current question.
	 * @returns {string} HTML string of answer options.
	 */
	function createAnswerOptions(
		correctAnswer,
		incorrectAnswers,
		questionIndex
	) {
		const allAnswers = [correctAnswer, ...incorrectAnswers].sort(
			() => Math.random() - 0.5
		);
		return allAnswers
			.map(
				(answer, answerIndex) => `
                <div class="answer">
                    <input type="radio" id="radio-question-${questionIndex}-answer-${answerIndex}"
                    name="answer${questionIndex}" value="${answer}" ${
                        answer === correctAnswer ? 'data-correct="true"' : ""
                    }>
                    <label for="radio-question-${questionIndex}-answer-${answerIndex}">
                    ${answer}
                    </label>
                </div>
        `
			)
			.join("");
	}

	/**
	 * Handles the trivia form submission.
	 * @param {Event} event - The submit event.
	 */
	function handleFormSubmit(event) {
		event.preventDefault();
		//... form submission logic including setting cookies and calculating score

        // Using trim on the username input because the leading spaces might cause issues
        // with the way the cookie gets broken down.
        try {
            feedbackMessageNode.textContent = "";
            let username = escapeHTML(usernameInputNode.value.trim());

            if (username === "") {
                // some error handling
                errorDisplay("Username cannot be empty!")
                return;
            }
    
            if (getCookie("username") !== username) {
                setCookie("username", username, 7);
                checkUsername();
                // TEST PURPOSES: (document.cookie);
            }
    
            // PLACEHOLDERS
            const score = calculateScore();
            saveScore(username, score);
            displayScores();
            fetchQuestions();
        } catch (error) {
            errorDisplay("Failed to submit form. Please refresh.");
            throw new Error("Submission failed error: " + error);
        }
	}

    // Event listeners for form submission and new player button
	form.addEventListener("submit", handleFormSubmit);
	newPlayerButton.addEventListener("click", newPlayer);

    // HELPER FUNCTIONS

    /**
     * Displays an error message in the UI to notify users.
     * @param {string} message - The error message to be displayed to the user.
     */
    function errorDisplay(message) {
        feedbackMessageNode.setAttribute("role", "alert");
        feedbackMessageNode.textContent = message;
    }

    /**
     * Sanitizes input strings to prevent XSS attacks.
     * @param {string} input - The value/string to be sanitized
     * @returns An escaped version of the value/string
     */
    function escapeHTML(input) {
        return input
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

}); 