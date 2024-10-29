import { cleanEnv, num, port, str } from 'envalid';

const validateEnv = () => {
  cleanEnv(process.env, {
    NODE_ENV: str({
      choices: ['development', 'test', 'production'],
      desc: 'Ambiente de execução',
      example: 'development',
    }),

    // Variáveis relacionadas ao Prisma e ao Banco de Dados
    DATABASE_URL: str({
      desc: 'URL de conexão com o banco de dados MySQL',
      example: 'mysql://root:password@db:3306/db?schema=public',
    }),
    MYSQL_PORT: num({
      desc: 'Porta na qual o MySQL está rodando',
      example: '3306',
    }),

    // Variáveis de Sessão e Segurança
    ROUNDS_SALT: num({
      desc: 'Número de rodadas para a geração de salt (usado em hashing de senhas)',
      default: 12,
      example: '12',
    }),
    PORT: port({
      desc: 'Porta na qual a aplicação será executada',
      example: '3000',
    }),

    // Variáveis de Configuração de Envio de Email
    TIME_MILLIS_EXPIRE_EMAIL: num({
      desc: 'Tempo em milissegundos que um link de confirmação de email é válido',
      default: 3600000, // 1 Hora
      example: '3600000',
    }),
    SENDGRID_API_KEY: str({
      desc: 'Chave de API para integração com o SendGrid',
      example: 'SG.xxxxxxxx.yyyyyyyy',
    }),
    SENDGRID_EMAIL_SEND: str({
      desc: 'Endereço de email que será usado para enviar mensagens através do SendGrid',
      example: 'no-reply@seusite.com',
    }),

    // Variáveis Opcionais (Descomentadas se necessário)
    MYSQL_ROOT_PASSWORD: str({
      desc: 'Senha do usuário root do MySQL',
      default: '',
      devDefault: 'password', // Apenas para desenvolvimento, se necessário
    }),
    MYSQL_DATABASE: str({
      desc: 'Nome do banco de dados que a aplicação irá utilizar',
      default: '',
      devDefault: 'store', // Apenas para desenvolvimento, se necessário
    }),
  });
};

export default validateEnv;
