// test/environment/PrismaTestEnvironment.ts
import type { Config } from '@jest/types';
import type { EnvironmentContext, JestEnvironmentConfig } from '@jest/environment';
import { exec } from 'node:child_process';
import dotenv from 'dotenv';
import NodeEnvironment from 'jest-environment-node';
import mysql from 'mysql2/promise';
import util from 'node:util';
import crypto from 'node:crypto';
import path from 'node:path';

// Carrega as variáveis de ambiente do arquivo .env.testing
dotenv.config({ path: '.env.test' });

const execSync = util.promisify(exec);

// Caminho para o binário do Prisma
// const prismaBinary = './node_modules/.bin/prisma';
const prismaBinary = path.join(process.cwd(), 'node_modules', '.bin', 'prisma');

export default class PrismaTestEnvironment extends NodeEnvironment {
  private databaseName: string;
  private connectionString: string;

  constructor(config: JestEnvironmentConfig, context: EnvironmentContext) {
    super(config, context);

    const dbUser = process.env.DATABASE_USER;
    const dbPass = process.env.DATABASE_PASS;
    const dbHost = process.env.DATABASE_HOST;
    const dbPort = process.env.DATABASE_PORT;

    // Gera um nome único para o banco de dados de teste
    this.databaseName = `test_${crypto.randomUUID()}`;
    console.log('this.databaseName', `mysql://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${this.databaseName}`);
    this.connectionString = `mysql://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${this.databaseName}`;
  }

  async setup() {
    // Conecta-se ao MySQL sem especificar um banco de dados para criar o banco de dados de teste
    const rootConnection = await mysql.createConnection({
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASS,
      multipleStatements: true,
    })

    // Cria o banco de dados de teste
    await rootConnection.query(`CREATE DATABASE \`${this.databaseName}\`;`);
    await rootConnection.end();

    // Atualiza a variável de ambiente DATABASE_URL para o banco de dados de teste
    process.env.DATABASE_URL = this.connectionString;
    this.global.process.env.DATABASE_URL = this.connectionString;

    // Executa as migrações do Prisma no banco de dados de teste
    await execSync(`${prismaBinary} migrate deploy`);
    console.log('DATABASE_URL:', process.env.DATABASE_URL);
    return super.setup();
  }

  async teardown() {
    // Conecta-se ao MySQL sem especificar um banco de dados para dropar o banco de dados de teste
    const rootConnection = await mysql.createConnection({
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASS,
      multipleStatements: true,
    });
    // Droppa o banco de dados de teste
    await rootConnection.query(`DROP DATABASE IF EXISTS \`${this.databaseName}\`;`);
    await rootConnection.end();

    return super.teardown();
  }
}
