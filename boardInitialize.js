var foodRemain;
var maxTime;
var numEnemies;
var remain_max_walls;
var balls_colors;
function gameBoardCreation() {
  setBadMonstersPositions();
  let cnt = rows * cols;
  remain_max_walls = rows * cols - totalFood - numEnemies - 3; // pacman,good_mons
  foodRemain = totalFood;
  var pacman_remain = 1;
  for (var i = 0; i < rows; i++) {
    board[i] = new Array();
    board2[i] = new Array();
    for (var j = 0; j < cols; j++) {
      if (!putWalls(i, j)) {
        var randomNum = Math.random();
        if (randomNum <= (1.0 * foodRemain) / cnt) {
          putFood(i, j);
        } else if (
          pacman_remain === 1 &&
          randomNum < (1.0 * (pacman_remain + foodRemain)) / cnt
        ) {
          //Put the pacman itself
          shape.i = i;
          shape.j = j;
          pacman_remain--;
          board[i][j] = 2;
        } else {
          board[i][j] = 0;
        }
        cnt--;
      }
    }
  }
  putMonsters();
  putBonusMonsters();
  while (foodRemain > 0) {
    var emptyCell = findRandomEmptyCell(board);
    putFood(emptyCell[0], emptyCell[1]);
  }
  while (pacman_remain > 0) {
    var emptyCell = findRandomEmptyCell(board);
    shape.i = emptyCell[0];
    shape.j = emptyCell[1];
    pacman_remain--;
  }
}
function putWalls(i, j) {
  if (remain_max_walls > 0 && Math.random() < 0.08) {
    remain_max_walls--;
    board[i][j] = 4;
    return true;
  }
  return false;
}

function setPacman() {
  var emptyCell = findRandomEmptyCell(board);
  shape.i = emptyCell[0];
  shape.j = emptyCell[1];
}

function setConfigurations(
  keys_array = [87, 68, 83, 65],
  food = 1,
  balls_color = ["green", "blue", "purple"],
  monsters = 0,
  time = 99999
) {
  keys = keys_array;
  totalFood = food;
  balls_colors = balls_color;
  numEnemies = monsters;
  maxTime = time;
}
function putFood(i, j) {
  const rand = Math.random();
  if (rand <= 0.6) {
    board[i][j] = 15;
  } else if (rand <= 0.9) {
    board[i][j] = 115;
  } else {
    board[i][j] = 115;
  }
  foodRemain--;
}
function putMonsters() {
  //Adds enemies only to board2
  //Goods and bads
  remain_enemies = numEnemies - 1;
  while (remain_enemies >= 0) {
    pos = enemyPos[remain_enemies];
    board2[pos[0]][pos[1]] = 5;
    remain_enemies--;
  }
  board2[goodMonster[0]][goodMonster[1]] = 3; // add good Monster
}

function findRandomEmptyCell(board) {
  var i = Math.floor(Math.random() * (rows - 1) + 1);
  var j = Math.floor(Math.random() * (cols - 1) + 1);
  while (board[i][j] != 0 && i != goodMonster[0] && j != goodMonster[1]) {
    i = Math.floor(Math.random() * (rows - 1) + 1);
    j = Math.floor(Math.random() * (cols - 1) + 1);
  }
  return [i, j];
}
function putBonusMonsters() {
  var emptyCell = findRandomEmptyCell(board);
  nonPointsMonster = emptyCell;
  board2[nonPointsMonster[0]][nonPointsMonster[1]] = 7; // add good Monster
  var emptyCell = findRandomEmptyCell(board);
  zeroPointsMonster = emptyCell;
  board2[zeroPointsMonster[0]][zeroPointsMonster[1]] = 8; // add good Monster
}
