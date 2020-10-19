const isEmail = require("validator/lib/isEmail");

module.exports.validateRegisterInput = ({ username, email }) => {
  const errors = {};
  if (username.trim() === "") errors.username = "username must not be empty";
  if (email.trim() === "") {
    errors.email = "email must not be empty";
  } else {
    if (!isEmail(email)) {
      errors.email = "Not a valid email address";
    }
  }
  return {
    errors,
    isValid: Object.keys(errors).length < 1,
  };
};

module.exports.validateLoginInput = ({ email, password }) => {
  const errors = {};
  if (password.trim() === "") errors.password = "password must not be empty";
  if (email.trim() === "") {
    errors.email = "email must not be empty";
  } else {
    if (!isEmail(email)) {
      errors.email = "Not a valid email address";
    }
  }
  return {
    errors,
    isValid: Object.keys(errors).length < 1,
  };
};
