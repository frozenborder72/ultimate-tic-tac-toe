# Ultimate Tic Tac Toe - SEI Project 1

## Overview

Ultimate tic-tac-toe is a board game composed of nine tic-tac-toe boards arranged in a 3 × 3 grid. Players take turns playing in the smaller tic-tac-toe boards until one of them wins on the larger tic-tac-toe board. Solo project made in one week.

## The Brief

- Render a grid-based game.
- Design logic for winning with visual indication of completion.
- Allow for restarting the game without reloading the browser.
- Use Vanilla JavaScript for DOM manipulation.
- Use semantic markup for HTML and CSS.
- The finished product should be publicly accessible and deployed.

## Technologies Used

- JavaScript
- HTML
- CSS
- Git and GitHub

## Approach

### 1) Planning

I decided from the start that the app would be based on a one directional data flow paradigm, meaning that user interactions would modify the state and the UI would reflect the changes occurring in the state. And this meant having two sets of boards arrays, one ‘logical’ and one connected to the DOM. This flow is controlled by the most important function of the program:

```
const setPlayableBoards = boards => {
  logicBoardsAvailable = logicBoards.filter(board => board.isPlayable);
  const playableBoardsIds = logicBoardsAvailable.map(board => board.id);

  return boards.filter(board =>
    playableBoardsIds.includes(parseInt(board.dataset.index))
  );
};
```

The first few days of the project were spent on planning the game’s main functionality, i.e. determining programmatically which slots would be available after each player’s move. After playing around with classes, I finally decided to use a ‘functional’ approach, meaning that the game logic would be distributed among a number of small reusable, predictable functions. Lots of effort (but more on that below) was also put in generating the game grid programmatically.

### 2) Functionality

The game starts with X playing wherever they want in any of the 81 empty slots. This move "sends" their opponent to its relative location. E.g., if X played in the top right square of their local board, then O needs to play next in the local board at the top right of the global board. O can then play in any one of the nine available spots in that local board, each move sending X to a different local board. This was possibly the most complicated functionality to implement, as it determines which board or boards should be available for the next move based on the index of the square chosen and the indices of the smaller boards in the large board, and allowing or disallowing the next move accordingly. It also relies upon a number of other functions:

```
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
```

As for the winning conditions, both the single boards and the main board are checked by the same function:

```
const checkIfWin = playerArray =>
  winningPossibilities.filter(possibility =>
    possibility.every(index => playerArray.includes(index))
  ).length > 0;
```

### 3) Styling, DOM manipulation and UX

I kept the styling very simple, and reduced DOM based animations to the strict necessary in order to avoid the bloat and brittleness that usually derive from abusing the Browser APIs. But that does not mean I neglected (or even disregarded) the user experience. For every move, all the unavailable slots are disabled programmatically and grayed out so as to give proper visual feedback.

![sample screenshot](img/Screenshot%202022-05-09%20at%2023.51.33.png)

## Wins & Blockers

### Wins

Having properly implemented the program as per the one way data flow paradigm

### Blockers

I was naively trying for days to generate the ‘state’ boards programmatically by passing a board object directly into the .fill method of the Array constructor, thus passing the same object by reference, and that would cause all kinds of trouble and misery… In the end, I solved the issue using a reducer:

```
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
```

Learning the hard way is the best way to learn I would guess!

### Bugs

None that I have experienced while playing the game over and over.

### Key Takeaways

Pass by reference pass by value… Pass by reference pass by value… Pass by reference pass by value…
