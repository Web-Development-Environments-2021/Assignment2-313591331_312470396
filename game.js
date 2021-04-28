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
var countGoodMonster;
var nonPointsMonster;
var countNonPointMonster;
var rows;
var cols;
var IntervalTime;
var pacmanDir = 0;
var life;
var foodRemainGame;
var colorBool;
var noPointsStatus;
var zeroPointsMonster;

/*

  0 - empty cell
  1 - food (15,115,125) 1 is a prefix to point.
  2 - pacman
  3 - 
  4 - wall 
  7 - temporal no points monster
  8 - zero point monster
*/

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
  musicPlay(true);
  interval = setInterval(UpdatePosition, IntervalTime);
}
function UpdatePosition() {
  movePlayer();
  collisionChecks();
  moveOthers();
  Draw();
  gameStatus();
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
      if (distance > 0 && MonsterAbleToGo("up", enemy_i, enemy_j)) {
        enemy_i -= 1;
      } else if (distance < 0 && MonsterAbleToGo("down", enemy_i, enemy_j)) {
        enemy_i += 1;
      } else {
        //enemy did not succeed to pass wall.
        wall_stuck = true;
      }
    } else {
      //move x axis
      distance = enemy_j - shape.j;
      if (distance > 0 && MonsterAbleToGo("left", enemy_i, enemy_j)) {
        enemy_j -= 1;
      } else if (distance < 0 && MonsterAbleToGo("right", enemy_i, enemy_j)) {
        enemy_j += 1;
      } else {
        //enemy did not succeed to pass wall.
        wall_stuck = true;
      }
    }
    if (wall_stuck) {
      let dir = Math.random();
      if (dir > 0.6) {
        if (dir < 0.7 && MonsterAbleToGo("up", enemy_i, enemy_j)) {
          //up
          enemy_i -= 1;
        } else if (dir < 0.8 && MonsterAbleToGo("right", enemy_i, enemy_j)) {
          //right
          enemy_j += 1;
        } else if (dir < 0.9 && MonsterAbleToGo("down", enemy_i, enemy_j)) {
          //down
          enemy_i += 1;
        } else if (MonsterAbleToGo("left", enemy_i, enemy_j)) {
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
      let crashAudio = $("#pac_conf")[0];
      crashAudio.play();
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
  moveNonPointMonster();
  moveZeroPointMonster();
  moveEnemies();
}

function moveGoodMonster() {
  // moves the good monster
  if (countGoodMonster <= 0) {
    return;
  }
  if (checkIfGoodMonsterCollision()) return;
  let moveDecider = Math.random() * 100;
  if (moveDecider > 25) {
    //will move only 75% precent of time to allow pacman to catch him
    let rand = Math.random() * 100;
    if (rand <= 25) {
      if (MonsterAbleToGo("up", goodMonster[0], goodMonster[1]))
        goodMonster[0] -= 1;
    } else if (rand <= 50) {
      if (MonsterAbleToGo("right", goodMonster[0], goodMonster[1]))
        goodMonster[1] += 1;
    } else if (rand <= 75) {
      if (MonsterAbleToGo("down", goodMonster[0], goodMonster[1]))
        goodMonster[0] += 1;
    } else {
      if (MonsterAbleToGo("left", goodMonster[0], goodMonster[1]))
        goodMonster[1] -= 1;
    }
  }
  board2[goodMonster[0]][goodMonster[1]] = 3;
}
function moveNonPointMonster() {
  // moves the good monster
  if (countNonPointMonster < 20) return;
  let moveDecider = Math.random() * 100;
  if (moveDecider > 25) {
    //will move only 75% precent of time to allow pacman to catch him
    let rand = Math.random() * 100;
    if (rand <= 12) {
      if (MonsterAbleToGo("up", nonPointsMonster[0], nonPointsMonster[1]))
        nonPointsMonster[0] -= 1;
    } else if (rand <= 50) {
      if (MonsterAbleToGo("right", nonPointsMonster[0], nonPointsMonster[1]))
        nonPointsMonster[1] += 1;
    } else if (rand <= 75) {
      if (MonsterAbleToGo("down", nonPointsMonster[0], nonPointsMonster[1]))
        nonPointsMonster[0] += 1;
    } else {
      if (MonsterAbleToGo("left", nonPointsMonster[0], nonPointsMonster[1]))
        nonPointsMonster[1] -= 1;
    }
  }
  board2[nonPointsMonster[0]][nonPointsMonster[1]] = 7;
}

function MonsterAbleToGo(dir, i, j) {
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
    musicPlay(false);
    window.clearInterval(interval);
    ans = confirm(message + "\nLoser!" + end);
  }
  if (foodRemainGame <= 0 || time_elapsed >= maxTime) {
    if (score < 100) {
      musicPlay(false);
      window.clearInterval(interval);
      ans = confirm("You are better than " + score + " points!" + end);
    } else {
      musicPlay(false);
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
  updateOfNoPointsValue();
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
  rows = 20;
  cols = 20;
  IntervalTime = 170;
  life = 5;
  colorBool = true;
  foodRemainGame = totalFood;
  countGoodMonster = 1;
  countNonPointMonster = 20;
  noPointsStatus = false;
  this.NoPoints(false);
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
  if ([15, 115, 125].includes(board2[shape.i][shape.j])) foodRemainGame--;
  if (noPointsStatus) {
    return;
  }
  if (board2[shape.i][shape.j] == 15) score += 5;
  else if (board2[shape.i][shape.j] == 115) score += 15;
  else if (board2[shape.i][shape.j] == 125) score += 25;
}
function updateTitles() {
  lblScore.value = score;
  lblTime.value = time_elapsed;
  lblLife.value = life;
}
function updateOfNoPointsValue() {
  if (this.noPointsStatus == true) {
    countNonPointMonster--;
    if (countNonPointMonster == 0) {
      noPointsStatus = false;
      NoPoints(false);
    }
  }
}

function checkIfGoodMonsterCollision() {
  if (
    countGoodMonster > 0 &&
    shape.i == goodMonster[0] &&
    shape.j == goodMonster[1]
  ) {
    score += 50;
    countGoodMonster--;
    board[goodMonster[0]][goodMonster[1]] = 2;
    goodMonster[0] = null;
    goodMonster[1] = null;
    return true;
  }
  return false;
}
function moveZeroPointMonster() {
  // moves the good monster
  if (zeroPointsMonster[0] == -1) return;
  let moveDecider = Math.random() * 100;
  if (moveDecider > 25) {
    //will move only 75% precent of time to allow pacman to catch him
    let rand = Math.random() * 100;
    if (rand <= 12) {
      if (MonsterAbleToGo("up", zeroPointsMonster[0], zeroPointsMonster[1]))
        zeroPointsMonster[0] -= 1;
    } else if (rand <= 50) {
      if (MonsterAbleToGo("right", zeroPointsMonster[0], zeroPointsMonster[1]))
        zeroPointsMonster[1] += 1;
    } else if (rand <= 75) {
      if (MonsterAbleToGo("down", zeroPointsMonster[0], zeroPointsMonster[1]))
        zeroPointsMonster[0] += 1;
    } else {
      if (MonsterAbleToGo("left", zeroPointsMonster[0], zeroPointsMonster[1]))
        zeroPointsMonster[1] -= 1;
    }
  }
  board2[zeroPointsMonster[0]][zeroPointsMonster[1]] = 8;
}

function checkIfNoPointMonsterCollision() {
  if (
    // Crash with NonPoint Monster
    countNonPointMonster > 0 &&
    shape.i == nonPointsMonster[0] &&
    shape.j == nonPointsMonster[1]
  ) {
    noPointsStatus = true;
    this.NoPoints(true);
    board[nonPointsMonster[0]][nonPointsMonster[1]] = 2;
    return true;
  }
  return false;
}

function checkIfZeroMonsterCollision() {
  if (
    // Crash with NonPoint Monster
    shape.i == zeroPointsMonster[0] &&
    shape.j == zeroPointsMonster[1]
  ) {
    board[zeroPointsMonster[0]][zeroPointsMonster[1]] = 2;
    zeroPointsMonster[0] = -1; // flag disable moving zeropointmonster
    score = 0;

    return true;
  }
  return false;
}
function collisionChecks() {
  if (checkIfGoodMonsterCollision()) return;
  if (checkIfNoPointMonsterCollision()) return;
  if (checkIfZeroMonsterCollision()) return;
}
