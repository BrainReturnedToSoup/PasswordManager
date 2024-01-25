const Joi = require("joi");

function validateEmailVal(email) {
  const emailSchema = Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required();

  const validationResult = emailSchema.validate(email);

  return validationResult.error !== null;
}

function validatePasswordVal(password) {
  const passwordSchema = Joi.string()
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{12,20}$"
      )
    )
    .required();

  const validationResult = passwordSchema.validate(password);

  return validationResult.error !== null;
}

function validateSettingsObj(preferencesObj) {
  const preferencesSchema = Joi.object({
    fontScale: Joi.number().min(1).max(3).required(),
    themeSelected: Joi.number().min(1).max(3).required(),
    lazyLoading: Joi.boolean().required(),
    sessionLengthMinutes: Joi.number().valid(5, 10, 15, 30).required(),
  });

  const validationResult = preferencesSchema.validate(preferencesObj);

  return validationResult.error !== null;
}

module.exports = { validateEmailVal, validatePasswordVal, validateSettingsObj };
