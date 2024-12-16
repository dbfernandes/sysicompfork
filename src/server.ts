import dotenv from 'dotenv';
import app from './app';
import validateEnv from './utils/validateEnv';

dotenv.config({
  path: `.env.${process.env.NODE_ENV || 'development'}`,
});

console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
validateEnv();

const port = process.env.PORT || 3000;
// const port = env.PORTS || 3000;

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`http://localhost:${port}/`);
});

export default server;
