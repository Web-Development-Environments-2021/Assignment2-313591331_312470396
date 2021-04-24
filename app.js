var context;
var shape = new Object();
var board;
var score;
var pac_color;
var start_time;
var time_elapsed;
var interval;
var total_food;
var width;
var height;
var elem_in_axis = 10;
var num_of_enemies = 1;
var enemy_positions = {};
var last_enemy_positions = [0, 0, 0, 0];
var board_for_enemies;

function screenSwitch(divToShow) {
  resetView();
  $(divToShow).show();
}

function resetView() {
  $("#game").hide();
  $("#register").hide();
  $("#login").hide();
}

$(document).ready(function () {
  resetView();
  context = canvas.getContext("2d");
  num_of_enemies = 4; //remove !
  Start();
});

function Start() {
  //4 is wall
  //1 is food
  //0
  //2 is pacman
  width = canvas.width;
  height = canvas.height;
  board = new Array();
  score = 0;
  pac_color = "yellow";
  var cnt = 100;
  total_food = 50;
  var food_remain = total_food;
  var pacman_remain = 1;
  start_time = new Date();
  for (var i = 0; i < 10; i++) {
    board[i] = new Array();
    //put obstacles in (i=3,j=3) and (i=3,j=4) and (i=3,j=5), (i=6,j=1) and (i=6,j=2)
    for (var j = 0; j < 10; j++) {
      if (
        (i == 3 && j == 3) ||
        (i == 3 && j == 4) ||
        (i == 3 && j == 5) ||
        (i == 6 && j == 1) ||
        (i == 6 && j == 2)
      ) {
        board[i][j] = 4;
      } else {
        var randomNum = Math.random();
        if (randomNum <= (1.0 * food_remain) / cnt) {
          food_remain--;
          board[i][j] = 1;
        } else if (randomNum < (1.0 * (pacman_remain + food_remain)) / cnt) {
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
  deepcopy2d();
  addEnemies();
  while (food_remain > 0) {
    var emptyCell = findRandomEmptyCell(board);
    board[emptyCell[0]][emptyCell[1]] = 1;
    food_remain--;
  }
  keysDown = {};
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
  interval = setInterval(UpdatePosition, 250);
}
function addEnemies() {
  remain_enemies = num_of_enemies - 1;
  enemy_positions = {
    0: [0, 0],
    1: [0, elem_in_axis - 1],
    2: [elem_in_axis - 1, 0],
    3: [elem_in_axis - 1, elem_in_axis - 1],
  };
  while (remain_enemies >= 0) {
    pos = enemy_positions[remain_enemies];
    if (board[pos[0]][pos[1]] == 1) {
      replace_cell = findRandomEmptyCell(board);
      board[replace_cell[0]][replace_cell[1]] = 1;
      board[pos[0]][pos[1]] = 5;
    } else if (board[pos[0]][pos[1]] == 0) {
      board[pos[0]][pos[1]] = 5;
    }
    remain_enemies--;
  }
  console.log(board);
}

function moveEnemies() {
  for (let index = num_of_enemies - 1; index >= 0; index--) {
    enemy_i = enemy_positions[index][0];
    enemy_j = enemy_positions[index][1];
    i_diff = Math.abs(shape.i - enemy_i);
    j_diff = Math.abs(shape.j - enemy_j);
    if (i_diff > j_diff) {
      //move x axis
      distance = enemy_i - shape.i;
      //enemy now in enemy_i, enemy_j
      if (distance > 0) {
        //move up
        board[enemy_i][enemy_j] = last_enemy_positions[index];
        last_enemy_positions[index] = board[enemy_i - 1][enemy_j]; //for next iter
        enemy_positions[index] = [enemy_i - 1, enemy_j];
        board[enemy_i - 1][enemy_j] = 5;
      } else if (distance < 0) {
        // move down
        board[enemy_i][enemy_j] = last_enemy_positions[index];
        last_enemy_positions[index] = board[enemy_i + 1][enemy_j]; //for next iter
        enemy_positions[index] = [enemy_i + 1, enemy_j];
        board[enemy_i + 1][enemy_j] = 5;
      }
    } else {
      //move x axis
      distance = enemy_j - shape.j;
      //enemy now in enemy_i, enemy_j
      if (distance > 0) {
        //move left
        board[enemy_i][enemy_j] = last_enemy_positions[index];
        last_enemy_positions[index] = board[enemy_i][enemy_j - 1]; //for next iter, where he about to go
        enemy_positions[index] = [enemy_i, enemy_j - 1];
        board[enemy_i][enemy_j - 1] = 5;
      } else if (distance < 0) {
        // move down
        board[enemy_i][enemy_j] = last_enemy_positions[index];
        last_enemy_positions[index] = board[enemy_i][enemy_j + 1]; //for next iter
        enemy_positions[index] = [enemy_i, enemy_j + 1];
        board[enemy_i][enemy_j + 1] = 5;
      }
    }
  }
}
function addOnBoard(board, x, y, value) {
  board[x][y] = value;
}
function replaceOnBoard(board, oldX, oldY, oldValue, newX, newY, value) {}

function findRandomEmptyCell(board) {
  var i = Math.floor(Math.random() * 9 + 1);
  var j = Math.floor(Math.random() * 9 + 1);
  while (board[i][j] != 0) {
    i = Math.floor(Math.random() * 9 + 1);
    j = Math.floor(Math.random() * 9 + 1);
  }
  return [i, j];
}

function GetKeyPressed() {
  if (keysDown[38]) {
    //left
    return 1;
  }
  if (keysDown[40]) {
    //right
    return 2;
  }
  if (keysDown[37]) {
    //up
    return 3;
  }
  if (keysDown[39]) {
    //down
    return 4;
  }
}

function Draw() {
  elem_size = Math.min(width, height) / elem_in_axis;
  canvas.width = canvas.width; //clean board
  lblScore.value = score;
  lblTime.value = time_elapsed;
  for (var i = 0; i < 10; i++) {
    for (var j = 0; j < 10; j++) {
      var center = new Object();
      center.x = i * elem_size + elem_size / 2;
      center.y = j * elem_size + elem_size / 2;
      if (board[i][j] == 2) {
        context.beginPath();
        context.arc(
          center.x,
          center.y,
          elem_size / 2,
          0.1 * Math.PI,
          1.85 * Math.PI
        ); // half circle
        context.lineTo(center.x, center.y);
        context.fillStyle = pac_color; //color
        context.fill();
        context.beginPath();
        context.arc(
          center.x + elem_size / 12,
          center.y - elem_size / 4,
          elem_size / 12,
          0,
          2 * Math.PI
        ); // circle
        context.fillStyle = "black"; //color
        context.fill();
      } else if (board[i][j] == 1) {
        context.beginPath();
        context.arc(center.x, center.y, elem_size / 4, 0, 2 * Math.PI); // circle
        context.fillStyle = "black"; //color
        context.fill();
      } else if (board[i][j] == 4) {
        context.beginPath();
        context.rect(
          center.x - elem_size / 2,
          center.y - elem_size / 2,
          elem_size,
          elem_size
        );
        context.fillStyle = "grey"; //color
        context.fill();
      } else if (board[i][j] == 5) {
        context.beginPath();
        context.rect(
          center.x - elem_size / 2,
          center.y - elem_size / 2,
          elem_size,
          elem_size
        );
        context.fillStyle = "red"; //color
        context.fill();
      }
    }
  }
}

function UpdatePosition() {
  board[shape.i][shape.j] = 0;
  moveEnemies();
  var x = GetKeyPressed();
  if (x == 1) {
    if (shape.j > 0 && board[shape.i][shape.j - 1] != 4) {
      shape.j--;
    }
  }
  if (x == 2) {
    if (shape.j < 9 && board[shape.i][shape.j + 1] != 4) {
      shape.j++;
    }
  }
  if (x == 3) {
    if (shape.i > 0 && board[shape.i - 1][shape.j] != 4) {
      shape.i--;
    }
  }
  if (x == 4) {
    if (shape.i < 9 && board[shape.i + 1][shape.j] != 4) {
      shape.i++;
    }
  }

  //i moved on the matrix
  if (board[shape.i][shape.j] == 1) {
    score++;
  }
  board[shape.i][shape.j] = 2;
  var currentTime = new Date();
  time_elapsed = (currentTime - start_time) / 1000;
  if (score >= 20 && time_elapsed <= 10) {
    pac_color = "green";
  }
  if (check_if_enemy_find()) {
    window.clearInterval(interval);
    window.alert("You Fucking Loserrr");
  }
  if (score == total_food) {
    window.clearInterval(interval);
    window.alert("Game completed");
  } else {
    Draw();
  }
}
function check_if_enemy_find() {
  for (let index = num_of_enemies - 1; index >= 0; index--) {
    enemy_i = enemy_positions[index][0];
    enemy_j = enemy_positions[index][1];
    i_diff = shape.i - enemy_i;
    j_diff = shape.j - enemy_j;
    if (i_diff === 0 && j_diff === 0) {
      return true;
    }
  }
  return false;
}

function deepcopy2d() {
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[0].length; col++) {
      board2[row][col] = board[row][col];
    }
  }
}
