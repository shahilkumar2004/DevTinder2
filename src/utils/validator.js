const validator = require("validator");

const isValidatingSignUp = (req) => {
  const { firstName, lastName, password, email, age, skills } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Enter first and last name");
  }

  if (firstName.length > 30 || lastName.length > 30) {
    throw new Error("First name and last name cannot exceed 30 characters");
  }

  if (!validator.isEmail(email)) {
    throw new Error("Enter a valid email");
  }

  if (!validator.isStrongPassword(password)) {
    throw new Error("Enter a strong password");
  }

  if (age < 18 || age > 100) {
    throw new Error("Age must be between 18 and 100");
  }

  if (skills && skills.length > 10) {
    throw new Error("Maximum 10 skills allowed");
  }

  return true;
};

const isValidatinglogin = (req) => {
  const { email, password } = req.body;

  if (!validator.isEmail(email)) {
    throw new Error("Enter a valid email");
  }

  if (!password) {
    throw new Error("Password is required");
  }
};

module.exports = {
  isValidatingSignUp,
  isValidatinglogin,
};
