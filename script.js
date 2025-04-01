/**
 * Initializes the Trivia Game when the DOM is fully loaded.
 */
document.addEventListener("DOMContentLoaded", function () {
	const form = document.getElementById("trivia-form");
	const questionContainer = document.getElementById("question-container");
	const newPlayerButton = document.getElementById("new-player");
    const usernameInput = document.getElementById("username");
    const usernameLabelNode = document.getElementById("username-label");
    const feedbackMessageNode = document.getElementById("feedback-message");

	// Initialize the game
	// checkUsername(); Uncomment once completed
	fetchQuestions();
	// displayScores(); Uncomment once completed

    /**
     * 
     * @param {string} message - The error message to be displayed to the user.
     */
    function errorDisplay(message) {
        feedbackMessageNode.setAttribute("role", "alert");
        feedbackMessageNode.textContent = message;
    }


    /**
     * Sets cookie with specife name, value, and expiration days.
     * @param {string} name - The cookie key
     * @param {Any} value - The data that will be stored in the cookie
     * @param {Number} days - The cookie's expiration days
     */
    function setCookie(name, value, days) {
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
    }

    /**
     * Retrieves the value of the cookie that it's passed to.
     * @param {string} name - The cookie key
     * @returns {string} returns value of the cookie.
     */
    function getCookie(name) {
        return document.cookie
        .split("; ")
        .find(str => {return str.startsWith(`${name}=`)})
        ?.split("=")[1];
    }

    /**
     * Checks for the presence of a username cookie.
     */
    function checkUsername() {
        const username = getCookie("username");

        if (username !== "") {
            usernameInput.value = username;
            usernameInput.classList.add("hidden");
            usernameLabelNode.classList.add("hidden");
            newPlayerButton.classList.remove("hidden");
        } else {
            usernameInput.value = "";
            usernameInput.classList.remove("hidden");
            usernameLabelNode.classList.remove("hidden");
            newPlayerButton.classList.add("hidden");
        }
    }

    /**
     * Calculates user's score based on their answers.
     * @returns {Number} User's score
     */
    function calculateScore() {
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
    }

    // 7. SCORE PERSISTENCE ***************

    /**
     * Saves user's score to localStorage
     * @param {string} username - Player's username
     * @param {Number} score - Player's score to be saved
     */
    function saveScore(username, score) {
    // either gets existng object or initializes an empty object
    let scoreData = JSON.parse(localStorage.getItem("userScores")) || {};
    
    // initialize user's score array if it doesn't exist
    if (!scoreData[username]) {
        scoreData[username] = [];
    }
    
    // add the new score to the user's array, this lets see their previous scores too
    scoreData[username].push(score);
    
    localStorage.setItem("userScores", JSON.stringify(scoreData));
    console.log(JSON.parse(localStorage.getItem("userScores")))
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
		});
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

	// Event listeners for form submission and new player button
	form.addEventListener("submit", handleFormSubmit);
	newPlayerButton.addEventListener("click", newPlayer);

	/**
	 * Handles the trivia form submission.
	 * @param {Event} event - The submit event.
	 */
	function handleFormSubmit(event) {
		event.preventDefault();
		//... form submission logic including setting cookies and calculating score
        // Using trim on the username input because the leading spaces might cause issues
        // with the way the cookie gets broken down.
        feedbackMessageNode.textContent = "";
        let username = usernameInput.value.trim();
        if (username === "") {
            // some error handling
            errorDisplay("empty username thing working")
            return;
        }

        if (getCookie("username") !== username) {
            setCookie("username", username, 7);
            checkUsername();
            console.log(document.cookie);
        }

        // PLACEHOLDERS
        //console.log(calculateScore());
        const score = calculateScore();
        saveScore(username, score);
        // displayScores();

        // fetchQuestions();
	}
});