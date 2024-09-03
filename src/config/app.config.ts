export const AppConfig = () => ({
  environment: process.env.NODE_ENV || 'dev',
  databaseUrl: process.env.DATABASE_URL,
  databaseName: process.env.DATABASE_NAME,
  port: process.env.PORT,
  defaultLimit: +process.env.DEFAULT_LIMIT,
});
