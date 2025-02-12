import { exec } from 'node:child_process';
import dotenv from 'dotenv';
import NodeEnvironment from 'jest-environment-node';
import mysql from 'mysql2/promise';
import util from 'node:util';
import crypto from 'node:crypto';
import path from 'node:path';
import os from 'node:os';
import type {
  EnvironmentContext,
  JestEnvironmentConfig,
} from '@jest/environment';

// Carrega as variáveis de ambiente do arquivo .env.testing
dotenv.config({ path: '.env.test' });
const execSync = util.promisify(exec);

// Caminho para o binário do Prisma (adiciona compatibilidade com Windows)
const prismaBinary =
  os.platform() === 'win32'
    ? path.join('.', 'node_modules', '.bin', 'prisma.cmd')
    : path.join('.', 'node_modules', '.bin', 'prisma');

export default class PrismaTestEnvironment extends NodeEnvironment {
  private readonly databaseName: string;
  private readonly connectionString: string;

  constructor(config: JestEnvironmentConfig, context: EnvironmentContext) {
    try {
      super(config, context);

      // Validação das variáveis de ambiente
      const requiredEnvVars = {
        DATABASE_USER: process.env.DATABASE_USER,
        DATABASE_PASS: process.env.DATABASE_PASS,
        DATABASE_HOST: process.env.DATABASE_HOST,
        DATABASE_PORT: process.env.DATABASE_PORT,
      };

      const missingVars = Object.entries(requiredEnvVars)
        .filter(([, value]) => !value)
        .map(([key]) => key);

      if (missingVars.length > 0) {
        throw new Error(
          `Variáveis de ambiente ausentes: ${missingVars.join(', ')}`,
        );
      }

      this.databaseName = `test_${crypto.randomUUID()}`;
      this.connectionString = `mysql://${requiredEnvVars.DATABASE_USER}:${
        requiredEnvVars.DATABASE_PASS
      }@${requiredEnvVars.DATABASE_HOST}:${requiredEnvVars.DATABASE_PORT}/${
        this.databaseName
      }`;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new Error(
        `Falha ao inicializar ambiente de teste: ${errorMessage}`,
      );
    }
  }

  async setup() {
    let rootConnection: mysql.Connection | null = null;

    try {
      // Conecta-se ao MySQL
      rootConnection = await mysql.createConnection({
        host: process.env.DATABASE_HOST,
        port: Number(process.env.DATABASE_PORT),
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASS,
        multipleStatements: true,
      });

      // Cria o banco de dados de teste
      await rootConnection.query(
        `CREATE DATABASE IF NOT EXISTS \`${this.databaseName}\`;`,
      );

      // Atualiza a variável de ambiente DATABASE_URL
      process.env.DATABASE_URL = this.connectionString;
      this.global.process.env.DATABASE_URL = this.connectionString;

      // Executa as migrações e seeds do Prisma
      await Promise.all([
        execSync(`${prismaBinary} migrate deploy`),
        execSync(`${prismaBinary} db seed`),
      ]).catch((error) => {
        throw new Error(
          `Falha ao executar migrações ou seeds: ${error.message}`,
        );
      });

      return super.setup();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error('Erro durante setup:', errorMessage);

      // Tenta limpar o banco em caso de erro
      if (this.databaseName) {
        await this.teardown().catch(console.error);
      }

      throw error;
    } finally {
      if (rootConnection) {
        await rootConnection.end().catch(console.error);
      }
    }
  }

  async teardown() {
    let rootConnection: mysql.Connection | null = null;

    try {
      rootConnection = await mysql.createConnection({
        host: process.env.DATABASE_HOST,
        port: Number(process.env.DATABASE_PORT),
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASS,
        multipleStatements: true,
      });

      await rootConnection.query(
        `DROP DATABASE IF EXISTS \`${this.databaseName}\`;`,
      );

      return super.teardown();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error('Erro durante teardown:', errorMessage);
      throw error;
    } finally {
      if (rootConnection) {
        await rootConnection.end().catch(console.error);
      }
    }
  }
}
