# SYSICOMP

## 📌 Visão Geral

Esse projeto é a migração do SYSICOMP para a nova stack (nodejs com express e handlebars).

O comportamento do sistema é praticamente o mesmo do [anterior](sys.icomp.ufam.edu.br), porém em uma nova stack.

- Padrão de Projeto: [MVC (Model, View, Controller)](https://pt.wikipedia.org/wiki/MVC)

- Template UI: [AdminLTE 3](https://adminlte.io/themes/v3/)

- 🚀 Tecnologias Utilizadas

  - [NodeJs](https://nodejs.org/pt-br/) - Javascript no backend

  - [TypeScript](https://www.typescriptlang.org/) - Superset do Javascript que adiciona tipagem estática e outros recursos

  - [Npm](https://www.npmjs.com/) - Gerenciador de dependencias, baixar bibliotecas e gerenciar suas versões

  - [Express](https://expressjs.com/pt-br/) - Framework de aplicação para facilitar a criação de um sistema e não reinventar a roda

  - [Handlebars](https://handlebarsjs.com/) - Uma linguagem de template para faiclitar a criação da UI

  - [Joi](https://joi.dev/) - Validação de dados

  - [Docker](https://docs.docker.com/) - Containers para "empacotar" as aplicações, facilitar o desenvolvimento em equipe e torná-la mais robusta

  - [Docker Compose](https://docs.docker.com/compose/) - Gerenciamento de vários containers

  - [MySQL](https://www.mysql.com/) - Banco de Dados (OBS: O mysql fica num container docker, não se preocupe em instalá-lo)

  - [Redis](https://redis.io/) - Banco de dados em memória, utilizado para cache e gerenciamento de sessões (OBS: O redis fica num container docker, não se preocupe em instalá-lo)

  - [Prisma](https://www.prisma.io/) - ORM (Object Relational Mapper / Mapeamento Objeto Relacional) é a ferramenta mais moderna para atividades de conexão e gerenciamento do banco de dados, oferecendo uma API (Aplication Programming Interface) intuitiva e recursos como migrações de banco de dados, consultas tipadas e um modelo de dados declarativo.

## 🛠️ Desenvolvimento

### Requisitos

#### NodeJs (>=14.15.3)

Tenha o NodeJs instalado preferencialmente na versão 14.15.3 para frente. Recomendo utilizar o NVM (Node Version Manager) que lhe permite gerenciar várias versões ao mesmo tempo, podendo migrar entre as mesmas como quiser.

- [Instalação](https://github.com/nvm-sh/nvm#installing-and-updating)

#### Docker e Docker Compose

- [Instalar Docker](https://docs.docker.com/engine/install/)
- [Instalar Docker Compose](https://docs.docker.com/compose/install/)

#### Clone Git Repository

```
git clone https://github.com/dbfernandes/sysicomp
```

#### Arquivo .env
Crie um arquivo `.env` na raiz do projeto, você pode copiar o arquivo `.env.example` e renomeá-lo para `.env`.
Lembre-se de configurar as variáveis de ambiente conforme sua necessidade.
```
cp .env.example .env
```

### ▶️ Como Rodar a Aplicação

### Executando apenas via containers

```
npm run start:dev
```

Esse comando roda também o container do banco de dados automaticamente por estar definida como dependência do sysicomp no **_docker-compose.yml_**.
Se seu docker e docker-compose estiverem configurados corretamente, o comando deve rodar normalmente, irá demorar um pouco na primeira vez por estar baixando as imagens dos containers.
**Acesse a aplicação na url http://localhost:3301/**

##### Configurando o banco de dados
Se for a primeira vez que está rodando o sistema, é necessário criar o banco de dados e popular as tabelas.
Para isso entre no container do banco de dados com o comando abaixo:

```
docker exec -it sysicomp-dev sh
```

E então rode o comando de migration e seed:

```
npm run prisma:init:dev
```

### Executando localmente (DB em containers)
Primeiro suba os containers do banco de dados com o comando abaixo:
```
npm run start:dev:dbs
```
Agora rode a aplicação localmente com o comando abaixo:
```
npm run start:syscomp
```


**Acesse a aplicação na url http://localhost:3300/**

##### Configurando o banco de dados

Para isso basta rodar o comando de migration e seed:

```
npm run prisma:init:dev
```

### ⛃ Acessando o banco de dados
Você pode usar qualquer cliente MySQL, como:

MySQL Workbench: https://www.mysql.com/products/workbench/

DBeaver: https://dbeaver.io/

Ou usar o phpMyAdmin, já incluído no docker:
Acesse em: http://localhost:8080

### Configurando o prettier e o eslint no VSCode
Recomendo instalar as extensões do prettier e do eslint no VSCode, e configurar o prettier como formatador padrão.
- [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Configuração do Prettier no VSCode](https://prettier.io/docs/en/editors.html#visual-studio-code)
- [Configuração do ESLint no VSCode](https://eslint.org/docs/latest/user-guide/integrations/editor/vscode)

### 🧪 Rodando os testes

#### Rodando os testes unitários

Para rodar os testes unitários, utilize o comando abaixo:

```
npm test
```

Eles não precisam de um banco de dados rodando, pois utilizam o [jest](https://jestjs.io/pt-BR/).

#### Rodando os testes de integração

Para rodar os testes de integração, primeiro é necessário subir o banco de dados com o comando abaixo:

```
docker compose up -f docker-compose.test.yml -d up
```

E então rodar os testes de integração com o comando abaixo:

```
npm run test:integration
```

Eles utilizam o [jest](https://jestjs.io/pt-BR/) e o [supertest](https://www.npmjs.com/package/supertest) para fazer as requisições HTTP.

