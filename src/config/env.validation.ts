import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  PORT: Joi.number().default(3000),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_DATABASE: Joi.string().required(),
});

export type EnvironmentVariables = {
  PORT: number;
  DB_HOST: string;
  DB_PORT: number;
  DB_USERNAME: string;
  DB_PASSWORD: string;
  DB_DATABASE: string;
};

export function validateEnv(
  config: Record<string, unknown>,
): EnvironmentVariables {
  const { error, value } = envValidationSchema.validate(config, {
    abortEarly: false,
    convert: true,
  });

  if (error) {
    throw new Error(`Config validation error: ${error.message}`);
  }

  return value;
}
