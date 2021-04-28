var dataBase = { k: "k" }; // <username:password>
var input;
var arrowKey = { 37: "left", 38: "up", 39: "right", 40: "down" };
var controls = { left: 37, up: 38, right: 39, down: 40 };
var keyConfigListener;
var username;
var colorJson = {
  green: "green",
  yellow: "yellow",
  purple: "purple",
  blue: "blue",
};
var color1;
var color2;
var color3;

function screenSwitch(divToShow) {
  resetView();
  $(divToShow).show();
  if (divToShow == "#game") {
    Start();
  }
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
  $("#" + keyToConfig + "-config").text("Click on key");
  $("button").prop("disabled", true);
  console.log("Key " + keyToConfig);
  removeEventListener("keydown", keyConfig);
  let keyValue;
  var keyPress = false;
  keyConfigListener = addEventListener("keydown", function (e) {
    if (!keyPress) {
      keyValue = e.keyCode;
      const label = arrowKey[keyValue]
        ? arrowKey[keyValue]
        : String.fromCodePoint(keyValue);
      $("#" + keyToConfig + "-config").text(label);
      console.log("value = " + keyValue);
      controls[keyToConfig] = keyValue;
      $("button").prop("disabled", false);
    }
    keyPress = true;
  });
}
function setWelcome() {
  resetView();
  $("#welcome").show();
}

$(document).ready(function () {
  resetView();
  $("#welcome").show();
  initSelector();
  $("#login-button").click(function () {
    var name = $("#user-name").val();
    var password = $("#password").val();
    if (dataBase[name] == password) {
      screenSwitch("#config");
      username = $("#user-name").val();
      return;
    }
    alert("User Name or Password is incorrect");
  });

  $("#register-button").click(function () {
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
    let ballAmount = $("#food-config").val();
    let monsters = $("#monster-config").val();
    let time = $("#time-config").val();
    color1 = $("#color1-config").val();
    color2 = $("#color2-config").val();
    color3 = $("#color3-config").val();
    let controlsArray = [
      controls["up"],
      controls["right"],
      controls["down"],
      controls["left"],
    ];
    color1 = color1 === "" ? "green" : color1;
    color2 = color2 === "" ? "yellow" : color2;
    color3 = color3 === "" ? "purple" : color3;
    console.log(color1);
    console.log(color2);
    console.log(color3);
    if (time < 60) time = 60;

    //setConfigurations(-array of 4 buttons(start from up)
    // -amount of food 50-90 (int)
    // -balls 3 colors as string example["blue,red green"](array)
    // -time for game minimum 60 (int)
    // );
    setConfigurations(
      controlsArray,
      ballAmount,
      [color1, color2, color3],
      monsters,
      time
    );
    configuresWindowSetter();
    screenSwitch("#game");
    // $("#board").show();
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

function NoPoints(status) {
  if (status) $("#lblscoreleft").addClass("no-score");
  if (!status) $("#lblscoreleft").removeClass("no-score");
}

function musicPlay(status) {
  console.log(status);
  let playingAudio = $("#playingmusic")[0];
  console.log(playingAudio);
  if (status) {
    playingAudio.play();
  } else if (!status) {
    playingAudio.pause();
    playingAudio.currentTime = 0;
  }
}

function configuresWindowSetter() {
  console.log(username);
  $("#username").append(" " + username);
  $("#conf-time").append(" Test");
  $("#conf-balls").append(" Test");
  $("#conf-monsters ").append(" Test");
  $("#conf-5").css("color", color1);
  $("#conf-15").css("color", color2);
  $("#conf-25").css("color", color3);
}
//log
function getRandomColors() {
  let availableColors = ["red", "blue", "green", "white", "purple", "yellow"];
  let colors = [];
  let rands = [];
  while (colors.length < 3) {
    let rand = Math.floor(Math.random() * availableColors.length);
    if (!rands.includes(rand)) {
      colors[colors.length] = availableColors[rand];
      rands[colors.length] = rand;
    }
  }
  color1 = colors[0];
  color1 = colors[1];
  color1 = colors[2];
  return colors;
}

function randomGame() {
  const ballAmount = Math.floor(90 - 50 * Math.random());
  const time = Math.floor(150 - 90 * Math.random());
  const monsters = Math.floor(4 - 3 * Math.random());
  getRandomColors();

  const controlsArray = [
    controls["up"],
    controls["right"],
    controls["down"],
    controls["left"],
  ];
  setConfigurations(
    controlsArray,
    ballAmount,
    [color1, color2, color3],
    monsters,
    time
  );
  configuresWindowSetter();
  screenSwitch("#game");
}
