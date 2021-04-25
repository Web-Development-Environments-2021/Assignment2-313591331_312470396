/*
game.js
IS RESPONSIBLE for all the game Logic,
keys responsiveness,
points calculating,
time calculating,
life remaining,
running the Intervals and moreover.
The main function is Start which is the *ROOT* of each game.
*/
var shape = new Object();
var board;
var board2; // the second board holds the "upper layer" contains the moving enemies and temporal changes.
var score;
var pacColor;
var start_time;
var time_elapsed;
var interval;
var totalFood;
var enemyPos = {};
var goodMonster;
var rows;
var cols;
var IntervalTime;
var pacmanDir = 0;
var countGoodMonster;
var life;
var foodRemainGame;
var colorBool;
function Start() {
  setInitialValues();
  gameBoardCreation();
  addEventListener(
    "keydown",
    function (e) {
      keysDown[e.keyCode] = true;
    },
    false
  );
  addEventListener(
    "keyup",
    function (e) {
      keysDown[e.keyCode] = false;
    },
    false
  );
  interval = setInterval(UpdatePosition, IntervalTime);
}
function UpdatePosition() {
  movePlayer();
  moveOthers();
  gameStatus();
  Draw();
}

function moveEnemies() {
  for (let index = numEnemies - 1; index >= 0; index--) {
    enemy_i = enemyPos[index][0];
    enemy_j = enemyPos[index][1];
    i_diff = Math.abs(shape.i - enemy_i);
    j_diff = Math.abs(shape.j - enemy_j);
    let wall_stuck = false;
    //move is the rate for them to move.. the less enemies,the more "speed";
    const move = Math.random() > 0.18 * numEnemies ? true : false;
    if (!move) {
      board2[enemy_i][enemy_j] = 5;
      continue;
    }
    if (i_diff > j_diff) {
      //move y axis
      distance = enemy_i - shape.i;
      if (distance > 0 && GoodMonsterAbleGo("up", enemy_i, enemy_j)) {
        enemy_i -= 1;
      } else if (distance < 0 && GoodMonsterAbleGo("down", enemy_i, enemy_j)) {
        enemy_i += 1;
      } else {
        //enemy did not succeed to pass wall.
        wall_stuck = true;
      }
    } else {
      //move x axis
      distance = enemy_j - shape.j;
      if (distance > 0 && GoodMonsterAbleGo("left", enemy_i, enemy_j)) {
        enemy_j -= 1;
      } else if (distance < 0 && GoodMonsterAbleGo("right", enemy_i, enemy_j)) {
        enemy_j += 1;
      } else {
        //enemy did not succeed to pass wall.
        wall_stuck = true;
      }
    }
    if (wall_stuck) {
      let dir = Math.random();
      if (dir > 0.6) {
        if (dir < 0.7 && GoodMonsterAbleGo("up", enemy_i, enemy_j)) {
          //up
          enemy_i -= 1;
        } else if (dir < 0.8 && GoodMonsterAbleGo("right", enemy_i, enemy_j)) {
          //right
          enemy_j += 1;
        } else if (dir < 0.9 && GoodMonsterAbleGo("down", enemy_i, enemy_j)) {
          //down
          enemy_i += 1;
        } else if (GoodMonsterAbleGo("left", enemy_i, enemy_j)) {
          //left
          enemy_j -= 1;
        }
      }
    }
    enemyPos[index] = [enemy_i, enemy_j];
    board2[enemy_i][enemy_j] = 5;
  }
}

function GetKeyPressed() {
  if (keysDown[keys[3]]) {
    //left
    return 1;
  }
  if (keysDown[keys[0]]) {
    //up
    return 2;
  }
  if (keysDown[keys[1]]) {
    //right
    return 3;
  }
  if (keysDown[keys[2]]) {
    //down
    return 4;
  }
}

function checkForCrash() {
  for (let index = numEnemies - 1; index >= 0; index--) {
    enemy_i = enemyPos[index][0];
    enemy_j = enemyPos[index][1];
    i_diff = shape.i - enemy_i;
    j_diff = shape.j - enemy_j;
    if (i_diff === 0 && j_diff === 0) {
      board[shape.i][shape.j] = 0;
      const crashPlace = [enemy_i, enemy_j];
      score -= 10;
      life -= 1;
      initatePositions();
      return true;
    }
  }
  return false;
}
function moveOthers() {
  deepcopy2d();
  moveGoodMonster();
  moveEnemies();
}

function moveGoodMonster() {
  // moves the good monster
  if (countGoodMonster <= 0) return;
  let moveDecider = Math.random() * 100;
  if (moveDecider > 25) {
    //will move only 75% precent of time to allow pacman to catch him
    let rand = Math.random() * 100;
    if (rand <= 25) {
      if (GoodMonsterAbleGo("up", goodMonster[0], goodMonster[1]))
        goodMonster[0] -= 1;
    } else if (rand <= 50) {
      if (GoodMonsterAbleGo("right", goodMonster[0], goodMonster[1]))
        goodMonster[1] += 1;
    } else if (rand <= 75) {
      if (GoodMonsterAbleGo("down", goodMonster[0], goodMonster[1]))
        goodMonster[0] += 1;
    } else {
      if (GoodMonsterAbleGo("left", goodMonster[0], goodMonster[1]))
        goodMonster[1] -= 1;
    }
  }
  board2[goodMonster[0]][goodMonster[1]] = 3;
}

function GoodMonsterAbleGo(dir, i, j) {
  const can_go_there = [0, 1, 2, 15, 115, 125];
  switch (dir) {
    case "up":
      if (i > 0 && can_go_there.includes(board2[i - 1][j])) return true;
      break;
    case "right":
      if (j < cols - 1 && can_go_there.includes(board2[i][j + 1])) return true;
      break;
    case "down":
      if (i < rows - 1 && can_go_there.includes(board2[i + 1][j])) return true;
      break;
    case "left":
      if (j > 0 && can_go_there.includes(board2[i][j - 1])) return true;
      break;
  }
}

function movePlayer() {
  /*
  The Responsible for moving the Pacman.
  Responsible for calling function for updating points in case of food eating.
  */
  board[shape.i][shape.j] = 0;
  var x = GetKeyPressed();
  if (x == 1) {
    if (shape.j > 0 && board[shape.i][shape.j - 1] != 4) {
      pacmanDir = 2;
      shape.j--;
    }
  } else if (x == 2) {
    if (shape.i > 0 && board[shape.i - 1][shape.j] != 4) {
      pacmanDir = 3;
      shape.i--;
    }
  } else if (x == 3) {
    pacmanDir = 0;
    if (shape.j < cols - 1 && board[shape.i][shape.j + 1] != 4) {
      shape.j++;
    }
  } else if (x == 4) {
    pacmanDir = 1;
    if (shape.i < rows - 1 && board[shape.i + 1][shape.j] != 4) {
      shape.i++;
    }
  }
  checkForPointIncrease();
  board[shape.i][shape.j] = 2;
  if (
    countGoodMonster > 0 &&
    shape.i == goodMonster[0] &&
    shape.j == goodMonster[1]
  ) {
    score += 50;
    countGoodMonster--;
    board2[goodMonster[0]][goodMonster[1]] = 0;
    return;
  }
}

function setBadMonstersPositions() {
  enemyPos = {
    0: [0, 0],
    1: [0, cols - 1],
    2: [rows - 1, 0],
    3: [rows - 1, cols - 1],
  };
}

function checkForFinishGame() {
  /*
  - checking if needed to finish to game.
  - The Responsible for stopping the INTERVAL and Game.
  */
  let message = "Your Score: " + score;
  let end = "\n\nWould like to play again?";
  let ans = null;
  if (life === 0) {
    window.clearInterval(interval);
    ans = confirm(message + "\nLoser!" + end);
  } else if (foodRemainGame <= 0) {
    window.clearInterval(interval);
    ans = confirm(message + "\nWinner!!!" + end);
  } else if (time_elapsed >= maxTime) {
    if (score < 100) {
      window.clearInterval(interval);
      ans = confirm("You are better than " + score + " points!" + end);
    } else {
      window.clearInterval(interval);
      ans = confirm(message + "\nWinner!!!" + end);
    }
  }
  if (ans != null) {
    if (ans) {
      Start();
    } else {
      setWelcome();
    }
  }
}
function initatePositions() {
  if (life >= 0) {
    setPacman();
    setBadMonstersPositions();
  }
}
function gameStatus() {
  /*
  - checking if needed to finish to game
  - checking if there was a crash 
  - checking if pacman is in "HOT" mode.
  */
  checkForFinishGame();
  checkForCrash();
  Hotness();
  updateTitles();
}

function Hotness() {
  const currentTime = new Date();
  time_elapsed = (currentTime - start_time) / 1000;
  pacColor = "yellow"; //default
  if (score >= 50 && time_elapsed <= 10) {
    colorBool = !colorBool;
    if (colorBool) pacColor = "red";
    else {
      pacColor = "orange";
    }
  }
}
function setInitialValues() {
  rows = 10;
  cols = 10;
  IntervalTime = 250;
  life = 2;
  colorBool = true;
  foodRemainGame = totalFood;
  countGoodMonster = 1;
  goodMonster = [Math.floor((rows - 1) / 2), Math.floor((cols - 1) / 2)];
  board = new Array();
  board2 = new Array();
  score = 0;
  pacColor = "yellow";
  start_time = new Date();
  keysDown = {};
}
function deepcopy2d() {
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[0].length; col++) {
      board2[row][col] = board[row][col];
    }
  }
}
function checkForPointIncrease() {
  /*
  - Responsible for increasePoint
  */
  if (board2[shape.i][shape.j] == 15) {
    score += 5;
    foodRemainGame--;
  } else if (board2[shape.i][shape.j] == 115) {
    foodRemainGame--;
    score += 15;
  } else if (board2[shape.i][shape.j] == 125) {
    foodRemainGame--;
    score += 25;
  }
}
function updateTitles() {
  lblScore.value = score;
  lblTime.value = time_elapsed;
  lblLife.value = life;
}
