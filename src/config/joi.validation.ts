import * as Joi from 'joi';

export const JoiValidationSchema = Joi.object({
  DATABASE_URL: Joi.required(),
  DATABASE_NAME: Joi.required(),
  PORT: Joi.number().default(3005),
  DEFAULT_LIMIT: Joi.number().default(10),
});
