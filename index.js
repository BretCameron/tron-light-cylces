var c = document.getElementById("snake");
var result = document.getElementById('result');

var ctx = c.getContext("2d");

document.addEventListener("keydown", direction);

const box = 15;

let p1 = {
  key: '',
  direction: '',
  x: 15,
  y: 15,
  history: [[15, 15]],
  alive: true
};

let p2 = {
  key: '',
  direction: '',
  x: 720,
  y: 15,
  history: [[720, 15]],
  alive: true
};

function direction(event) {
  let key = event.keyCode;

  if (key == 37 && p1.direction != "RIGHT") {
    p1.key = "LEFT";
  } else if (key == 38 && p1.direction != "DOWN") {
    p1.key = "UP";
  } else if (key == 39 && p1.direction != "LEFT") {
    p1.key = "RIGHT";
  } else if (key == 40 && p1.direction != "UP") {
    p1.key = "DOWN";
  };

  if (key == 65 && p2.direction != "RIGHT") {
    p2.key = "LEFT";
  } else if (key == 87 && p2.direction != "DOWN") {
    p2.key = "UP";
  } else if (key == 68 && p2.direction != "LEFT") {
    p2.key = "RIGHT";
  } else if (key == 83 && p2.direction != "UP") {
    p2.key = "DOWN";
  }

}

function drawBg() {

  for (let i = 0; i <= 750 / box; i++) {
    for (let j = 0; j <= 750 / box; j++) {
      ctx.strokeStyle = '#002900';
      ctx.strokeRect(0, 0, 15 * i, 15 * j);
    }
  }
}

drawBg();


function draw() {

  if (!p1.alive) {
    result.innerText = (`Pink Wins!`)
    clearInterval(game);

  }
  if (!p2.alive) {
    result.innerText = (`Blue Wins!`)
    clearInterval(game);

  }

  ctx.fillStyle = 'lightblue';
  ctx.fillRect(p1.x, p1.y, 15, 15);

  ctx.strokeStyle = 'black';
  ctx.strokeRect(p1.x, p1.y, 15, 15);

  ctx.fillStyle = 'pink';
  ctx.fillRect(p2.x, p2.y, 15, 15);

  ctx.strokeStyle = 'black';
  ctx.strokeRect(p2.x, p2.y, 15, 15);

  if (p1.x % 15 === 0 && p1.y % 15 === 0) {
    p1.direction = p1.key;
  }

  if (p2.x % 15 === 0 && p2.y % 15 === 0) {
    p2.direction = p2.key;
  }

  if (p1.alive && p2.direction) {
    if (p1.direction == "LEFT") p1.x -= box;
    if (p1.direction == "UP") p1.y -= box;
    if (p1.direction == "RIGHT") p1.x += box;
    if (p1.direction == "DOWN") p1.y += box;
  }

  if (p2.alive && p1.direction) {
    if (p2.direction == "LEFT") p2.x -= box;
    if (p2.direction == "UP") p2.y -= box;
    if (p2.direction == "RIGHT") p2.x += box;
    if (p2.direction == "DOWN") p2.y += box;
  }

  // Draw - head on collision
  if (p2.history.length > 2 && p1.history.length > 2) {
    if (p1.x === p2.history[p2.history.length - 1][0] && p1.y === p2.history[p2.history.length - 1][1]) {
      draw();
    } else if (p2.x === p1.history[p2.history.length - 1][0] && p2.y === p1.history[p2.history.length - 1][1]) {
      draw();
    }
  }

  function draw() {
    result.innerText = (`Draw!`);
    clearInterval(game);
  }

  // Collision with self
  for (let i = 0; i < p1.history.length; i++) {
    if (p1.x === p1.history[i][0] && p1.y === p1.history[i][1] && p1.history.length > 1) {
      p1.alive = false;
    }
  }

  for (let i = 0; i < p2.history.length; i++) {
    if (p2.x === p2.history[i][0] && p2.y === p2.history[i][1] && p2.history.length > 1) {
      p2.alive = false;
    }
  }

  if (p1.direction && p2.direction) {
    p1.history.push([p1.x, p1.y]);
    p2.history.push([p2.x, p2.y]);
  }

  // Collision with opponent
  for (let i = 0; i < p2.history.length; i++) {
    if (p1.x === p2.history[i][0] && p1.y === p2.history[i][1] && p2.history.length > 1) {
      p1.alive = false;
    }
  }

  for (let i = 0; i < p1.history.length; i++) {
    if (p2.x === p1.history[i][0] && p2.y === p1.history[i][1] && p1.history.length > 1) {
      p2.alive = false;
    }
  }


  // Collision with border
  if (p1.x >= 750 || p1.y >= 750 || p1.x < 0 || p1.y < 0) {
    p1.alive = false;
  };

  if (p2.x >= 750 || p2.y >= 750 || p2.x < 0 || p2.y < 0) {
    p2.alive = false;
  };

}


let game;
let speed = 100;

game = setInterval(draw, speed);
