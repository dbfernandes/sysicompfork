-- CreateTable
CREATE TABLE `AfastamentoTemporarios` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuarioId` INTEGER NOT NULL,
    `usuarioNome` VARCHAR(255) NOT NULL,
    `dataSaida` DATE NOT NULL,
    `dataRetorno` DATE NOT NULL,
    `tipoViagem` VARCHAR(255) NOT NULL,
    `localViagem` VARCHAR(255) NOT NULL,
    `justificativa` TEXT NOT NULL,
    `planoReposicao` TEXT NOT NULL,
    `createdAt` DATETIME(0) NOT NULL,
    `updatedAt` DATETIME(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Aluno` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nomeCompleto` VARCHAR(1024) NOT NULL,
    `curso` VARCHAR(50) NOT NULL,
    `periodoIngresso` VARCHAR(10) NOT NULL,
    `periodoConclusao` VARCHAR(10) NULL,
    `formado` SMALLINT NOT NULL,
    `createdAt` DATETIME(0) NOT NULL,
    `updatedAt` DATETIME(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Avatar` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idUsuario` INTEGER NOT NULL,
    `nome` VARCHAR(255) NOT NULL,
    `caminho` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME(0) NOT NULL,
    `updatedAt` DATETIME(0) NOT NULL,

    INDEX `idUsuario`(`idUsuario`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Candidate` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `editalPosition` INTEGER NULL,
    `editalId` VARCHAR(255) NOT NULL,
    `linhaDePesquisaId` INTEGER NULL,
    `passwordHash` VARCHAR(255) NOT NULL,
    `Nome` VARCHAR(255) NULL,
    `email` VARCHAR(255) NULL,
    `Nascimento` DATE NULL,
    `Sexo` VARCHAR(255) NULL,
    `NomeSocial` VARCHAR(255) NULL,
    `CEP` VARCHAR(255) NULL,
    `UF` VARCHAR(255) NULL,
    `Endereco` VARCHAR(255) NULL,
    `Cidade` VARCHAR(255) NULL,
    `Bairro` VARCHAR(255) NULL,
    `Nacionalidade` VARCHAR(255) NULL,
    `Telefone` VARCHAR(255) NULL,
    `TelefoneSecundario` VARCHAR(255) NULL,
    `ComoSoube` VARCHAR(255) NULL,
    `Curso` VARCHAR(255) NULL,
    `Regime` VARCHAR(255) NULL,
    `Cotista` BOOLEAN NULL,
    `CotistaTipo` VARCHAR(255) NULL,
    `Condicao` BOOLEAN NULL,
    `CondicaoTipo` VARCHAR(255) NULL,
    `Bolsista` BOOLEAN NULL,
    `CursoGraduacao` VARCHAR(255) NULL,
    `InstituicaoGraduacao` VARCHAR(255) NULL,
    `AnoEgressoGraduacao` VARCHAR(255) NULL,
    `CursoPos` VARCHAR(255) NULL,
    `CursoPosTipo` VARCHAR(255) NULL,
    `CursoInstituicaoPos` VARCHAR(255) NULL,
    `CursoAnoEgressoPos` VARCHAR(255) NULL,
    `Curriculum` BLOB NULL,
    `CartaDoOrientador` BLOB NULL,
    `PropostaDeTrabalho` BLOB NULL,

    INDEX `fk_Candidate_LinhaDePesquisa`(`linhaDePesquisaId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CandidateAcademicExperience` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idCandidate` INTEGER NOT NULL,
    `instituicao` VARCHAR(255) NOT NULL,
    `atividade` VARCHAR(255) NOT NULL,
    `periodo` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CandidatePublications` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idCandidate` INTEGER NOT NULL,
    `titulo` VARCHAR(255) NOT NULL,
    `ano` INTEGER NOT NULL,
    `local` VARCHAR(255) NULL,
    `tipo` INTEGER NOT NULL,
    `natureza` VARCHAR(255) NOT NULL,
    `autores` VARCHAR(255) NOT NULL,
    `ISSN` VARCHAR(300) NULL,
    `createdAt` DATETIME(0) NOT NULL,
    `updatedAt` DATETIME(0) NOT NULL,

    PRIMARY KEY (`id`, `idCandidate`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Edital` (
    `editalId` VARCHAR(255) NOT NULL,
    `vagaDoutorado` INTEGER NULL,
    `cotasDoutorado` INTEGER NULL,
    `vagaMestrado` INTEGER NULL,
    `cotasMestrado` INTEGER NULL,
    `cartaOrientador` VARCHAR(255) NOT NULL,
    `cartaRecomendacao` VARCHAR(255) NOT NULL,
    `documento` VARCHAR(255) NOT NULL,
    `dataInicio` DATE NOT NULL,
    `dataFim` DATE NOT NULL,
    `status` VARCHAR(255) NOT NULL DEFAULT '0',
    `inscricoesIniciadas` INTEGER NOT NULL DEFAULT 0,
    `inscricoesEncerradas` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(0) NOT NULL,
    `updatedAt` DATETIME(0) NOT NULL,

    UNIQUE INDEX `editalId`(`editalId`),
    PRIMARY KEY (`editalId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LinhasDePesquisa` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(255) NOT NULL,
    `sigla` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME(0) NOT NULL,
    `updatedAt` DATETIME(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Orientacao` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idProfessor` INTEGER NOT NULL,
    `titulo` VARCHAR(1024) NOT NULL,
    `aluno` VARCHAR(500) NOT NULL,
    `ano` INTEGER NOT NULL,
    `natureza` VARCHAR(1024) NULL,
    `tipo` SMALLINT NOT NULL,
    `status` SMALLINT NOT NULL,
    `createdAt` DATETIME(0) NOT NULL,
    `updatedAt` DATETIME(0) NOT NULL,

    INDEX `idProfessor`(`idProfessor`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Premios` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idProfessor` INTEGER NOT NULL,
    `titulo` VARCHAR(255) NOT NULL,
    `entidade` VARCHAR(255) NOT NULL,
    `ano` INTEGER NOT NULL,
    `createdAt` DATETIME(0) NOT NULL,
    `updatedAt` DATETIME(0) NOT NULL,

    INDEX `idProfessor`(`idProfessor`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Projeto` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idProfessor` INTEGER NOT NULL,
    `titulo` VARCHAR(1024) NOT NULL,
    `descricao` VARCHAR(5000) NOT NULL,
    `inicio` INTEGER NOT NULL,
    `fim` INTEGER NULL,
    `papel` VARCHAR(500) NOT NULL,
    `financiadores` VARCHAR(1024) NOT NULL,
    `integrantes` VARCHAR(1024) NOT NULL,
    `createdAt` DATETIME(0) NOT NULL,
    `updatedAt` DATETIME(0) NOT NULL,

    INDEX `idProfessor`(`idProfessor`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Publicacao` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `titulo` VARCHAR(1024) NOT NULL,
    `ano` INTEGER NOT NULL,
    `local` VARCHAR(1024) NULL,
    `tipo` INTEGER NOT NULL,
    `natureza` VARCHAR(100) NULL,
    `autores` VARCHAR(1024) NOT NULL,
    `ISSN` VARCHAR(300) NOT NULL,
    `createdAt` DATETIME(0) NOT NULL,
    `updatedAt` DATETIME(0) NOT NULL,

    INDEX `tipo`(`tipo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Recommendations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RelUsuarioPublicacao` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idUsuario` INTEGER NOT NULL,
    `idPublicacao` INTEGER NOT NULL,
    `createdAt` DATETIME(0) NOT NULL,
    `updatedAt` DATETIME(0) NOT NULL,

    INDEX `idPublicacao`(`idPublicacao`),
    INDEX `idUsuario`(`idUsuario`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ReservaSalas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `SalaId` INTEGER NULL,
    `teste` VARCHAR(255) NULL,
    `UsuarioId` INTEGER NULL,
    `atividade` VARCHAR(255) NULL,
    `tipo` VARCHAR(255) NULL,
    `dias` VARCHAR(255) NULL,
    `dataInicio` DATE NULL,
    `dataTermino` DATE NULL,
    `horaInicio` TIME(0) NULL,
    `horaTermino` TIME(0) NULL,
    `createdAt` DATETIME(0) NOT NULL,
    `updatedAt` DATETIME(0) NOT NULL,

    INDEX `reserva_sala_fk`(`SalaId`),
    INDEX `reserva_usuario_fk`(`UsuarioId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Salas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(255) NULL,
    `capacidade` INTEGER NULL,
    `numero` INTEGER NULL,
    `andar` INTEGER NULL,
    `bloco` VARCHAR(255) NULL,
    `createdAt` DATETIME(0) NOT NULL,
    `updatedAt` DATETIME(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SequelizeMeta` (
    `name` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `name`(`name`),
    PRIMARY KEY (`name`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TipoPublicacao` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(255) NOT NULL,
    `chave` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME(0) NOT NULL,
    `updatedAt` DATETIME(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Trancamentos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idAluno` INTEGER NULL,
    `tipo` TINYINT NULL,
    `dataSolicitacao` DATETIME(0) NULL,
    `dataInicio` DATETIME(0) NULL,
    `prevTermino` DATETIME(0) NULL,
    `dataTermino` DATETIME(0) NULL,
    `justificativa` VARCHAR(255) NULL,
    `documento` TEXT NULL,
    `doc_anexo` VARCHAR(255) NULL,
    `status` TINYINT NULL,
    `id_responsavel` INTEGER NULL,
    `createdAt` DATETIME(0) NOT NULL,
    `updatedAt` DATETIME(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Usuario` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nomeCompleto` VARCHAR(255) NOT NULL,
    `cpf` VARCHAR(255) NOT NULL,
    `senhaHash` VARCHAR(255) NOT NULL,
    `tokenResetSenha` VARCHAR(255) NULL,
    `validadeTokenResetSenha` DATETIME(0) NULL,
    `email` VARCHAR(255) NOT NULL,
    `status` SMALLINT NOT NULL DEFAULT 1,
    `administrador` SMALLINT NOT NULL DEFAULT 0,
    `coordenador` SMALLINT NOT NULL DEFAULT 0,
    `secretaria` SMALLINT NOT NULL DEFAULT 0,
    `professor` SMALLINT NOT NULL DEFAULT 0,
    `siape` VARCHAR(10) NULL,
    `dataIngresso` VARCHAR(10) NULL,
    `endereco` VARCHAR(255) NULL,
    `telCelular` VARCHAR(20) NULL,
    `telResidencial` VARCHAR(20) NULL,
    `unidade` VARCHAR(60) NULL,
    `turno` VARCHAR(32) NULL,
    `idLattes` BIGINT NULL,
    `formacao` VARCHAR(255) NULL,
    `formacaoIngles` VARCHAR(255) NULL,
    `resumo` VARCHAR(5000) NULL,
    `resumoIngles` VARCHAR(5000) NULL,
    `ultimaAtualizacao` DATETIME(0) NULL,
    `createdAt` DATETIME(0) NOT NULL,
    `updatedAt` DATETIME(0) NOT NULL,

    UNIQUE INDEX `cpf`(`cpf`),
    UNIQUE INDEX `tokenResetSenha`(`tokenResetSenha`),
    UNIQUE INDEX `email`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `prorrogacoes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idAluno` INTEGER NULL,
    `dataSolicitacao` DATETIME(0) NULL,
    `dataInicio` DATETIME(0) NULL,
    `qtdDias` INTEGER NULL,
    `documento` TEXT NULL,
    `justificativa` TEXT NULL,
    `status` BOOLEAN NULL,
    `data_termino` DATETIME(0) NULL,
    `id_responsavel` INTEGER NULL,
    `createdAt` DATETIME(0) NOT NULL,
    `updatedAt` DATETIME(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Avatar` ADD CONSTRAINT `Avatar_ibfk_1` FOREIGN KEY (`idUsuario`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `Candidate` ADD CONSTRAINT `fk_Candidate_LinhaDePesquisa` FOREIGN KEY (`linhaDePesquisaId`) REFERENCES `LinhasDePesquisa`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Orientacao` ADD CONSTRAINT `Orientacao_ibfk_1` FOREIGN KEY (`idProfessor`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `Premios` ADD CONSTRAINT `Premios_ibfk_1` FOREIGN KEY (`idProfessor`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `Projeto` ADD CONSTRAINT `Projeto_ibfk_1` FOREIGN KEY (`idProfessor`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `Publicacao` ADD CONSTRAINT `Publicacao_ibfk_1` FOREIGN KEY (`tipo`) REFERENCES `TipoPublicacao`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `RelUsuarioPublicacao` ADD CONSTRAINT `RelUsuarioPublicacao_ibfk_1` FOREIGN KEY (`idUsuario`) REFERENCES `Usuario`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `RelUsuarioPublicacao` ADD CONSTRAINT `RelUsuarioPublicacao_ibfk_2` FOREIGN KEY (`idPublicacao`) REFERENCES `Publicacao`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `ReservaSalas` ADD CONSTRAINT `reserva_sala_fk` FOREIGN KEY (`SalaId`) REFERENCES `Salas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ReservaSalas` ADD CONSTRAINT `reserva_usuario_fk` FOREIGN KEY (`UsuarioId`) REFERENCES `Usuario`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
