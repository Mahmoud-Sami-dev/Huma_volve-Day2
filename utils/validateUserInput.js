const validator = require("validator");

function validateRegisterInput({ name, email, password }) {
  const errors = [];

  if (!name || typeof name !== "string" || name.trim().length < 2) {
    errors.push("Name must be at least 2 characters long");
  }

  if (!email || !validator.isEmail(email)) {
    errors.push("Please provide a valid email address");
  }

  if (
    !password ||
    !validator.isStrongPassword(password, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
  ) {
    errors.push(
      "Password must be at least 8 characters and include uppercase, lowercase, a number, and a symbol"
    );
  }

  return errors;
}

module.exports = { validateRegisterInput };
