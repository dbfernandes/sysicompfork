
# SYSICOMP

  

## Overview

  

Esse projeto é a migração do SYSICOMP para a nova stack (nodejs com express e handlebars).

  

O comportamento do sistema é praticamente o mesmo do [anterior](sys.icomp.ufam.edu.br), porém em uma nova stack.

  

- Padrão de Projeto: [MVC (Model, View, Controller)](https://pt.wikipedia.org/wiki/MVC)

- Template UI: [AdminLTE 3](https://adminlte.io/themes/v3/)

- Tecnologias:

	-  [NodeJs](https://nodejs.org/pt-br/) - Javascript no backend

	-  [Npm](https://www.npmjs.com/) - Gerenciador de dependencias, baixar bibliotecas e gerenciar suas versões

	-  [Express](https://expressjs.com/pt-br/) - Framework de aplicação para facilitar a criação de um sistema e não reinventar a roda

	-  [Handlebars](https://handlebarsjs.com/) - Uma linguagem de template para faiclitar a criação da UI

	-  [Docker](https://docs.docker.com/) - Containers para "empacotar" as aplicações, facilitar o desenvolvimento em equipe e torná-la mais robusta

	-  [Docker Compose](https://docs.docker.com/compose/) - Gerenciamento de vários containers

	-  [MySQL](https://www.mysql.com/) - Banco de Dados (OBS: O mysql fica num container docker, não se preocupe em instalá-lo)

	-  [Sequelize](https://sequelize.org/) - ORM (Object Relational Mapper / Mapeamento Objeto Relacional) para facilitar a conexão e gerenciamento do banco de dados

## Desenvolvimento
 ### Requisitos
 ####  NodeJs (>=14.15.3)
 Tenha o NodeJs instalado preferencialmente na versão 14.15.3 para frente. Recomendo utilizar o NVM (Node Version Manager) que lhe permite gerenciar várias versões ao mesmo tempo, podendo migrar entre as mesmas como quiser. 
 - [Instalação](https://github.com/nvm-sh/nvm#installing-and-updating)

####  Docker e Docker Compose
- [Instalar Docker](https://docs.docker.com/engine/install/)
- [Instalar Docker Compose](https://docs.docker.com/compose/install/)

####  Clone Git Repository
```
git clone https://github.com/dbfernandes/sysicomp
```
### Configurar
Basta copiar o arquivo ***database-sample.js*** e ***mail-sample.json*** e alterá-los para ***database.js*** e ***mail.json***. O comando abaixo pode fazer isso para você.
```
cd sysicomp
cat src/config/database-sample.js > src/config/database.js
cat src/config/mail-sample.json > src/config/mail.json
```
### Rodar a aplicação
#### Para rodar somente através dos containers
```
docker-compose up -d sysicomp
```
Esse comando roda também o container do banco de dados automaticamente por estar definida como dependência do sysicomp no ***docker-compose.yml***.
Se seu docker e docker-compose estiverem configurados corretamente, o comando deve rodar normalmente, irá demorar um pouco na primeira vez por estar baixando as imagens dos containers.
**Acesse a aplicação na url http://localhost:3001/**
#### Para rodar somente o container do banco de dados e rodar a aplicação diretamente pelo Node
```
docker-compose up -d db
npm install 
npm run start:dev
```
**Acesse a aplicação na url http://localhost:3000/**

#### Para criar um novo módulo (Trabalho em progresso, mas já podem usar)
```
npm run criar-modulo nome-modulo
```

### Rodando as Migrations e Seeds
Para atualizar as tabelas e popular o banco, utilize os seguintes comandos:

```
npx sequelize db:migrate && sequelize db:seed:all
```


