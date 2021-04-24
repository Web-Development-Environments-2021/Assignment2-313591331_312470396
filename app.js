var context;
var shape = new Object();
var board;
var board2;
var score;
var pac_color;
var start_time;
var time_elapsed;
var interval;
var total_food;
var food_remain;
var width;
var height;
var num_of_enemies;
var enemy_positions = {};
var last_enemy_positions = [0, 0, 0, 0];
var point_monster;
var count_point_monster;
var board_for_enemies;
var rows;
var cols;
var time = 250;
var crash_place = [,];
var pacman_direction = 0;
var life;
var cnt;
//0 empty
//1 food
//2 packman
//3 50points "point_monster"
//4 is wall
//5 enemy
var elem_in_axis = 10;
var dataBase = { k: "k" }; // <username:password>
var input;
var arrowKey = { 37: "left", 38: "up", 39: "right", 40: "down" };
var controls = { left: 37, up: 38, right: 39, down: 40 };
var keyConfigListener;
var colorJson = {
  green: "green",
  yellow: "yellow",
  purple: "purple",
  blue: "blue",
};

function screenSwitch(divToShow) {

	resetView()
	$(divToShow).show();
  if (divToShow=="#game"){
  context = canvas.getContext("2d");
  Start();}
}

function about() {
  console.log("ABOUT");
  $("#dialog").dialog("open");
}

function resetView() {
  $("#game").hide();
  $("#register").hide();
  $("#login").hide();
  $("#welcome").hide();
  $("#config").hide();
}

function validatePassword(password) {
  let alertMsg = "";
  password.length > 5
    ? (alertMsg += "")
    : (alertMsg += "Password must contain more than 5 Characters.\n");
  password.match(/[A-z]/)
    ? (alertMsg += "")
    : (alertMsg += "Password must have at least one Character.\n");
  password.match(/\d/)
    ? (alertMsg += "")
    : (alertMsg += "Password must have at least one Number.\n");
  return alertMsg;
}

function validateName(name) {
  let alertMsg = "";
  name.match(/\d/)
    ? (alertMsg += "First and Last Name can't contain numbers.\n")
    : (alertMsg += "");
  return alertMsg;
}

function validateEmail(email) {
  let alertMsg = "";
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  re.test(String(email).toLowerCase())
    ? (alertMsg += "")
    : (alertMsg += "Must enter a Valid Email.\n");
  return alertMsg;
}

function emptyInput() {
  let alertMsg = "";
  if (
    $("#full-name").val() &&
    $("#email").val() &&
    $("#birth-date").val() &&
    $("#user-name-reg").val() &&
    $("#password-reg").val()
  ) {
    alertMsg += "";
  } else {
    alertMsg += "All fields must be field.\n";
  }
  return alertMsg;
}

function initSelector() {
  for (var i = 40; i < 91; i++) {
    $("#food-config").append("<option value=" + i + ">" + i + "</option>");
  }

  for (var key in colorJson) {
    $(".color-input").append(
      "<option value=" + colorJson[key] + ">" + key + "</option>"
    );
  }
}

function keyConfig(keyToConfig) {
  $("#"+keyToConfig+"-config").text("Click on key");        
  $("button").prop("disabled",true)
  console.log("Key " + keyToConfig)
  removeEventListener("keydown",keyConfig)
  let keyValue;
  var keyPress = false;
  keyConfigListener = addEventListener(
    "keydown",
    function (e) {
      if (!keyPress)
      {
        keyValue = e.keyCode;
        const label = arrowKey[keyValue] ? arrowKey[keyValue] : String.fromCodePoint(keyValue)
        $("#"+keyToConfig+"-config").text(label);        
        console.log("value = " + keyValue);
        controls[keyToConfig] = keyValue
        $("button").prop("disabled",false)
      }
      keyPress = true
    });
};

$(document).ready(function () {
  resetView();
  $("#welcome").show();
  initSelector()
  $("#login-button").click(function () {
    console.log("Login!");
    var name = $("#user-name").val();
    var password = $("#password").val();
    if (dataBase[name] == password) {
      screenSwitch("#game");
      return;
    }
    alert("User Name or Password is incorrect");
  });

  $("#register-button").click(function () {
    console.log("Register!");
    var alertMsg = "";
    var input = "";
    alertMsg += emptyInput();
    input = $("#password-reg").val();
    alertMsg += validatePassword(input);
    input = $("#full-name").val();
    alertMsg += validateName(input);
    input = $("#email").val();
    alertMsg += validateEmail(input);
    if (alertMsg != "") {
      alert(alertMsg);
      return;
    }
    dataBase[$("#user-name-reg").val()] = $("#password-reg").val();
    alert("User Created");
    resetView();
  });

  $("#start-btn").click(function () {
    var alertMsg = "";
    var input = "";
    $("#config").hide();
    $("#board").show();
  });

  $("#dialog").dialog({
    height: 300,
    width: 500,
    autoOpen: false,
    modal: true,
    open: function () {
      $(".ui-widget-overlay").bind("click", function () {
        $("#dialog").dialog("close");
      });
    },
  });

  $("select").change(function () {
    var otherSelects = $("select").not(this);
    var oldValue = $(this).data("old");
    if (oldValue)
      otherSelects
        .find("option[value=" + oldValue + "]")
        .removeAttr("disabled");
    if (this.value)
      otherSelects
        .find("option[value=" + this.value + "]")
        .attr("disabled", "disabled");
    $(this).data("old", this.value);
  });
});

function Start() {
  life = 5;
  context.canvas.width = window.innerWidth;
  context.canvas.height = window.innerHeight * 0.7;
  num_of_enemies = 1; //remove !
  count_point_monster = 1;
  rows = 10; //Remove TODO
  cols = 10;
  point_monster = [Math.floor((rows - 1) / 2), Math.floor((cols - 1) / 2)];
  width = canvas.width;
  height = canvas.height;
  board = new Array();
  board2 = new Array();
  score = 0;
  pac_color = "yellow";
  start_time = new Date();
  setBadMonsters();
  gameBoardCreation();
  addEnemies();
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
  interval = setInterval(UpdatePosition, time);
}
function addEnemies() {
  //Adds enemies only to board2
  //Goods and bads
  remain_enemies = num_of_enemies - 1;
  while (remain_enemies >= 0) {
    pos = enemy_positions[remain_enemies];
    board2[pos[0]][pos[1]] = 5;
    remain_enemies--;
  }
  board2[point_monster[0]][point_monster[1]] = 3;
}

function moveEnemies() {
  for (let index = num_of_enemies - 1; index >= 0; index--) {
    enemy_i = enemy_positions[index][0];
    enemy_j = enemy_positions[index][1];
    i_diff = Math.abs(shape.i - enemy_i);
    j_diff = Math.abs(shape.j - enemy_j);
    let wall_stuck = false;
    //move is the rate for them to move.. the less enemies,the more "speed";
    const move = Math.random() > 0.18 * num_of_enemies ? true : false;
    if (!move) {
      board2[enemy_i][enemy_j] = 5;
      continue;
    }
    if (i_diff > j_diff) {
      //move y axis
      distance = enemy_i - shape.i;
      if (distance > 0 && PointMonAbleToGoThere("up", enemy_i, enemy_j)) {
        enemy_i -= 1;
      } else if (
        distance < 0 &&
        PointMonAbleToGoThere("down", enemy_i, enemy_j)
      ) {
        enemy_i += 1;
      } else {
        //enemy did not succeed to pass wall.
        wall_stuck = true;
      }
    } else {
      //move x axis
      distance = enemy_j - shape.j;
      if (distance > 0 && PointMonAbleToGoThere("left", enemy_i, enemy_j)) {
        enemy_j -= 1;
      } else if (
        distance < 0 &&
        PointMonAbleToGoThere("right", enemy_i, enemy_j)
      ) {
        enemy_j += 1;
      } else {
        //enemy did not succeed to pass wall.
        wall_stuck = true;
      }
    }
    if (wall_stuck) {
      let dir = Math.random();
      if (dir > 0.6) {
        if (dir < 0.7 && PointMonAbleToGoThere("up", enemy_i, enemy_j)) {
          //up
          enemy_i -= 1;
        } else if (
          dir < 0.8 &&
          PointMonAbleToGoThere("right", enemy_i, enemy_j)
        ) {
          //right
          enemy_j += 1;
        } else if (
          dir < 0.9 &&
          PointMonAbleToGoThere("down", enemy_i, enemy_j)
        ) {
          //down
          enemy_i += 1;
        } else if (PointMonAbleToGoThere("left", enemy_i, enemy_j)) {
          //left
          enemy_j -= 1;
        }
      }
    }
    enemy_positions[index] = [enemy_i, enemy_j];
    board2[enemy_i][enemy_j] = 5;
  }
}
function findRandomEmptyCell(board) {
  var i = Math.floor(Math.random() * (rows - 1) + 1);
  var j = Math.floor(Math.random() * (cols - 1) + 1);
  while (board[i][j] != 0 && i != point_monster[0] && j != point_monster[1]) {
    i = Math.floor(Math.random() * (rows - 1) + 1);
    j = Math.floor(Math.random() * (cols - 1) + 1);
  }
  return [i, j];
}

function GetKeyPressed() {
  if (keysDown[37]) {
    //left
    return 1;
  }
  if (keysDown[38]) {
    //up
    return 2;
  }
  if (keysDown[39]) {
    //right
    return 3;
  }
  if (keysDown[40]) {
    //down
    return 4;
  }
}

function Draw() {
  elem_size = Math.floor(Math.min(width, height) / rows); //Todo CHANGE
  canvas.width = canvas.width; //clean board
  lblScore.value = score;
  lblTime.value = time_elapsed;
  lblLife.value = life;
  for (var i = 0; i < rows; i++) {
    for (var j = 0; j < cols; j++) {
      var center = new Object();
      center.x = j * elem_size + elem_size / 2;
      center.y = i * elem_size + elem_size / 2;
      if (board2[i][j] == 2) {
        context.beginPath();
        context.arc(
          center.x,
          center.y,
          elem_size / 2,
          0.1 * Math.PI + (pacman_direction * Math.PI) / 2,
          1.85 * Math.PI + (pacman_direction * Math.PI) / 2
        ); // half circle
        context.lineTo(center.x, center.y);
        context.fillStyle = pac_color; //color
        context.fill();
        context.beginPath();
        let lowEye =
          pacman_direction == 0
            ? 0
            : pacman_direction == 1
            ? elem_size / 3
            : pacman_direction == 2
            ? 0
            : elem_size / 8;
        let rightEye =
          pacman_direction == 0
            ? 0
            : pacman_direction == 1
            ? elem_size / 6
            : pacman_direction == 2
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
      } else if (board2[i][j] == 1) {
        context.beginPath();
        context.arc(center.x, center.y, elem_size / 4, 0, 2 * Math.PI); // circle
        context.fillStyle = "black"; //color
        context.fill();
      } else if (board2[i][j] == 4) {
        context.beginPath();
        context.rect(
          center.x - elem_size / 2,
          center.y - elem_size / 2,
          elem_size,
          elem_size
        );
        context.fillStyle = "grey"; //color
        context.fill();
      } else if (board2[i][j] == 5) {
        context.beginPath();
        context.rect(
          center.x - elem_size / 2,
          center.y - elem_size / 2,
          elem_size,
          elem_size
        );
        context.fillStyle = "red"; //color
        context.fill();
      } else if (board2[i][j] == 3) {
        context.beginPath();
        context.rect(
          center.x - elem_size / 2,
          center.y - elem_size / 2,
          elem_size,
          elem_size
        );
        context.fillStyle = "pink"; //color
        context.fill();
      }
    }
  }
}

function UpdatePosition() {
  movePlayer();
  moveOthers();

  //i moved on the matrix

  if (check_if_enemy_find()) {
    score -= 10;
    life -= 1;
    console.log("Crash !! " + crash_place);
    if (life == 0) {
      window.clearInterval(interval);
      window.alert("You Fucking Loserrr");
      return;
    } else {
      setPacman();
      setBadMonsters();
    }
  }
  var currentTime = new Date();
  time_elapsed = (currentTime - start_time) / 1000;
  if (score >= 20 && time_elapsed <= 10) {
    pac_color = "green";
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
      board[shape.i][shape.j] = 0;
      crash_place = [enemy_i, enemy_j];
      return true;
    }
  }
  return false;
}
function moveOthers() {
  deepcopy2d();
  movePointMonster();
  moveEnemies();
}

function deepcopy2d() {
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[0].length; col++) {
      board2[row][col] = board[row][col];
    }
  }
}
function movePointMonster() {
  if (count_point_monster > 0) {
    if (shape.i == point_monster[0] && shape.j == point_monster[1]) {
      score += 50;
      count_point_monster--;
      return;
    }
    // for now works only for one
    let moveDecider = Math.random() * 100;
    if (moveDecider > 40) {
      //will move only 40% precent of time to allow pacman to catch him
      let rand = Math.random() * 100;
      if (rand < 25) {
        if (PointMonAbleToGoThere("up", point_monster[0], point_monster[1]))
          point_monster[0] -= 1;
      } else if (rand < 50) {
        if (PointMonAbleToGoThere("right", point_monster[0], point_monster[1]))
          point_monster[1] += 1;
      } else if (rand < 75) {
        if (PointMonAbleToGoThere("down", point_monster[0], point_monster[1]))
          point_monster[0] += 1;
      } else {
        if (PointMonAbleToGoThere("left", point_monster[0], point_monster[1]))
          point_monster[1] -= 1;
      }
    }
    board2[point_monster[0]][point_monster[1]] = 3;
  }
}

function PointMonAbleToGoThere(dir, i, j) {
  switch (dir) {
    case "up":
      if (
        i > 0 &&
        (board2[i - 1][j] == 0 ||
          board2[i - 1][j] == 1 ||
          board2[i - 1][j] == 2)
      )
        return true;
      break;
    case "right":
      if (
        j < cols - 1 &&
        (board2[i][j + 1] == 0 ||
          board2[i][j + 1] == 1 ||
          board2[j + 1][j] == 2)
      )
        return true;
      break;
    case "down":
      if (
        i < rows - 1 &&
        (board2[i + 1][j] == 0 ||
          board2[i + 1][j] == 1 ||
          board2[i + 1][j] == 2)
      )
        return true;
      break;
    case "left":
      if (
        j > 0 &&
        (board2[i][j - 1] == 0 ||
          board2[i][j - 1] == 1 ||
          board2[j - 1][j] == 2)
      )
        return true;
      break;
  }
}

function putWalls(i, j) {
  if (Math.random() < 0.08) {
    board[i][j] = 4;
    return true;
  }
  return false;
}
function gameBoardCreation() {
  cnt = rows * cols;
  total_food = 30;
  food_remain = total_food;
  var pacman_remain = 1;
  for (var i = 0; i < rows; i++) {
    board[i] = new Array();
    board2[i] = new Array();
    //put obstacles in (i=3,j=3) and (i=3,j=4) and (i=3,j=5), (i=6,j=1) and (i=6,j=2)
    for (var j = 0; j < cols; j++) {
      if (!putWalls(i, j)) {
        var randomNum = Math.random();
        if (randomNum <= (1.0 * food_remain) / cnt) {
          food_remain--;
          board[i][j] = 1;
        } else if (
          pacman_remain === 1 &&
          randomNum < (1.0 * (pacman_remain + food_remain)) / cnt
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
  while (food_remain > 0) {
    var emptyCell = findRandomEmptyCell(board);
    board[emptyCell[0]][emptyCell[1]] = 1;
    food_remain--;
  }
  while (pacman_remain > 0) {
    var emptyCell = findRandomEmptyCell(board);
    shape.i = emptyCell[0];
    shape.j = emptyCell[1];
    pacman_remain--;
  }
}
function movePlayer() {
  board[shape.i][shape.j] = 0;
  var x = GetKeyPressed();

  if (x == 1) {
    if (shape.j > 0 && board[shape.i][shape.j - 1] != 4) {
      pacman_direction = 2;
      shape.j--;
    }
  } else if (x == 2) {
    if (shape.i > 0 && board[shape.i - 1][shape.j] != 4) {
      pacman_direction = 3;
      shape.i--;
    }
  } else if (x == 3) {
    pacman_direction = 0;
    if (shape.j < 9 && board[shape.i][shape.j + 1] != 4) {
      shape.j++;
    }
  } else if (x == 4) {
    pacman_direction = 1;
    if (shape.i < 9 && board[shape.i + 1][shape.j] != 4) {
      shape.i++;
    }
  }
  if (board2[shape.i][shape.j] == 1) {
    score++;
  }
  board[shape.i][shape.j] = 2;
}

function updateCenter(dir) {
  switch (dir) {
    case 1:
      center.y += elem_size / 5;
      break;
    case 2:
      break;
    case 3:
      break;
    default:
      break;
  }
}
function setBadMonsters() {
  enemy_positions = {
    0: [0, 0],
    1: [0, cols - 1],
    2: [rows - 1, 0],
    3: [rows - 1, cols - 1],
  };
}
function setPacman() {
  var emptyCell = findRandomEmptyCell(board);
  shape.i = emptyCell[0];
  shape.j = emptyCell[1];
}
