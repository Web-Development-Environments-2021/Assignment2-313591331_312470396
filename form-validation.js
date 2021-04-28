$(document).ready(function () {
  // Initialize form validation on the registration form.
  // It has the name attribute "registration"
  $("form[name='registration']").validate({
    // Specify validation rules
    rules: {
      // The key name on the left side is the name attribute
      // of an input field. Validation rules are defined
      // on the right side
      full_name: { required: true },
      email: {
        required: true,
        email: true,
      },
      birth_date: {
        required: true,
        dpDate: true,
      },
      user_name: { required: true },
      password: {
        required: true,
        eden_reg: true,
      },
    },
    messages: {
      full_name: "Hell Yeah",
      password: {
        required: "Please provide a password",
        minlength: "Your password must be at least 6 characters long",
        eden_reg: "Go Home",
      },
      email: "Please enter a valid email address",
    },

    // Make sure the form is submitted to the destination defined
    // in the "action" attribute of the form when valid
    submitHandler: function (form) {
      form.submit();
    },
  });
});

$.validator.addMethod(
  "eden_reg",
  function (value, element) {
    console.log(value);
    let regExName = /^(?=\D*\d)[^ ]{6,}$/;
    console.log(regExName.test(value));
    return regExName.test(value);
  },
  "There are non alphabetic characters!"
);
