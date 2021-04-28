var errors = "";
$(document).ready(function () {
  let a = $("form[name='registration']");
  console.log(a);
  $("form[name='registration']").validate({
    rules: {
      full_name: { required: true, eden_no_num: true },
      email: {
        required: true,
        email: true,
      },
      birth_date: {
        required: true,
        myDate: true,
      },
      user_name: { required: true },
      password: {
        required: true,
        eden_char: true,
        eden_num: true,
        eden_len: true,
      },
    },
    messages: {
      full_name: { required: "Full Name must be filled" },
      email: "Please enter a valid email address",
      birth_date: {
        required: "Birth date must be filled",
      },
      user_name: {
        required:
          "Username must be filled. Watch out, this is your login id ! ",
      },
      password: {
        required: "Please provide a password",
      },
    },
    submitHandler: function (form) {
      form.submit();
    },
    errorElement: "div",
    errorPlacement: function (error, element) {
      error.appendTo($("#errorsText"));
    },
  });
});

$.validator.addMethod(
  "eden_char",
  function (value, element) {
    let reg = new RegExp("[a-zA-Z]+");
    let a = reg.test(value);
    return reg.test(value);
  },
  "Password must be with at least 1 char."
);

$.validator.addMethod(
  "eden_num",
  function (value, element) {
    let reg = new RegExp("[0-9]+");
    let a = reg.test(value);
    return reg.test(value);
  },
  "Password must be with at least 1 num(0-9)"
);
$.validator.addMethod(
  "eden_len",
  function (value, element) {
    if (value.length < 6) return false;
    return true;
  },
  "Password must be length 6"
);
$.validator.addMethod(
  "eden_no_num",
  function (value, element) {
    var regex = /\d/g;
    let a = regex.test(!value);
    return !regex.test(value);
  },
  "full name must be without numbers ! "
);

function test() {
  console.log("Works");
}

$.validator.addMethod(
  "myDate",
  function (value, element) {
    console.log(value);
    if (value.substring(0, 4) <= "1900" || value.substring(0, 4) >= "2022")
      return false;
    if (value.substring(5, 7) <= "0" || value.substring(5, 7) >= "13")
      return false;
    if (value.substring(8, 10) <= "0" || value.substring(8, 10) >= "32")
      return false;
    console.log(true);
    return true;
  },
  "Please enter a correct Date Year (1900-2021)"
);
