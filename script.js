/*
 * Script for managing the Family Feud: Real Estate Edition game.
 *
 * This file contains the data for each round (questions and answers),
 * as well as functions to render the board, reveal answers, update
 * scores, and advance to the next round. The design attempts to
 * emulate the feel of the real Family Feud game, with points awarded
 * based on the answer ranking. Scores accumulate across rounds.
 */

// Define the rounds for the game. Each round has a question and up to six answers.
const rounds = [
    {
        question: 'What is the first thing you do when looking for a new home?',
        answers: [
            { text: 'Browse online listings', points: 30 },
            { text: 'Hire a real estate agent', points: 25 },
            { text: 'Drive around neighborhoods', points: 20 },
            { text: 'Check home prices', points: 15 },
            { text: 'Get pre-approved for mortgage', points: 10 },
            { text: 'Ask friends & family', points: 5 }
        ]
    },
    {
        question: 'Name something you might fix before selling your house.',
        answers: [
            { text: 'Paint the walls', points: 30 },
            { text: 'Fix leaks', points: 25 },
            { text: 'Replace flooring', points: 20 },
            { text: 'Update the kitchen', points: 15 },
            { text: 'Improve curb appeal', points: 10 },
            { text: 'Clean the yard', points: 5 }
        ]
    },
    {
        question: "What's an essential feature for a modern kitchen?",
        answers: [
            { text: 'Energy‑efficient appliances', points: 30 },
            { text: 'Granite or stone countertops', points: 25 },
            { text: 'Island with seating', points: 20 },
            { text: 'Open layout', points: 15 },
            { text: 'Large pantry', points: 10 },
            { text: 'Dishwasher', points: 5 }
        ]
    },
    {
        question: 'What do buyers want most in a neighborhood?',
        answers: [
            { text: 'Good schools', points: 30 },
            { text: 'Safety', points: 25 },
            { text: 'Quiet streets', points: 20 },
            { text: 'Parks & green space', points: 15 },
            { text: 'Nearby shopping', points: 10 },
            { text: 'Low traffic', points: 5 }
        ]
    },
    {
        question: 'What is a top priority when choosing a real estate agent?',
        answers: [
            { text: 'Experience', points: 30 },
            { text: 'Knowledge of the area', points: 25 },
            { text: 'Good communication', points: 20 },
            { text: 'Negotiation skills', points: 15 },
            { text: 'Honesty & trust', points: 10 },
            { text: 'Low commission', points: 5 }
        ]
    }
];

// Keep track of the current round, the round number, and the scores for each team
let currentRoundIndex = 0;
// There are three main rounds; roundNumber starts at 1 and increments after each round
let roundNumber = 1;
// Multipliers for each round (1x, 2x, 3x)
const multipliers = [1, 2, 3];
// Track team scores
const scores = {
    1: 0,
    2: 0
};

// Final Feud data: questions and their survey answers. These questions should
// remain relevant to real estate and affiliate marketing. If actual polling
// numbers are unavailable, educated guesses are provided for scoring.
const finalQuestions = [
    {
        question: 'Name a room that sells a house',
        answers: [
            { text: 'Kitchen', points: 40 },
            { text: 'Living room', points: 25 },
            { text: 'Master bedroom', points: 20 },
            { text: 'Bathroom', points: 10 },
            { text: 'Dining room', points: 5 }
        ]
    },
    {
        question: 'Name something buyers check when touring a home',
        answers: [
            { text: 'Water pressure', points: 30 },
            { text: 'Closet space', points: 25 },
            { text: 'Natural light', points: 20 },
            { text: 'Flooring', points: 15 },
            { text: 'Smells', points: 10 }
        ]
    },
    {
        question: 'Name an online platform where you can advertise your property',
        answers: [
            { text: 'Zillow', points: 35 },
            { text: 'Realtor.com', points: 25 },
            { text: 'Redfin', points: 20 },
            { text: 'Facebook Marketplace', points: 15 },
            { text: 'Craigslist', points: 5 }
        ]
    },
    {
        question: 'Name a feature that adds value to a rental property',
        answers: [
            { text: 'Updated kitchen', points: 30 },
            { text: 'Parking', points: 25 },
            { text: 'In‑unit laundry', points: 20 },
            { text: 'Air conditioning', points: 15 },
            { text: 'Outdoor space', points: 10 }
        ]
    },
    {
        question: 'Name a professional service a realtor might recommend',
        answers: [
            { text: 'Home inspector', points: 35 },
            { text: 'Mortgage lender', points: 25 },
            { text: 'Staging company', points: 20 },
            { text: 'Contractor', points: 15 },
            { text: 'Photographer', points: 5 }
        ]
    }
];

// Variables and DOM references for the Final Feud round
let finalTeam = null; // the winning team number (1 or 2)
let player1Answers = [];
let player2Answers = [];

const startFinalBtn = document.getElementById('startFinalBtn');
const finalFeudContainer = document.getElementById('final-feud-container');
const finalIntroElem = document.getElementById('final-intro');
const player1InputsContainer = document.getElementById('questions-list-1');
const player2InputsContainer = document.getElementById('questions-list-2');
const player1Section = document.getElementById('player1-inputs');
const player2Section = document.getElementById('player2-inputs');
const submitPlayer1Btn = document.getElementById('submitPlayer1');
const submitPlayer2Btn = document.getElementById('submitPlayer2');
const finalResultsSection = document.getElementById('final-results');
const finalBoardElem = document.getElementById('final-board');
const finalTotalScoreElem = document.getElementById('final-total-score');
const finalMessageElem = document.getElementById('final-message');

// Grab references to elements in the DOM
const questionElem = document.getElementById('question');
const boardElem = document.getElementById('board');
const nextRoundBtn = document.getElementById('nextRoundBtn');
const activeTeamSelect = document.getElementById('activeTeam');

// Helper to capitalise the first letter of each word (for display)
function capitalizeWords(str) {
    return str.replace(/\b\w/g, (match) => match.toUpperCase());
}

/**
 * Render the current round on the board. This function populates the
 * question text and creates card elements for each answer. Cards start
 * blank except for the answer number; clicking a card reveals the answer
 * and awards points to the active team.
 */
function renderRound() {
    const round = rounds[currentRoundIndex];
    questionElem.textContent = round.question;
    boardElem.innerHTML = '';

    round.answers.forEach((answer, idx) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.index = idx.toString();
        
        // Populate the card with placeholders: number, text and points
        card.innerHTML = `
            <span class="card-number">${idx + 1}</span>
            <span class="card-text"></span>
            <span class="card-points"></span>
        `;

        // Attach click handler to reveal the answer and add points
        card.addEventListener('click', () => {
            revealAnswer(idx, card);
        });

        boardElem.appendChild(card);
    });
}

/**
 * Reveals the answer for the selected card. If the card has not been
 * revealed previously, it updates the card with the answer text and
 * points, marks it as revealed, and awards points to the currently
 * selected team.
 *
 * @param {number} idx The index of the answer in the current round
 * @param {HTMLElement} card The card element to reveal
 */
function revealAnswer(idx, card) {
    const round = rounds[currentRoundIndex];
    const answer = round.answers[idx];

    // Prevent double-revealing
    if (card.classList.contains('revealed')) {
        return;
    }

    card.classList.add('revealed');
    const textSpan = card.querySelector('.card-text');
    const pointsSpan = card.querySelector('.card-points');
    textSpan.textContent = answer.text;

    // Determine the points multiplier based on the current round number (1, 2, 3)
    const multiplier = multipliers[roundNumber - 1] || 1;
    const totalPoints = answer.points * multiplier;
    pointsSpan.textContent = totalPoints;

    const activeTeam = parseInt(activeTeamSelect.value, 10);
    updateScore(activeTeam, totalPoints);
}

/**
 * Adds points to the specified team and updates the score display.
 *
 * @param {number} team The team number (1 or 2)
 * @param {number} points The number of points to add
 */
function updateScore(team, points) {
    scores[team] += points;
    const scoreElem = document.getElementById('score' + team);
    scoreElem.textContent = scores[team];
}

/**
 * Advance to the next round. If the game has reached the last
 * round, it loops back to the first round. Scores persist until
 * the page is refreshed.
 */
function nextRound() {
    // If we are still in rounds 1 or 2, advance to the next round
    if (roundNumber < 3) {
        roundNumber++;
        currentRoundIndex = (currentRoundIndex + 1) % rounds.length;
        renderRound();

        // If we've just advanced to the third round, update the button text to indicate the last round
        if (roundNumber === 3) {
            nextRoundBtn.textContent = 'Finish Round 3';
        }
    } else {
        // Round 3 has concluded; disable the next round button and reveal the option to start the final
        nextRoundBtn.style.display = 'none';
        startFinalBtn.style.display = 'inline-block';
    }
}

// Attach event listeners
nextRoundBtn.addEventListener('click', nextRound);

// Event listener for starting the final round
startFinalBtn.addEventListener('click', () => {
    prepareFinalFeud();
});

// Event listeners for submitting Final Feud answers
submitPlayer1Btn.addEventListener('click', submitPlayer1);
submitPlayer2Btn.addEventListener('click', submitPlayer2);

// Initialize the first round when the page loads
window.addEventListener('load', () => {
    renderRound();
});

/**
 * Prepares and displays the Final Feud round. It determines which team
 * has the higher score after three rounds and allows two members of
 * that team to answer the fast-money style questions. The regular
 * game board is hidden while the Final Feud interface is shown.
 */
function prepareFinalFeud() {
    // Determine the winning team (default to team 1 in a tie)
    finalTeam = scores[1] >= scores[2] ? 1 : 2;
    finalIntroElem.textContent = `Team ${finalTeam} is going to the Final Feud!`;

    // Hide the main round interface
    const mainEl = document.querySelector('main');
    if (mainEl) {
        mainEl.style.display = 'none';
    }
    // Show the final feud container
    finalFeudContainer.classList.remove('hidden');

    // Reset previous answers
    player1Answers = [];
    player2Answers = [];

    // Render question inputs for player 1
    renderFinalQuestions(player1InputsContainer, 'p1');

    // Ensure proper visibility states
    player1Section.style.display = 'block';
    player2Section.style.display = 'none';
    finalResultsSection.style.display = 'none';
}

/**
 * Dynamically generates input fields for the Final Feud questions. Each
 * question is rendered with a label and a text input. The prefix
 * parameter differentiates inputs between player 1 and player 2.
 *
 * @param {HTMLElement} container The DOM element to populate with inputs
 * @param {string} prefix A prefix for input IDs (e.g. 'p1', 'p2')
 */
function renderFinalQuestions(container, prefix) {
    container.innerHTML = '';
    finalQuestions.forEach((fq, idx) => {
        const div = document.createElement('div');
        div.className = 'final-question';
        const inputId = `${prefix}-q${idx}`;
        div.innerHTML = `<label for="${inputId}">${fq.question}</label><input type="text" id="${inputId}" autocomplete="off">`;
        container.appendChild(div);
    });
}

/**
 * Collects and stores the answers from Player 1 and advances to Player 2's
 * set of questions. Answers are converted to lowercase for consistent
 * comparison later. Player 1's input fields are hidden and Player 2's
 * input fields are revealed.
 */
function submitPlayer1() {
    player1Answers = [];
    finalQuestions.forEach((q, idx) => {
        const input = document.getElementById(`p1-q${idx}`);
        const value = (input.value || '').trim().toLowerCase();
        player1Answers.push(value);
    });
    // Switch to player 2 input fields
    player1Section.style.display = 'none';
    player2Section.style.display = 'block';
    renderFinalQuestions(player2InputsContainer, 'p2');
}

/**
 * Collects Player 2's answers, checks for duplicates against Player 1's
 * responses, and either prompts for different answers or proceeds to
 * calculate the final scores. If duplicates are found for any
 * corresponding question, the user is alerted and the process halts.
 */
function submitPlayer2() {
    player2Answers = [];
    let duplicateFound = false;
    finalQuestions.forEach((q, idx) => {
        const input = document.getElementById(`p2-q${idx}`);
        const value = (input.value || '').trim().toLowerCase();
        // Check for duplicate answers on the same question
        if (value && value === player1Answers[idx]) {
            duplicateFound = true;
        }
        player2Answers.push(value);
    });
    if (duplicateFound) {
        alert('Duplicate answer found for one or more questions. Player 2 must provide a different answer than Player 1 for the same question.');
        return;
    }
    showFinalResults();
}

/**
 * Retrieves the point value for a given answer in the Final Feud
 * questions. If the answer does not match any of the predefined survey
 * responses, zero points are awarded.
 *
 * @param {number} questionIndex The index of the question
 * @param {string} answerValue The answer provided by the player (lowercase)
 * @returns {number} The points associated with the answer
 */
function getPointsForFinal(questionIndex, answerValue) {
    if (!answerValue) return 0;
    const entry = finalQuestions[questionIndex].answers.find(ans => ans.text.toLowerCase() === answerValue);
    return entry ? entry.points : 0;
}

/**
 * Calculates and displays the results for the Final Feud. Each player's
 * answers and corresponding points are shown side‑by‑side, along with
 * the total score. If the combined total reaches 200 points, a
 * congratulatory message is displayed; otherwise, a message notes the
 * shortfall. Player inputs are hidden once results are displayed.
 */
function showFinalResults() {
    finalBoardElem.innerHTML = '';
    let total = 0;
    for (let i = 0; i < finalQuestions.length; i++) {
        const row = document.createElement('div');
        row.className = 'final-row';
        // Player 1 cell
        const p1Cell = document.createElement('div');
        p1Cell.className = 'final-answer revealed';
        const p1AnswerText = capitalizeWords(player1Answers[i] || '');
        const p1Pts = getPointsForFinal(i, player1Answers[i]);
        total += p1Pts;
        p1Cell.innerHTML = `<span class="answer-text">${p1AnswerText}</span><span class="answer-points">${p1Pts}</span>`;
        // Player 2 cell
        const p2Cell = document.createElement('div');
        p2Cell.className = 'final-answer revealed';
        const p2AnswerText = capitalizeWords(player2Answers[i] || '');
        const p2Pts = getPointsForFinal(i, player2Answers[i]);
        total += p2Pts;
        p2Cell.innerHTML = `<span class="answer-text">${p2AnswerText}</span><span class="answer-points">${p2Pts}</span>`;
        row.appendChild(p1Cell);
        row.appendChild(p2Cell);
        finalBoardElem.appendChild(row);
    }
    finalTotalScoreElem.textContent = total;
    if (total >= 200) {
        finalMessageElem.textContent = 'Congratulations! You have reached 200 points and won the grand prize!';
    } else {
        finalMessageElem.textContent = 'Good effort! You needed 200 points to win.';
    }
    finalResultsSection.style.display = 'block';
    player2Section.style.display = 'none';
}