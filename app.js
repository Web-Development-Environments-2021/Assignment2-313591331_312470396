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
var dataBase = {'k':'k'} // <username:password>
var input;
var arrowKey = {"37":"left","38":"up","39":"right","40":"down"}
var controls = {"left":37,"up":38,"right":39,"down":40}
var keyConfigListener; 
var colorJson = {"green":"green","yellow":"yellow","purple":"purple","blue":"blue"}

function screenSwitch(divToShow) {
	resetView()
	$(divToShow).show();
  $("#board").hide();
}

function about(){
  console.log("ABOUT");
  $("#dialog").dialog("open")
}

function resetView(){
	$("#game").hide();
	$("#register").hide();
	$("#login").hide();
  $("#welcome").hide();
  $("#config").hide();
}

function validatePassword(password){
  let alertMsg=""
  password.length>5? alertMsg+="" : alertMsg += "Password must contain more than 5 Characters.\n"
  password.match(/[A-z]/)? alertMsg+="": alertMsg += "Password must have at least one Character.\n";
  password.match(/\d/)? alertMsg +="" : alertMsg+= "Password must have at least one Number.\n"
  return alertMsg;
}

function validateName(name){
  let alertMsg="";
  name.match(/\d/)? alertMsg+= "First and Last Name can't contain numbers.\n":alertMsg+=""
  return alertMsg;
}

function validateEmail(email){
  let alertMsg = ""
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  re.test(String(email).toLowerCase())? alertMsg+="" : alertMsg += "Must enter a Valid Email.\n"
  return alertMsg;
}

function emptyInput(){
  let alertMsg=""
  if($("#full-name").val() && $("#email").val() && 
  $("#birth-date").val() && $("#user-name-reg").val() && 
  $("#password-reg").val()) {alertMsg+=""}
  else{alertMsg+= "All fields must be field.\n"}
  return alertMsg;
}

function initSelector(){
  
  for (var i=40;i<91;i++){
    $("#food-config").append("<option value="+i+">"+i+"</option>")
  }
  
  for (var key in colorJson){
    $(".color-input").append("<option value="+colorJson[key]+">"+key+"</option>")
  }
}

function keyConfig(keyToConfig) {
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
        $("#"+keyToConfig+"-lbl").text(label);        
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
  context = canvas.getContext("2d");
  Start();

  $("#login-button").click(function(){
    console.log("Login!")
    var name = $("#user-name").val();
    var password = $("#password").val();
    if (dataBase[name] == password){
      screenSwitch("#game")
      return
    }
    alert("User Name or Password is incorrect")
  })

  $("#register-button").click(function(){
    console.log("Register!")
    var alertMsg = ""
    var input= ""
    alertMsg += emptyInput();
    input = $("#password-reg").val();
    alertMsg+=validatePassword(input);
    input = $("#full-name").val();
    alertMsg+=validateName(input);
    input = $("#email").val();
    alertMsg+=validateEmail(input);
    if (alertMsg != ""){
      alert(alertMsg);
      return;
    }
    dataBase[$("#user-name-reg").val()] = $("#password-reg").val();
    alert("User Created")
    resetView();
  })

  $("#start-btn").click(function(){
    var alertMsg = "";
    var input = "";
    $("#config").hide();
    $("#board").show();

    })

  $("#dialog").dialog({
    height:300,
    width:500,
    autoOpen: false,
    modal: true,
    open: function(){
        $('.ui-widget-overlay').bind('click',function(){
            $('#dialog').dialog('close');
        })
    }
});

  $('select').change(function() {
    var otherSelects = $('select').not(this);
    var oldValue = $(this).data('old');
    if (oldValue)
      otherSelects.find('option[value=' + oldValue + ']').removeAttr('disabled');
    if (this.value)
      otherSelects.find('option[value=' + this.value + ']').attr('disabled', 'disabled');
    $(this).data('old', this.value);
  });

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
      }
    }
  }
}

function UpdatePosition() {
  board[shape.i][shape.j] = 0;
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
  if (score == total_food) {
    window.clearInterval(interval);
    window.alert("Game completed");
  } else {
    Draw();
  }
}
