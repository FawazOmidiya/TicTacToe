const App = {
  // our selected html elements
  actions: document.querySelector('[data-id="actions"]'),
  actionItems: document.querySelector('[data-id="action-items"]'),
  resetBtn: document.querySelector('[data-id="reset-btn"]'),
  newGameBtn: document.querySelector('[data-id="new-game-btn"]'),
  squares: document.querySelectorAll("[data-id='squares']"),
  modal: document.querySelector('[data-id="modal"]'),
  modalTxt: document.querySelector('[data-id="modal-txt"]'),
  modalBtn: document.querySelector('[data-id="modal-btn"]'),
  turn: document.querySelector('[data-id="turn"]'),

  state: {
    moves: [],
  },

  getGameStatus(moves) {
    const p1Moves = moves
      .filter((move) => move.playerId === 1)
      .map((move) => +move.squareId);
    const p2Moves = moves
      .filter((move) => move.playerId === 2)
      .map((move) => +move.squareId);

    // check for win/tie
    const winningPatterns = [
      [1, 2, 3],
      [1, 5, 9],
      [1, 4, 7],
      [2, 5, 8],
      [3, 5, 7],
      [3, 6, 9],
      [4, 5, 6],
      [7, 8, 9],
    ];

    let winner = null;
    winningPatterns.forEach((pattern) => {
      const p1Win = pattern.every((v) => p1Moves.includes(v));
      const p2Win = pattern.every((v) => p2Moves.includes(v));

      if (p1Win) winner = 1;
      if (p2Win) winner = 2;
    });
    return {
      status:
        moves.length === 9 || winner !== null ? "complete" : "in-progress", //"in-progress | complete "
      winner, //1 | 2 | null
    };
  },

  init() {
    App.registerEventListeners();
  },
  registerEventListeners() {
    App.actions.addEventListener("click", (event) => {
      App.actionItems.classList.toggle("hidden");
    });
    App.resetBtn.addEventListener("click", (event) => {
      console.log("reset game");
    });
    App.newGameBtn.addEventListener("click", (event) => {
      console.log("Start a new game");
    });
    App.modal.addEventListener("click", (event) => {
      App.state.moves = [];
      App.squares.forEach((square) => square.replaceChildren());
      App.modal.classList.add("hidden");
    });
    App.squares.forEach((square) => {
      square.addEventListener("click", (event) => {
        // check for empty box
        const haveMove = (squareId) => {
          const existingMove = App.state.moves.find(
            (move) => move.squareId === squareId
          );
          return existingMove !== undefined;
        };
        if (haveMove(+square.id)) {
          return;
        }

        // create and add player icon
        const lastMove = App.state.moves[App.state.moves.length - 1];
        const OppoPlayer = (playerId) => (playerId === 1 ? 2 : 1);
        const currentPlayer =
          App.state.moves.length === 0 ? 1 : OppoPlayer(lastMove.playerId);
        const nextPlayer = OppoPlayer(currentPlayer);

        const squareIcon = document.createElement("i");
        const turnIcon = document.createElement("i");
        const turnLabel = document.createElement("p");
        turnLabel.innerText = `Player ${nextPlayer}, you're up!`;

        if (currentPlayer === 1) {
          squareIcon.classList.add("fa-solid", "fa-x", "x-color");
          turnIcon.classList.add("fa-solid", "fa-o", "o-color");
          turnLabel.classList = "o-color";
        } else {
          squareIcon.classList.add("fa-solid", "fa-o", "o-color");
          turnIcon.classList.add("fa-solid", "fa-x", "x-color");
          turnLabel.classList = "x-color";
        }
        square.replaceChildren(squareIcon);
        App.turn.replaceChildren(turnIcon, turnLabel);

        App.state.moves.push({
          squareId: +square.id,
          playerId: currentPlayer,
        });

        const game = App.getGameStatus(App.state.moves);

        if (game.status === "complete") {
          App.modal.classList.remove("hidden");

          let message = "";
          if (game.winner) {
            message = `Player ${game.winner} is the winner!`;
          } else {
            message = "Tie Game!";
          }
          App.modalTxt.textContent = message;
        }
      });
    });
  },
};

window.addEventListener("load", App.init);
