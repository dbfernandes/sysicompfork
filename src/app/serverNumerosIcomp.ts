import dotenv from 'dotenv';
import app from './appNumerosIcomp';
import validateEnv from '@utils/validateEnv';

dotenv.config({
  path: `.env.${process.env.NODE_ENV || 'development'}`,
});

validateEnv();

const port = process.env.PORT_NUMEROS_ICOMP || 3003;

const server = app.listen(Number(port), '0.0.0.0', () => {
  console.log(`Server números Icomp is running on port ${port}`);
  console.log(`http://localhost:${port}/`);
});

export default server;
