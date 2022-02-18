/***
 *
 *
 * FOR LATER: ANIMATE BOARDS
 *
 *
 */

/**
 *  UI
 */

// DECLARE MAIN ARRAY AND SET IT TO []
const boardEl = document.querySelector('#board');
const slotsDivs = [];
const slotsCount = 9;
for (let i = 0; i < slotsCount; i++) {
  const slot = document.createElement('div');
  slot.classList.add('slot');
  boardEl.appendChild(slot);
}

// FOR EVERY BOARD MAKE AN ARRAY OF 9 DIVS AND PUSH IT INTO MAIN ARRAY
const winningPossibilities = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const board = {
  playerChoices: [0, 1, 2],
  isPlayable: true,
};

const checkIfWin = board => {
  const win = winningPossibilities.filter(possibility =>
    possibility.every(index => board.playerChoices.includes(index))
  );

  return win.length > 0;
};

console.log(checkIfWin(board));

// APPLY CLASSES FOR STYLING AND IDS BASED ON THE MAIN ARRAY INDEXES TO IDENTIFY THEM

/**
 * LOGIC
 */

// MAKE AN ARRAY OF ARRAYS WITH ALL POSSIBLE WINNING COMBINATION
// SET AN OBJECT FOR EVERY BOARD WITH 2 ARRAYS THAT WILL STORE PLAYER 1 AND PLAYER TWO CHOICES
// RUN CHECK FOR WIN FUNCTION
// AFTER EVERY MOVE CHECK IF PLAYER HAS WON RUNNING EVERY() LOOPING OVER WINNING COMBINATIONS AND CHECKING THE PLAYER'S ARRAY

// IF NO WIN:
// PLAYER CHOOSES SLOT BY CLICKING ON IT
// IF SLOT IS EMPTY
// SLOT GETS ASSIGNED THE CLASS OF TAKEN AND THE CLASS OF THE PLAYER, SAY 'X' AND 'O' THE SLOT INDEX GETS PUSHED INTO THE CORRISPONDING BOARD PLAYERS ARRAY

// NEXT PLAYER THEN PLAYS ON THE BOARD WITH THE INDEX CORRISPONDING TO THE INDEX OF SLOT OF FORMER PLAYER'S CHOICE

// IF BOARD IS FULL (OR NON PLAYABLE, BUT THAT'S FOR ANOTHER DAY...) THE NEXT BOARD WILL BE RANDOMLY CHOSEN
