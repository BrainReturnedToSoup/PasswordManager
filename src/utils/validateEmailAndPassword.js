const { check, validationResult } = require("express-validator");
const VALIDATION_RESPONSE = require("../enums/validateEmailAndPassEnums");

function validateEmailAndPassword(req) {
  check("email").notEmpty().isEmail().withMessage("email").run(req);

  check("password")
    .notEmpty()
    .isLength({ min: 12, max: 20 })
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
    )
    .withMessage("password")
    .run(req);

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
      .withMessage("confirm-password")
      .run(req);
  }

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return VALIDATION_RESPONSE.ERROR;
  } else {
    return VALIDATION_RESPONSE.VALID;
  }
}

module.exports = validateEmailAndPassword;
