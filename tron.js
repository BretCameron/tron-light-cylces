const canvas = document.getElementById('tron');
const context = canvas.getContext('2d');
const unit = 15;

class Player {
  constructor(x, y, color) {
    this.color = color || '#fff';
    this.dead = false;
    this.direction = '';
    this.key = '';
    this.x = x;
    this.y = y;
    this.startX = x;
    this.startY = y;

    this.constructor.counter = (this.constructor.counter || 0) + 1;
    this._id = this.constructor.counter;

    Player.allInstances.push(this);
  };
};

Player.allInstances = [];

let p1 = new Player(unit * 6, unit * 6, '#75A4FF');
let p2 = new Player(unit * 43, unit * 43, '#FF5050');

function setKey(key, player, up, right, down, left) {
  switch (key) {
    case up:
      if (player.direction !== 'DOWN') {
        player.key = 'UP';
      };
      break;
    case right:
      if (player.direction !== 'LEFT') {
        player.key = 'RIGHT';
      };
      break;
    case down:
      if (player.direction !== 'UP') {
        player.key = 'DOWN';
      };
      break;
    case left:
      if (player.direction !== 'RIGHT') {
        player.key = 'LEFT';
      };
      break;
    default:
      break;
  };
};

function handleKeyPress(event) {
  let key = event.keyCode;

  if (key === 37 || key === 38 || key === 39 || key === 40) {
    event.preventDefault();
  };

  setKey(key, p1, 38, 39, 40, 37); // arrow keys
  setKey(key, p2, 87, 68, 83, 65); // WASD
  // setKey(key, p3, 73, 76, 75, 74); // IJKL
  // setKey(key, p4, 104, 102, 101, 100); // numpad 8456
};

document.addEventListener('keydown', handleKeyPress);

function getPlayableCells(canvas, unit) {
  let playableCells = new Set();
  for (let i = 0; i < canvas.width / unit; i++) {
    for (let j = 0; j < canvas.height / unit; j++) {
      playableCells.add(`${i * unit}x${j * unit}y`);
    };
  };
  return playableCells;
};

let playableCells = getPlayableCells(canvas, unit);

function drawBackground() {
  context.strokeStyle = '#001900';
  for (let i = 0; i <= canvas.width / unit + 2; i += 2) {
    for (let j = 0; j <= canvas.height / unit + 2; j += 2) {
      context.strokeRect(0, 0, unit * i, unit * j);
    };
  };

  context.strokeStyle = '#000000';
  context.lineWidth = 2;
  for (let i = 1; i <= canvas.width / unit; i += 2) {
    for (let j = 1; j <= canvas.height / unit; j += 2) {
      context.strokeRect(0, 0, unit * i, unit * j);
    };
  };
  context.lineWidth = 1;
};

drawBackground();

function drawStartingPositions(players) {
  players.forEach(p => {
    context.fillStyle = p.color;
    context.fillRect(p.x, p.y, unit, unit);
    context.strokeStyle = 'black';
    context.strokeRect(p.x, p.y, unit, unit);
  });
};

drawStartingPositions(Player.allInstances);

let outcome, winnerColor, playerCount = Player.allInstances.length;

function draw() {
  if (Player.allInstances.filter(p => !p.key).length === 0) {

    if (playerCount === 1) {
      const alivePlayers = Player.allInstances.filter(p => p.dead === false);
      outcome = `Player ${alivePlayers[0]._id} wins!`;
      winnerColor = alivePlayers[0].color;
    } else if (playerCount === 0) {
      outcome = 'Draw!';
    }

    if (outcome) {
      createResultsScreen(winnerColor);
      clearInterval(game);
    };

    Player.allInstances.forEach(p => {

      if (p.key) {

        p.direction = p.key;

        context.fillStyle = p.color;
        context.fillRect(p.x, p.y, unit, unit);
        context.strokeStyle = 'black';
        context.strokeRect(p.x, p.y, unit, unit);

        if (!playableCells.has(`${p.x}x${p.y}y`) && p.dead === false) {
          p.dead = true;
          p.direction = '';
          playerCount -= 1;
        }

        playableCells.delete(`${p.x}x${p.y}y`);

        if (!p.dead) {
          if (p.direction === "LEFT") p.x -= unit;
          if (p.direction === "UP") p.y -= unit;
          if (p.direction === "RIGHT") p.x += unit;
          if (p.direction === "DOWN") p.y += unit;
        };

      };

    });

  }
}

let game = setInterval(draw, 100);

function createResultsScreen(color) {
  const resultNode = document.createElement('div');
  resultNode.id = 'result';
  resultNode.style.color = color || '#fff';
  resultNode.style.position = 'fixed';
  resultNode.style.top = 0;
  resultNode.style.display = 'grid';
  resultNode.style.gridTemplateColumns = '1fr';
  resultNode.style.width = '100%';
  resultNode.style.height = '100vh';
  resultNode.style.justifyContent = 'center';
  resultNode.style.alignItems = 'center';
  resultNode.style.background = '#00000088'

  const resultText = document.createElement('h1');
  resultText.innerText = outcome;
  resultText.style.fontFamily = 'Bungee, cursive';
  resultText.style.textTransform = 'uppercase';

  const replayButton = document.createElement('button');
  replayButton.innerText = 'Replay (Enter)';
  replayButton.style.fontFamily = 'Bungee, cursive';
  replayButton.style.textTransform = 'uppercase';
  replayButton.style.padding = '10px 30px';
  replayButton.style.fontSize = '1.2rem';
  replayButton.style.margin = '0 auto';
  replayButton.style.cursor = 'pointer';
  replayButton.onclick = resetGame;

  resultNode.appendChild(resultText);
  resultNode.appendChild(replayButton);
  document.querySelector('body').appendChild(resultNode);

  document.addEventListener('keydown', (e) => {
    let key = event.keyCode;
    if (key == 13 || key == 32 || key == 27 || key == 82)
      resetGame();
  });
};

function resetGame() {
  // Remove the results node
  const result = document.getElementById('result');
  if (result) result.remove();

  // Remove background then re-draw it
  context.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground();

  // Reset playableCells
  playableCells = getPlayableCells(canvas, unit);

  // Reset players
  Player.allInstances.forEach(p => {
    p.x = p.startX;
    p.y = p.startY;
    p.dead = false;
    p.direction = '';
    p.key = '';
  });
  playerCount = Player.allInstances.length;
  drawStartingPositions(Player.allInstances);

  // Reset outcome
  outcome = '';
  winnerColor = '';

  // Ensure draw() has stopped, then re-trigger it
  clearInterval(game);
  game = setInterval(draw, 100);
};
