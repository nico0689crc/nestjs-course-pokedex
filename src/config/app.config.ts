export const AppConfig = () => ({
  environment: process.env.NODE_ENV || 'dev',
  mongodb: process.env.MONGODB,
  mongodbName: process.env.MONGODB_NAME,
  port: process.env.PORT,
  defaultLimit: +process.env.DEFAULT_LIMIT,
});
