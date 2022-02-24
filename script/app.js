/**
 * TODOS
 *  - CHECK IF SLOT IS ALREADY TAKEN
 *  - REMOVE EVENTLISTENERS FROM UNPLAYABLE BOARDS
 */

// DOM SHIT
const h1 = document.querySelector('h1');
const restartBtn = document.querySelector('#restart');
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

const logicBoards = new Array(boardCount).fill(true).reduce((acc, item, i) => {
  return acc.concat({
    id: i + 1,
    'Player 1': {
      choices: [],
    },
    'Player 2': {
      choices: [],
    },
    isPlayable: true,
  });
}, []);

console.log(logicBoards);

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

let player;
let playBoard = null;
let logicBoardsAvailable = logicBoards;
let playableBoards = [...domBoards];

// EVENT LISTENERS FUCKERY
const startGame = () => {
  player = player1;

  playableBoards.forEach((board, index) => {
    [...board.children].forEach((slot, i) => {
      slot.addEventListener('click', function handleClick() {
        playBoard = logicBoards[index];
        playBoard[player.name].choices = [...playBoard[player.name].choices, i];
        console.log(logicBoards);
        slot.classList.add('taken');
        slot.textContent = player.marker;
        if (checkIfWin(playBoard[player.name].choices)) {
          player.wins = [...player.wins, index];
          if (checkIfWin(player.wins)) {
            console.log('Player won the game');
            h1.textContent = `${player.name} wins`;
          } else {
            slot.parentElement.classList.add('non-playable');
            console.log(player.wins);
            playBoard.isPlayable = false;
            [...board.children].forEach(slot => {
              console.log(slot);
              slot.removeEventListener('click', handleClick);
            });
            playableBoards = setPlayableBoards([...domBoards]);
            allPlayable(playableBoards);
          }
        } else if (isFullBoard(board)) {
          playBoard.isPlayable = false;
          playableBoards = setPlayableBoards([...domBoards]);
        } else {
          slot.removeEventListener('click', handleClick);
          nextBoard(index, i);
        }

        player = player === player1 ? player2 : player1;
      });
    });
  });
};

restartBtn.addEventListener('click', e => {
  player1.wins = [];
  player2.wins = [];
  logicBoards.forEach(board => {
    board['Player 1'].choices = [];
    board['Player 2'].choices = [];
    board.isPlayable = true;
  });
  [...domBoards].forEach(board => {
    board.classList.remove('non-playable');
    [...board.children].forEach(slot => {
      slot.textContent = '';
      slot.classList.remove('taken');
    });
  });
  h1.textContent = 'Ultimate Tic Tac Toe';

  setPlayableBoards([...domBoards]);
  startGame();
});

const nextBoard = (i, index) => {
  if (i !== index) {
    if (existsPlayBoard(index)) {
      playBoard = logicBoards[index];
      selectAllButOne([...domBoards], index, 'add', 'remove');
    } else {
      allPlayable(playableBoards);
      [...domBoards][i].classList.add('non-playable');
    }
  } else {
    allPlayable(playableBoards);
    [...domBoards][i].classList.add('non-playable');
  }
};

const checkIfWin = playerArray =>
  winningPossibilities.filter(possibility =>
    possibility.every(index => playerArray.includes(index))
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

allPlayable(playableBoards);
startGame();
