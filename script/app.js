/**
 * TODOS
 *  - CHECK IF SLOT IS ALREADY TAKEN
 *  - GENERALIZE CHECKIFWIN FUNCTION TO USE IT ALSO WITH MEGABOARD
 *  - TURN BOARD INTO A CLASS AND MEGABOARD INTO A CLASS THAT EXTENDS BOARD
 *  - REMOVE EVENTLISTENERS FROM UNPLAYABLE BOARDS
 */

// DOM SHIT
const h1 = document.querySelector('h1');
const megaBoardEl = document.querySelector('#mega-board');
const slotsDivs = [];
const boardCount = 9;

for (let i = 0; i < boardCount; i++) {
  const boardEl = document.createElement('div');
  boardEl.setAttribute('data-index', i);
  boardEl.classList.add('board');
  megaBoardEl.appendChild(boardEl);
}

const domBoards = document.querySelectorAll('.board');

domBoards.forEach(board => {
  for (let i = 0; i < boardCount; i++) {
    const slot = document.createElement('div');
    slot.classList.add('slot');
    board.appendChild(slot);
  }
});

// GAME STATE
class Player {
  constructor(name, marker) {
    this.name = name;
    this.marker = marker;
    this.wins = [];
  }
}

// const logicBoards = new Array(9)
//   .fill({
//     'Player 1': {
//       choices: [],
//     },
//     'Player 2': {
//       choices: [],
//     },
//     isPlayable: true,
//   })
//   .map((board, i) => ({ ...board, id: i }));

// console.log(logicBoards);

const logicBoards = [
  {
    id: 0,
    'Player 1': {
      choices: [],
    },
    'Player 2': {
      choices: [],
    },
    isPlayable: true,
  },
  {
    id: 1,
    'Player 1': {
      choices: [],
    },
    'Player 2': {
      choices: [],
    },
    isPlayable: true,
  },
  {
    id: 2,
    'Player 1': {
      choices: [],
    },
    'Player 2': {
      choices: [],
    },
    isPlayable: true,
  },
  {
    id: 3,
    'Player 1': {
      choices: [],
    },
    'Player 2': {
      choices: [],
    },
    isPlayable: true,
  },
  {
    id: 4,
    'Player 1': {
      choices: [],
    },
    'Player 2': {
      choices: [],
    },
    isPlayable: true,
  },
  {
    id: 5,
    'Player 1': {
      choices: [],
    },
    'Player 2': {
      choices: [],
    },
    isPlayable: true,
  },
  {
    id: 6,
    'Player 1': {
      choices: [],
    },
    'Player 2': {
      choices: [],
    },
    isPlayable: true,
  },
  {
    id: 7,
    'Player 1': {
      choices: [],
    },
    'Player 2': {
      choices: [],
    },
    isPlayable: true,
  },
  {
    id: 8,
    'Player 1': {
      choices: [],
    },
    'Player 2': {
      choices: [],
    },
    isPlayable: true,
  },
];

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

// GAME LOGIC
const player1 = new Player('Player 1', 'X');
const player2 = new Player('Player 2', 'O');

let player = player1;
let playBoard = null;

domBoards.forEach((board, index) => {
  [...board.children].forEach((slot, i) => {
    slot.addEventListener('click', () => {
      playBoard = logicBoards[index];
      console.log(playBoard);
      playBoard[player.name].choices.push(i);
      slot.classList.add('taken');
      slot.textContent = player.marker;
      if (checkIfWin(playBoard, player)) {
        h1.textContent = `${player.name} wins`;
        player.wins.push(index);
        console.log(playBoard);
        playBoard.isPlayable = false;
      } else if (isFullBoard(board)) {
        playBoard.isPlayable = false;
      } else {
        nextBoard(index, i);
      }

      player = player === player1 ? player2 : player1;
    });
  });
});

const checkIfWin = (board, player) =>
  winningPossibilities.filter(possibility =>
    possibility.every(index => board[player.name].choices.includes(index))
  ).length > 0;

// UTILITY FUNCTIONS
const isFullBoard = board =>
  [...board.children].every(slot => slot.classList.contains('taken'));

const playableBoards = [...domBoards].filter((board, i) => {
  if (logicBoards[i].isPlayable) {
    return board;
  }
});

console.log(playableBoards);

const allPlayable = boardsArray =>
  boardsArray.forEach((board, i) => {
    board.isPlayable = true;
    domBoards[i].classList.remove('non-playable');
  });

const nextBoard = (prevBoard, index) => {
  if (prevBoard === index) {
    allPlayable(playableBoards);
    domBoards[index].classList.add('non-playable');
  } else {
    domBoards.forEach((board, i) => {
      if (i !== index) {
        board.classList.add('non-playable');
      }
    });
    if (!logicBoards[index].isPlayable || isFullBoard(domBoards[index])) {
      allPlayable(playableBoards);
    } else {
      playBoard = logicBoards[index];
      domBoards[index].classList.remove('non-playable');
    }
  }
  // console.log(playableBoards);
};

allPlayable(playableBoards);
