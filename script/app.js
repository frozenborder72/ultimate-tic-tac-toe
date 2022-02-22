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
  boardEl.setAttribute('data-index', i + 1);
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
  constructor(id, name, marker) {
    this.id = id;
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
  {
    id: 9,
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
const player1 = new Player(0, 'Player 1', 'X');
const player2 = new Player(1, 'Player 2', 'O');

let player = player1;
let playBoard = null;
let logicBoardsAvailable = logicBoards;
let playableBoards = [...domBoards];

playableBoards.forEach((board, index) => {
  [...board.children].forEach((slot, i) => {
    slot.addEventListener('click', e => {
      playBoard = logicBoards[index];
      playBoard[player.name].choices.push(i);
      slot.classList.add('taken');
      slot.textContent = player.marker;
      if (checkIfWin(playBoard, player)) {
        h1.textContent = `${player.name} wins`;
        slot.parentElement.classList.add('non-playable');
        player.wins.push(index);
        playBoard.isPlayable = false;
        playableBoards = setPlayableBoards([...domBoards]);
        allPlayable(playableBoards);
      } else if (isFullBoard(board)) {
        playBoard.isPlayable = false;
        playableBoards = setPlayableBoards([...domBoards]);
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

const setPlayableBoards = boards => {
  logicBoardsAvailable = logicBoards.filter(board => board.isPlayable);
  const playableBoardsIds = logicBoardsAvailable.map(board => board.id);

  return boards.filter(board =>
    playableBoardsIds.includes(parseInt(board.dataset.index))
  );
};

const allPlayable = boards =>
  boards.forEach(board => {
    board.classList.remove('non-playable');
  });

const selectAllButOne = (playBoard, index, action1, action2) => {
  playBoard.forEach(board => board.classList[action1]('non-playable'));
  playBoard[index].classList[action2]('non-playable');
};

const existsPlayBoard = index =>
  logicBoardsAvailable.some(board => board.id === index + 1);

const nextBoard = (i, index) => {
  if (i !== index) {
    if (existsPlayBoard(index)) {
      playBoard = logicBoardsAvailable[index];
      selectAllButOne(playableBoards, index, 'add', 'remove');
    } else {
      allPlayable(playableBoards);
      [...domBoards][i].classList.add('non-playable');
    }
  } else {
    allPlayable(playableBoards);
    [...domBoards][i].classList.add('non-playable');
  }
};

allPlayable(playableBoards);
