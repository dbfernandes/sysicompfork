import dotenv from 'dotenv';
import app from './app';
import validateEnv from './utils/validateEnv';

dotenv.config({
  path: `.env.${process.env.NODE_ENV || 'development'}`,
});

validateEnv();

const port = process.env.PORT || 3000;

const server = app.listen(Number(port), '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
  console.log(`http://localhost:${port}/`);
});

export default server;
