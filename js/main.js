const start       = document.querySelector('#start');
const cards       = document.querySelectorAll('.memory-card');
const spinnerBody = document.querySelector('#spinner-body');
const spinner     = document.querySelector('#spinner');
const matched     = document.querySelector('#matched');
const timeDisplay = document.querySelector('#time');

let hasFlippedCard = false;
let firstCard, secondCard, lockBoard, match, time, totalTime;

time = 0;
match = 0;
totalTime = 0;

let countdown, gamechecker;

start.addEventListener('click', startGame);

function timer() {
    time = time + 1;
    updateTimer();
}

function checkGameStatus() {
    if(match === 6) {
        clearInterval(countdown);
        clearInterval(gamechecker);
    }
}

function startGame() {

    // if the animation is still running, dont allow to start
    if(lockBoard) {
        return;
    };

    // lock the game while preparing the game to prevent uncesessary clicks
    lockBoard = true;

    // run the spinner
    spinnerBody.classList.add('spinner-body-active');
    spinner.classList.add('spinner-active');

    setTimeout(() => {
        spinnerBody.classList.remove('spinner-body-active');
        spinner.classList.remove('spinner-active');
        match = 0;
        updateMatchCount();
        time = 0; 
        updateTimer();
        countdown = setInterval(timer, 1000);
        gamechecker = setInterval(checkGameStatus,50);
    }, 1700);

    updateMatchCount();
    
    // unflip all the cards
    cards.forEach(card => card.classList.remove('flip'));
    
    // add even listners to every cards
    cards.forEach(card => card.addEventListener('click', flipCard));
    
    // randomize order and reset game variables
    setTimeout(() => {
        shuffleCards();
        resetFlip();
    }, 1500);
    
}

function shuffleCards() {
    cards.forEach(cards => {
        cards.style.order = Math.floor(Math.random() * 12);
    });
};

function flipCard() {

    // Dont allow user to click other cards while matching first and second card 
    if(lockBoard) {
        return;
    }

    // dont let the first card to be selected as the second card.
    // e.g. Double click happens and the system is on bug
    if(this === firstCard) {
        return;
    }

    // add flip class to reveal the back face of the card
    this.classList.toggle('flip');

    if(!hasFlippedCard) {
        // first card has been flipped
        firstCard      = this;
        hasFlippedCard = true;
    }
    else {
        // second card has been flipped
        secondCard = this;
        matchcards(firstCard, secondCard);
    }

};

function matchcards(firstCard, secondCard) {
    if(firstCard.dataset.framework === secondCard.dataset.framework) {
        
        // Matched
        console.log('Cards are matched');

        // If selected cards are matched keep it Open by removing the event listener
        firstCard.removeEventListener('click',  flipCard);
        secondCard.removeEventListener('click', flipCard);

        match = match + 1;

        updateMatchCount();
        
        resetFlip();

    }
    else{

        // Unmatched
        console.log('Cards are unmatched');

        // Lockbord true means we are currently matching the first and second selection. 
        lockBoard = true;

        // unflipp the cards and reset the variables for next card selection and matching
        setTimeout(() => {
            firstCard.classList.remove('flip');
            secondCard.classList.remove('flip');

            resetFlip();
        }, 1500);
    }
}

function resetFlip() {

    console.log('Resetting the flipping variables');
    hasFlippedCard = false;
    lockBoard      = false;
    firstCard      = null;
    secondCard     = null;
}

function updateMatchCount() {
    matched.innerHTML = match;
}

function updateTimer() {
    timeDisplay.innerHTML = time;
}




