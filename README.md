# SYSICOMP

## Overview

Esse projeto é a migração do SYSICOMP para a nova stack (nodejs com express e handlebars).

O comportamento do sistema é praticamente o mesmo do [anterior](sys.icomp.ufam.edu.br), porém em uma nova stack.

- Padrão de Projeto: [MVC (Model, View, Controller)](https://pt.wikipedia.org/wiki/MVC)

- Template UI: [AdminLTE 3](https://adminlte.io/themes/v3/)

- Tecnologias:

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

## Desenvolvimento

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


### Rodar a aplicação

#### Para rodar somente através dos containers

```
npm run start:dev
```

Esse comando roda também o container do banco de dados automaticamente por estar definida como dependência do sysicomp no **_docker-compose.yml_**.
Se seu docker e docker-compose estiverem configurados corretamente, o comando deve rodar normalmente, irá demorar um pouco na primeira vez por estar baixando as imagens dos containers.
**Acesse a aplicação na url http://localhost:3001/**

#### Para rodar somente o container do banco de dados e rodar a aplicação diretamente pelo Node

```
npm run start:dev:dbs
npm run start:selecao
```

**Acesse a aplicação na url http://localhost:3000/**

### Rodando as Migrations e Seeds

Para atualizar as tabelas e popular o banco, utilize os seguintes comandos:

```
<!-- npx sequelize db:migrate && sequelize db:seed:all -->
npm prisma:init:dev
```

### Rodando os testes

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
