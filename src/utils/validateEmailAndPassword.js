const { check, validationResult } = require("express-validator");

function validateEmailAndPassword(req) {
  check("email").notEmpty().isEmail().withMessage("email").run(req);

  check("password")
    .notEmpty()
    .isLength({ min: 12, max: 20 })
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
    )
    .withMessage("password");

  //only if the field exists in the form submission

  if (req.body.confirmPassword) {
    check("confirmPassword")
      .notEmpty()
      .isLength({ min: 12, max: 20 })
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
      )
      .custom((value, { req }) => {
        return value !== req.body.password;
        //a custom validation method that makes sure that
        //the confirm password field matches the password field
      })
      .withMessage("confirm-password");
  }

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return "error";
  } else {
    return "valid";
  }
}

module.exports = validateEmailAndPassword;
