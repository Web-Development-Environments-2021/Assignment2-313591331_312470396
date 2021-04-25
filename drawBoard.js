var center;
var width;
var height;
var wallImg;
var monsterImg;
var covidMonsterImg;
loadImages();
function Draw() {
  context = canvas.getContext("2d");
  canvas.width = width = canvas.width; // also cleans the board;
  height = canvas.height;
  elem_size = Math.floor(Math.min(width, height) / rows); //Todo CHANGE
  enemy = [15, 115, 125];
  center = new Object();
  for (var i = 0; i < rows; i++) {
    for (var j = 0; j < cols; j++) {
      center.x = j * elem_size + elem_size / 2;
      center.y = i * elem_size + elem_size / 2;
      if (board2[i][j] == 3) drawGoodEnemy();
      else if (enemy.includes(board2[i][j])) drawBall(i, j);
      else if (board2[i][j] == 4) drawWall();
      else if (board2[i][j] == 5) drawEnemies();
      else if (board2[i][j] == 2) drawPacman();
    }
  }
}
function drawPacman() {
  context.beginPath();
  context.arc(
    center.x,
    center.y,
    elem_size / 2,
    0.1 * Math.PI + (pacmanDir * Math.PI) / 2,
    1.85 * Math.PI + (pacmanDir * Math.PI) / 2
  ); // half circle
  context.lineTo(center.x, center.y);
  context.fillStyle = pacColor; //color
  context.fill();
  context.beginPath();
  let lowEye =
    pacmanDir == 0
      ? 0
      : pacmanDir == 1
      ? elem_size / 3
      : pacmanDir == 2
      ? 0
      : elem_size / 8;
  let rightEye =
    pacmanDir == 0
      ? 0
      : pacmanDir == 1
      ? elem_size / 6
      : pacmanDir == 2
      ? -elem_size / 6
      : elem_size / 6;
  context.arc(
    center.x + elem_size / 12 + rightEye,
    center.y - elem_size / 4 + lowEye,
    elem_size / 12,
    0,
    2 * Math.PI
  ); // circle
  context.fillStyle = "black"; //color
  context.fill();
}
function drawBall(i, j) {
  context.beginPath();
  context.arc(center.x, center.y, elem_size / 4, 0, 2 * Math.PI); // circle

  switch (board2[i][j]) {
    case 15:
      context.fillStyle = balls_colors[0]; //color
      break;
    case 115:
      context.fillStyle = balls_colors[1];
      break;
    case 125:
      context.fillStyle = balls_colors[2];
      break;
    default:
      context.fillStyle = "black";
      break;
  }
  context.fill();
}
function drawWall() {
  context.drawImage(
    wallImg,
    center.x - elem_size / 2,
    center.y - elem_size / 2,
    elem_size,
    elem_size
  );
}
function drawEnemies() {
  context.drawImage(
    covidMonsterImg,
    center.x - elem_size / 2,
    center.y - elem_size / 2,
    elem_size,
    elem_size
  );
  // context.beginPath();
  // context.rect(
  //   center.x - elem_size / 2,
  //   center.y - elem_size / 2,
  //   elem_size,
  //   elem_size
  // );
  // context.fillStyle = "red"; //color
  // context.fill();
}
function drawGoodEnemy() {
  context.drawImage(
    monsterImg,
    center.x - elem_size / 2,
    center.y - elem_size / 2,
    elem_size,
    elem_size
  );
  // context.beginPath();
  // context.rect(
  //   center.x - elem_size / 2,
  //   center.y - elem_size / 2,
  //   elem_size,
  //   elem_size
  // );
  // context.fillStyle = "pink"; //color
  // context.fill();
}

function loadImages() {
  wallImg = new Image();
  wallImg.src = "./assets/wall.png";
  monsterImg = new Image();
  monsterImg.src = "./assets/good_monster.png";
  covidMonsterImg = new Image();
  covidMonsterImg.src = "./assets/covid_monster.png";
}
