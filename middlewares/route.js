const { ValidationError } = require("../lib/errors");
/**
 * validate req.body against a joi schema. Mutates req.body with the result of the
 * validation to pick up default values
 */
const validateBody = (schema, options = {}) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, options);
    if (error) {
      next(new ValidationError(error.details[0].message));
      return;
    }
    req.body = value;
    next();
  };
};
const validateParams = (schema, options = {}) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.params, options);
    if (error) {
      next(new ValidationError(error.details[0].message));
      return;
    }
    req.params = value;
    next();
  };
};

module.exports = {
  validateBody,
  validateParams,
};
