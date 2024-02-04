const Joi = require("joi");

function validateEmailVal(email) {
  const schema = Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required();

  const validationResult = schema.validate(email);

  return validationResult.error !== null;
}

function validatePasswordVal(password) {
  const schema = Joi.string()
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{12,20}$"
      )
    )
    .required();

  const validationResult = schema.validate(password);

  return validationResult.error !== null;
}

function validateSettingsObj(preferencesObj) {
  const schema = Joi.object({
    fontScale: Joi.number().min(1).max(3).required(),
    themeSelected: Joi.number().min(1).max(3).required(),
    lazyLoading: Joi.boolean().required(),
    sessionLengthMinutes: Joi.number().valid(5, 10, 15, 30).required(),
  });

  const validationResult = schema.validate(preferencesObj);

  return validationResult.error !== null;
}

const inputValidation = {
  addCredential: (body) => {
    const schema = Joi.object({
      name: Joi.string().length(30).required(),
      emailUsername: Joi.string().length(40),
      password: Joi.string().length(60).required(),
      description: Joi.string().length(80),
    });

    const validationResult = schema.validate(body);

    return validationResult.error !== null;
  },
  deleteCredential: (body) => {
    const schema = Joi.string().length(36).required();

    const validationResult = schema.validate(body.credentialID);

    return validationResult.error !== null;
  },
  getCredential: (body) => {
    const schema = Joi.string().length(36).required();

    const validationResult = schema.validate(body.credentialID);

    return validationResult.error !== null;
  },
  updateCredential: (body) => {
    //validates based on the existence of properties, since
    //only the properties included in the body that match this schema will
    //be updated. Basically, there is flexibility to what you want to update.
    const schema = Joi.object({
      name: Joi.string().length(30),
      emailUsername: Joi.string().length(40),
      password: Joi.string().length(60),
      description: Joi.string().length(80),
    });

    const validationResult = schema.validate(body);

    return validationResult.error !== null;
  },
};

module.exports = {
  validateEmailVal,
  validatePasswordVal,
  validateSettingsObj,
  inputValidation,
};
