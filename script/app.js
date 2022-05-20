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
const domBoardsArray = [...domBoards];

domBoards.forEach(board => {
  for (let i = 0; i < boardCount; i++) {
    const slot = document.createElement('div');
    slot.classList.add('slot', 'hidden');
    board.appendChild(slot);
  }
});

megaBoardEl.classList.add('slide');

// GAME STATE
class Player {
  constructor(id, name, marker) {
    this.id = id;
    this.name = name;
    this.marker = marker;
    this.wins = [];
  }
}

const logicBoards = new Array(boardCount).fill(true).reduce((acc, _, i) => {
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

let playBoard = null;
let logicBoardsAvailable = logicBoards;
let playableBoards = domBoardsArray;
let restarted = false;
let player;

// EVENT LISTENERS
const startGame = () => {
  player = player1;

  animateBoards();

  restartBtn.textContent = 'Restart Game';

  playableBoards.forEach((board, index) => {
    [...board.children].forEach((slot, i) => {
      slot.addEventListener(
        'click',
        handleClick.bind(null, board, index, slot, i),
        { once: true }
      );
    });
  });
};

function handleClick(board, index, slot, i) {
  playBoard = logicBoards[index];
  playBoard[player.name].choices = [...playBoard[player.name].choices, i];
  slot.classList.add('taken');
  slot.innerHTML = player.marker;
  if (checkIfWin(playBoard[player.name].choices)) {
    player.wins = [...player.wins, index];
    if (checkIfWin(player.wins)) {
      h1.textContent = `${player.name} wins`;
      animateTitle();
    } else {
      slot.parentElement.classList.add('animated');
      setTimeout(() => {
        slot.parentElement.classList.remove('animated');
        playBoard.isPlayable = false;
        checkIfPlayableAndAddClass(index);
        playableBoards = setPlayableBoards(domBoardsArray);
        allPlayable(playableBoards);
        addRemoveEventListeners();
      }, 2000);
    }
  } else if (isFullBoard(board)) {
    playBoard.isPlayable = false;
    playableBoards = setPlayableBoards(domBoardsArray);
  } else {
    nextBoard(index, i);
  }
  player = player === player1 ? player2 : player1;
}

restartBtn.addEventListener('click', () => {
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
  h1.classList.remove('title-bounce');

  playableBoards.forEach(board => {
    [...board.children].forEach(slot => {
      slot.replaceWith(slot.cloneNode());
    });
  });

  setPlayableBoards(domBoardsArray);
  startGame();
});

const nextBoard = (i, index) => {
  if (i !== index) {
    if (existsPlayBoard(index)) {
      playBoard = logicBoards[index];
      selectAllButOne(domBoardsArray, index, 'add', 'remove');
      addRemoveEventListeners();
    } else {
      allPlayable(playableBoards);
      domBoardsArray[i].classList.add('non-playable');
      addRemoveEventListeners();
    }
  } else {
    allPlayable(playableBoards);
    domBoardsArray[i].classList.add('non-playable');
    addRemoveEventListeners();
  }
};

const checkIfWin = playerArray =>
  winningPossibilities.filter(possibility =>
    possibility.every(index => playerArray.includes(index))
  ).length > 0;

// UTILITY FUNCTIONS
const setPlayableBoards = boards => {
  logicBoardsAvailable = logicBoards.filter(board => board.isPlayable);
  const playableBoardsIds = logicBoardsAvailable.map(board => board.id);

  return boards.filter(board =>
    playableBoardsIds.includes(parseInt(board.dataset.index))
  );
};

const existsPlayBoard = index =>
  logicBoardsAvailable.some(board => board.id === index + 1);

const isFullBoard = board =>
  [...board.children].every(slot => slot.classList.contains('taken'));

const allPlayable = boards =>
  boards.forEach(board => {
    board.classList.remove('non-playable');
  });

const checkIfPlayableAndAddClass = index => {
  logicBoards[index].isPlayable === false &&
    domBoards[index].classList.add('non-playable');
};

const selectAllButOne = (playBoard, index, action1, action2) => {
  playBoard.forEach(board => board.classList[action1]('non-playable'));
  playBoard[index].classList[action2]('non-playable');
};

const addRemoveEventListeners = () => {
  domBoardsArray.forEach(board => {
    [...board.children].forEach(slot => {
      slot.replaceWith(slot.cloneNode(true));
    });
  });

  domBoardsArray.forEach((board, index) => {
    [...board.children].forEach((slot, i) => {
      slot.addEventListener(
        'click',
        handleClick.bind(null, board, index, slot, i),
        { once: true }
      );
    });
  });

  domBoardsArray
    .filter(board => board.classList.contains('non-playable'))
    .forEach(board => {
      [...board.children].forEach(slot => {
        slot.replaceWith(slot.cloneNode(true));
      });
    });
};

// animation functions
const animateBoards = () => {
  let index = 0;
  setInterval(() => {
    if (index < domBoards.length) {
      for (let i = 0; i < domBoards[index].children.length; i++) {
        domBoards[index].children[i].classList.remove('hidden');
      }
      index++;
    }
  }, 200);
};

const animateTitle = () => {
  h1.classList.add('title-bounce');
};

allPlayable(playableBoards);
