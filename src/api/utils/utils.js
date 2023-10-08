const Joi = require("joi");

exports.createUserValidationSchema = Joi.object({
  username: Joi.string().alphanum().min(4).max(20).required(),

  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{6,30}$")).required(),

  email: Joi.string().email().required(),
});

exports.updateUserValidationSchema = Joi.object({
  username: Joi.string().alphanum().min(4).max(20),

  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{6,30}$")),

  email: Joi.string().email(),
});
