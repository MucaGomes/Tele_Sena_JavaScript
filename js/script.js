// Iremos criar um jogo de mega sena onde a pessoa pode escolher(incluir) seus numeros,
// salva-los , ver o que esta escolhido e tambem limpar(excluir) os numeros selecionados ,
// é importante lembrar que o usuario só poderá salvar os numeros se estiverem completos
// Regras: 1 -Os numeros que podem ser incluidos serão de 1 até o numero 60
//  2- não podemos inserir mais que 6 numeros
var state = {
  board: [],
  currentgame: [],
  savedGames: [],
};

function setup() {
  readLocalStorage();
  createBoard();
  newGame();
}

function readLocalStorage() {
  
  if (!window.localStorage) {
    return;
  }

  var savedGamesFromLocalStorage = window.localStorage.getItem("saved-games");
  
  if (savedGamesFromLocalStorage) {
    state.savedGames = JSON.parse(savedGamesFromLocalStorage);
  }

}

function writeToLocalStorage() {
  window.localStorage.setItem('saved-games', JSON.stringify(state.savedGames))
}

function newGame() {
  resetGame();
  render();
  //console.log(state.currentgame)
}

function render() {
  renderBoard();
  renderButtons();
  renderSaveGame();
}

function renderBoard() {
  var divBoardNumbers = document.querySelector("#megasena-board");
  divBoardNumbers.innerHTML = "";

  var ulNumbers = document.createElement("ul");
  ulNumbers.classList.add("numbers");

  for (var i = 0; i < state.board.length; i++) {
    var currentNumber = state.board[i];

    var liNumber = document.createElement("li");
    liNumber.textContent = currentNumber;
    liNumber.classList.add("number");

    liNumber.addEventListener("click", onClickNumber);

    if (isNumberInGame(currentNumber)) {
      liNumber.classList.add("selected-number");
    }

    ulNumbers.appendChild(liNumber);
  }

  divBoardNumbers.appendChild(ulNumbers);
}

function renderButtons() {
  var divButtons = document.querySelector("#megasena-buttons");
  divButtons.innerHTML = "";

  var buttonNewGame = createNewGameButton();
  var buttonRandomGame = createRandomGameButton();
  var buttonSavegame = createSaveGameButton();
  var buttonResetSavedgames = createResetSavedGamesButton();

  divButtons.appendChild(buttonNewGame);
  divButtons.appendChild(buttonRandomGame);
  divButtons.appendChild(buttonSavegame);
  divButtons.appendChild(buttonResetSavedgames);
}

function createNewGameButton() {
  var button = document.createElement("button");
  button.textContent = "Novo Jogo";

  button.addEventListener("click", newGame);

  return button;
}

function createRandomGameButton() {
  var button = document.createElement("button");
  button.textContent = "Jogo Aleatório";

  button.addEventListener("click", randomGame);

  return button;
}

function createSaveGameButton() {
  var button = document.createElement("button");
  button.textContent = "Salvar Jogo";
  button.disabled = !isGameComplete();

  button.addEventListener("click", saveGame);

  return button;
}

function createResetSavedGamesButton() {
  var button = document.createElement("button");
  button.textContent = "Resetar Jogos Salvos";
  button.disabled = !hasGamesSaved();

  button.addEventListener("click", resetGamesSaved);

  return button;
}

function resetGamesSaved() {
  localStorage.clear();
  location.reload();
}

function renderSaveGame() {
  var divSavedGames = document.querySelector("#megasena-saved-games");
  divSavedGames.innerHTML = "";

  if (state.savedGames.length === 0) {
    divSavedGames.innerHTML = "<p>Nenhum Jogo Salvo! :( </p>";
    divSavedGames.classList.add("error-message-saved-games");
  } else {
    var ulSavedGames = document.createElement("ul");
    ulSavedGames.classList.add("saved-games");

    for (var i = 0; i < state.savedGames.length; i++) {
      var currentGame = state.savedGames[i];

      divSavedGames.innerHTML = "<p> Jogos Salvos: </p>";
      var liGame = document.createElement("li");
      liGame.classList.add("number-saved-game");
      liGame.textContent = currentGame.join(", ");

      ulSavedGames.appendChild(liGame);
    }
    divSavedGames.appendChild(ulSavedGames);
  }
}

function onClickNumber(event) {
  var value = Number(event.currentTarget.textContent);

  if (isNumberInGame(value)) {
    removeNumberFromGame(value);
  } else {
    addNumberstoGame(value);
  }
  //console.log(state.currentgame)
  render();
}

function createBoard() {
  state.board = [];
  for (var i = 1; i <= 60; i++) {
    state.board.push(i);
  }
}

function addNumberstoGame(numbertoAdd) {
  if (numbertoAdd < 1 || numbertoAdd > 60) {
    console.error("Numero invalido", numbertoAdd);
    return;
  }

  if (state.currentgame.length >= 6) {
    console.error("O jogo já está completo");
    return;
  }

  if (isNumberInGame(numbertoAdd)) {
    console.error("Este numero já está no jogo: ", numbertoAdd);
    return;
  }

  state.currentgame.push(numbertoAdd);
}

function removeNumberFromGame(numberToRemove) {
  if (numberToRemove < 1 || numberToRemove > 60) {
    console.error("Numero invalido", numberToRemove);
    return;
  }

  var newGame = [];

  for (var i = 0; i < state.currentgame.length; i++) {
    var currentNumber = state.currentgame[i];

    if (currentNumber === numberToRemove) {
      continue;
    }

    newGame.push(currentNumber);
  }

  state.currentgame = newGame;
}

function isNumberInGame(numberToCheck) {
  return state.currentgame.includes(numberToCheck);
}

function saveGame() {
  if (!isGameComplete()) {
    console.error("O Jogo não está completo");
    return;
  }

  state.savedGames.push(state.currentgame);
  writeToLocalStorage();
  newGame();

  //console.log(state.savedGames)
}

function isGameComplete() {
  return state.currentgame.length === 6;
}

function hasGamesSaved(){
  return state.savedGames.length > 0
}

function resetGame() {
  state.currentgame = [];
}

function randomGame() {
  resetGame();

  while (!isGameComplete()) {
    var randomNumber = Math.ceil(Math.random() * 60);
    addNumberstoGame(randomNumber);
  }

  //console.log(state.currentgame)
  render();
}

setup();
