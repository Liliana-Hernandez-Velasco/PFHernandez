document.addEventListener('DOMContentLoaded', function() {
    const choices = ['rock', 'paper', 'scissors'];
    const buttons = document.querySelectorAll('.rps-button');
    const resultDisplay = document.getElementById('result');
    const playerScoreDisplay = document.getElementById('player-score');
    const computerScoreDisplay = document.getElementById('computer-score');
    const clearButton = document.getElementById('clear-results');
    let playerScore = 0;
    let computerScore = 0;

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const playerChoice = button.getAttribute('data-choice');
            const computerChoice = choices[Math.floor(Math.random() * choices.length)];
            const result = getResult(playerChoice, computerChoice);
            updateScores(result);
            resultDisplay.textContent = `You chose ${playerChoice}, computer chose ${computerChoice}. ${result}`;
            playerScoreDisplay.textContent = `Player Score: ${playerScore}`;
            computerScoreDisplay.textContent = `Computer Score: ${computerScore}`;
        });
    });

    clearButton.addEventListener('click', () => {
        playerScore = 0;
        computerScore = 0;
        resultDisplay.textContent = '';
        playerScoreDisplay.textContent = `Player Score: 0`;
        computerScoreDisplay.textContent = `Computer Score: 0`;
    });

    function getResult(player, computer) {
        if (player === computer) {
            return "It's a draw!";
        } else if ((player === 'rock' && computer === 'scissors') || 
                   (player === 'paper' && computer === 'rock') || 
                   (player === 'scissors' && computer === 'paper')) {
            playerScore++;
            return "You win!";
        } else {
            computerScore++;
            return "You lose!";
        }
    }

    function updateScores(result) {
        if (result === "You win!") {
            playerScore++;
        } else if (result === "You lose!") {
            computerScore++;
        }
    }
});
