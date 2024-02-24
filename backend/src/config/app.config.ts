import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  MODE: process.env.MODE,
  APP_HOST: process.env.APP_HOST,
  APP_PORT: process.env.APP_PORT,
  API_PREFIX: process.env.API_PREFIX,
  RATE_LIMIT_TIME: process.env.RATE_LIMIT_TIME,
  MAX_RATE_LIMIT: process.env.MAX_RATE_LIMIT,
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
  X_API_KEY: process.env.X_API_KEY,
  TOKEN_LIFE: process.env.TOKEN_LIFE,
}));
