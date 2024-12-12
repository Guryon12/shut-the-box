// Global Variables
const die1El = document.querySelector('#die1');
const die2El = document.querySelector('#die2');
const rollBtn = document.querySelector('#roll-btn');
const individualBtn = document.querySelector('#individual-btn');
const sumBtn = document.querySelector('#sum-btn');
const endTurnBtn = document.querySelector('#end-turn-btn');
const player1Input = document.querySelector('#player1-name');
const player2Input = document.querySelector('#player2-name');
const startBtn = document.querySelector('#start-btn');
const roundText = document.querySelector('#round-text');
const turnText = document.querySelector('#turn-text');
const diceSumText = document.querySelector('#dice-sum');
const playAgainBtn = document.querySelector('#play-again-btn');
const winnerText = document.querySelector('#winner-text');

const boxes = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
let currentPlayer = 1;
let currentRound = 1;
let die1 = 0;
let die2 = 0;
let player1TotalPoints = 0;
let player2TotalPoints = 0;
let player1Name = '';
let player2Name = '';

// Start Game Event Listener
startBtn.addEventListener('click', () => {
    if (player1Input.value.trim() && player2Input.value.trim()) {
        player1Name = player1Input.value.trim();
        player2Name = player2Input.value.trim();

        document.querySelector('#player1-scorecard').textContent = player1Name;
        document.querySelector('#player2-scorecard').textContent = player2Name;

        turnText.textContent = `${player1Name}'s Turn`;

        document.querySelector('#players').style.display = 'none';
        document.querySelector('#board').style.display = 'block';
        rollBtn.disabled = false;
    } else {
        alert('Please enter names for both players');
        player1Input.focus();
    }
});

// Roll Button Event Listener
rollBtn.addEventListener('click', () => {
    die1 = Math.floor(Math.random() * 6) + 1;
    die2 = Math.floor(Math.random() * 6) + 1;

    die1El.className = `bi bi-dice-${die1} dice-icon`;
    die2El.className = `bi bi-dice-${die2} dice-icon`;

    diceSumText.textContent = `Dice Sum: ${die1 + die2}`;

    // Button Logic
    individualBtn.disabled = (die1 === die2 ||
        document.querySelector(`#box${die1}`).classList.contains('shut') ||
        document.querySelector(`#box${die2}`).classList.contains('shut'));

    sumBtn.disabled = ((die1 + die2 > 9) ||
        document.querySelector(`#box${die1 + die2}`).classList.contains('shut'));

    endTurnBtn.disabled = !(individualBtn.disabled && sumBtn.disabled);
    rollBtn.disabled = true;
});

// Shut Function
function shut(boxNumber) {
    const boxEl = document.querySelector(`#box${boxNumber}`);
    boxEl.classList.add('shut');
    boxEl.textContent = 'X';
    boxes[boxNumber] = 'X';
}

// Individual Button
individualBtn.addEventListener('click', () => {
    shut(die1);
    shut(die2);
    boxes[0] += die1 + die2;

    individualBtn.disabled = true;
    sumBtn.disabled = true;
    rollBtn.disabled = false;
});

// Sum Button
sumBtn.addEventListener('click', () => {
    shut(die1 + die2);
    boxes[0] += die1 + die2;

    individualBtn.disabled = true;
    sumBtn.disabled = true;
    rollBtn.disabled = false;
});

// End Turn Button
endTurnBtn.addEventListener('click', () => {
    const turnPoints = 45 - boxes[0];

    if (currentPlayer === 1) {
        player1TotalPoints += turnPoints;
        buildRow(currentRound, turnPoints, 'p1Pts');
        currentPlayer = 2;
        turnText.textContent = `${player2Name}'s Turn`;
    } else {
        player2TotalPoints += turnPoints;
        const roundRow = document.querySelector(`#round${currentRound}`);
        roundRow.querySelector('.p2Pts').textContent = turnPoints;
        currentPlayer = 1;
        turnText.textContent = `${player1Name}'s Turn`;
        currentRound++;
        roundText.textContent = `Round: ${currentRound}`;
    }

    resetBoard();

    if (currentRound > 5) {
        gameOver();
    }
});

// Build Row Function
function buildRow(round, points, playerClass) {
    const tr = document.createElement('tr');
    tr.id = `round${round}`;

    const roundTh = document.createElement('th');
    roundTh.textContent = `Round ${round}`;

    const pointsTd1 = document.createElement('td');
    pointsTd1.classList.add(playerClass);
    pointsTd1.textContent = points;

    const pointsTd2 = document.createElement('td');
    pointsTd2.classList.add('p2Pts');

    tr.appendChild(roundTh);
    tr.appendChild(pointsTd1);
    tr.appendChild(pointsTd2);

    document.querySelector('#score-body').appendChild(tr);
}

// Reset Board Function
function resetBoard() {
    boxes.fill(0);
    const numberBoxes = document.querySelectorAll('.number-box');
    numberBoxes.forEach((box, index) => {
        box.classList.remove('shut');
        box.textContent = index + 1;
    });

    rollBtn.disabled = false;
    individualBtn.disabled = true;
    sumBtn.disabled = true;
    endTurnBtn.disabled = true;

    die1El.className = 'bi bi-dice-1 dice-icon';
    die2El.className = 'bi bi-dice-2 dice-icon';
    diceSumText.textContent = 'Dice Sum: 0';
}

// Game Over Function
function gameOver() {
    document.querySelector('#board').style.display = 'none';
    document.querySelector('#scorecard').style.display = 'block';
    document.querySelector('#winner').style.display = 'block';

    const winnerName = player1TotalPoints < player2TotalPoints ? player1Name : player2Name;
    winnerText.textContent = `${winnerName} wins with ${Math.min(player1TotalPoints, player2TotalPoints)} points!`;
}

// Play Again Button
playAgainBtn.addEventListener('click', () => {
    // Reset all game variables
    currentPlayer = 1;
    currentRound = 1;
    player1TotalPoints = 0;
    player2TotalPoints = 0;

    // Reset UI
    document.querySelector('#players').style.display = 'block';
    document.querySelector('#board').style.display = 'none';
    document.querySelector('#winner').style.display = 'none';
    document.querySelector('#score-body').innerHTML = '';

    // Reset inputs
    player1Input.value = '';
    player2Input.value = '';
    player1Input.focus();
});
