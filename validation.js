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
