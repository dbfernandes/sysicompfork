import { cleanEnv, num, port, str, bool } from 'envalid';

const validateEnv = () => {
  cleanEnv(process.env, {
    NODE_ENV: str({
      choices: ['development', 'test', 'production'],
      desc: 'Ambiente de execução',
      example: 'development',
    }),

    // ==============================
    // Banco de Dados (Prisma/MySQL)
    // ==============================
    DATABASE_URL: str({
      desc: 'URL de conexão com o banco de dados MySQL',
      example: 'mysql://root:password@db:3306/db',
    }),
    MYSQL_PORT: num({
      desc: 'Porta na qual o MySQL está rodando',
      example: '3306',
    }),
    MYSQL_USER: str({
      desc: 'Usuário do MySQL utilizado pela aplicação',
      example: 'root',
    }),
    MYSQL_PASSWORD: str({
      desc: 'Senha do usuário do MySQL',
      example: 'secret',
    }),
    MYSQL_ROOT_PASSWORD: str({
      desc: 'Senha do usuário root do MySQL',
      default: '',
      devDefault: 'password',
    }),
    MYSQL_DATABASE: str({
      desc: 'Nome do banco de dados que a aplicação irá utilizar',
      default: '',
      devDefault: 'store',
    }),

    // ==============================
    // Banco de Dados (Redis)
    // ==============================
    REDIS_HOST: str({
      desc: 'Host do servidor Redis',
      default: 'redis', // nome do serviço no docker-compose
      example: 'redis',
    }),
    REDIS_PORT: num({
      desc: 'Porta do servidor Redis',
      default: 6379,
      example: '6379',
    }),

    // ==============================
    // Sessão e Segurança
    // ==============================
    SESSION_SECRET: str({
      desc: 'Segredo usado para assinar sessões ou JWT',
      example: 'uma_chave_segura',
    }),
    ROUNDS_SALT: num({
      desc: 'Número de rodadas para geração de salt (hash de senha)',
      default: 12,
      example: '12',
    }),

    // ==============================
    // Configuração de Servidores
    // ==============================
    PORT: port({
      desc: 'Porta principal da aplicação',
      example: '3000',
    }),
    // OPCIONAL: só será usado se você subir o app "selecao"
    PORT_SELECAO: port({
      desc: 'Porta da aplicação de seleção (se aplicável)',
      default: 3001, // torna opcional
      example: '3001',
    }),
    // OPCIONAL: só será usado se você integrar o Gotenberg
    PORT_GOTENBERG: port({
      desc: 'Porta para forward local do Gotenberg (se aplicável)',
      default: 3002, // torna opcional
      example: '3002',
    }),
    GOTENBERG_ENDPOINT: str({
      desc: 'Endpoint do Gotenberg (ex.: http://gotenberg:3000). Vazio = desabilitado.',
      default: '', // torna opcional
      example: 'http://gotenberg:3000',
    }),

    // ==============================
    // Regras de Negócio / Expiração
    // ==============================
    TIME_MILLIS_EXPIRE_EMAIL: num({
      desc: 'Tempo (ms) de expiração para links de confirmação de email',
      default: 3600000, // 1h
      example: '3600000',
    }),

    // ==============================
    // Configuração de E-mail (SMTP)
    // ==============================
    MAIL_HOST: str({
      desc: 'Host do servidor SMTP',
      example: 'smtp.zoho.com',
    }),
    MAIL_PORT: num({
      desc: 'Porta do servidor SMTP (465/587)',
      example: '465',
    }),
    MAIL_SECURE: bool({
      desc: 'Define se a conexão SMTP é segura (SSL/TLS)',
      example: 'true',
    }),
    MAIL_USER: str({
      desc: 'Usuário da conta de e-mail (geralmente o próprio e-mail)',
      example: 'no-reply@seusite.com',
    }),
    MAIL_PASS: str({
      desc: 'Senha da conta de e-mail (ou app password)',
      example: 'senha123',
    }),
    MAIL_FROM: str({
      desc: 'Endereço que aparecerá como remetente',
      example: '"Seu App" <no-reply@seusite.com>',
    }),
  });
};

export default validateEnv;
