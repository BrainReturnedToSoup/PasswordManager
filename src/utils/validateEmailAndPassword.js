const { check, validationResult } = require("express-validator");

function validateEmailAndPassword(req) {
  check("email").notEmpty().isEmail().withMessage("email").run(req);

  check("password")
    .notEmpty()
    .isLength({ min: 12 })
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
    )
    .withMessage("password")
    .run(req);

  if (req.body.confirmPassword) {
    //only if the field exists in the form submission
    check("confirm-password")
      .notEmpty()
      .isLength({ min: 12 })
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
      )
      .custom((value, { req }) => {
        return value !== req.body.password;
        //a custom validation method that makes sure that
        //the confirm password field matches the password field
      })
      .withMessage("confirm-password")
      .run(req);
  }

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return { type: "error", errors: errors };
  } else {
    return { type: "valid" };
  }
}

module.exports = validateEmailAndPassword;
