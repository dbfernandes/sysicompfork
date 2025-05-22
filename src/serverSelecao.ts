import dotenv from 'dotenv';
import app from './appSelecao';
import validateEnv from './utils/validateEnv';

dotenv.config({
  path: `.env.${process.env.NODE_ENV || 'development'}`,
});

validateEnv();

const port = process.env.PORT_SELECAO || 3001;

const server = app.listen(port, () => {
  console.log(`Server seleção is running on port ${port}`);
  console.log(`http://localhost:${port}/`);
});

export default server;
