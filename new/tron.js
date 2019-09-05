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
    Player.allInstances.push(this);
  };
};

Player.allInstances = [];

const p1 = new Player(unit * 6, unit * 6, '#add8e6');
const p2 = new Player(unit * 43, unit * 43, '#ffc0cb');

function setDirection(key, player, up, right, down, left) {
  switch (key) {
    case up:
      if (player.direction !== 'DOWN') {
        player.direction = 'UP';
      }
      break;
    case right:
      if (player.direction !== 'LEFT') {
        player.direction = 'RIGHT';
      }
      break;
    case down:
      if (player.direction !== 'UP') {
        player.direction = 'DOWN';
      }
      break;
    case left:
      if (player.direction !== 'RIGHT') {
        player.direction = 'LEFT';
      }
      break;
    default:
      break;
  };
};

function handleKeyPress(event) {
  let key = event.keyCode;
  setDirection(key, p1, 38, 39, 40, 37); // arrow keys
  setDirection(key, p2, 87, 68, 83, 65); // WASD
};

document.addEventListener('keydown', handleKeyPress);

// Draw background
context.strokeStyle = '#002900';
for (let i = 0; i <= canvas.width / unit; i++) {
  for (let j = 0; j <= canvas.height / unit; j++) {
    context.strokeRect(0, 0, unit * i, unit * j);
  }
}

// Determine playable cells
const playableCells = new Set();
for (let i = 0; i < canvas.width / unit; i++) {
  for (let j = 0; j < canvas.height / unit; j++) {
    playableCells.add(`${i * unit}x${j * unit}y`);
  };
};

function draw() {

  Player.allInstances.forEach(p => {

    if (p.direction) {

      context.fillStyle = p.color;
      context.fillRect(p.x, p.y, unit, unit);
      context.strokeStyle = 'black';
      context.strokeRect(p.x, p.y, unit, unit);

      if (!playableCells.has(`${p.x}x${p.y}y`)) {
        p.dead = true;
      }

      playableCells.delete(`${p.x}x${p.y}y`);

      if (!p.dead) {
        if (p.direction == "LEFT") p.x -= unit;
        if (p.direction == "UP") p.y -= unit;
        if (p.direction == "RIGHT") p.x += unit;
        if (p.direction == "DOWN") p.y += unit;
      }

    }

  })

}

const game = setInterval(draw, 100);
