-- CreateTable
CREATE TABLE `AfastamentoTemporario` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuarioId` INTEGER NOT NULL,
    `nomeCompleto` VARCHAR(255) NOT NULL,
    `dataInicio` DATE NOT NULL,
    `dataFim` DATE NOT NULL,
    `tipoViagem` VARCHAR(255) NOT NULL,
    `localViagem` VARCHAR(255) NOT NULL,
    `justificativa` TEXT NOT NULL,
    `planoReposicao` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `AfastamentoTemporario_usuarioId_idx`(`usuarioId`),
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
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Avatar` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuarioId` INTEGER NOT NULL,
    `nome` VARCHAR(255) NOT NULL,
    `caminho` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `usuarioId`(`usuarioId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Candidato` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `posicaoEdital` SMALLINT NULL,
    `senhaHash` VARCHAR(255) NOT NULL,
    `tokenResetSenha` VARCHAR(255) NULL,
    `validadeTokenReset` DATETIME(0) NULL,
    `editalId` VARCHAR(191) NOT NULL,
    `linhaPesquisaId` INTEGER NULL,
    `nome` VARCHAR(60) NULL,
    `email` VARCHAR(50) NULL,
    `dataNascimento` DATE NULL,
    `pais` VARCHAR(20) NULL,
    `passaporte` VARCHAR(20) NULL,
    `cpf` CHAR(14) NULL,
    `sexo` VARCHAR(1) NULL,
    `nomeSocial` VARCHAR(60) NULL,
    `cep` VARCHAR(9) NULL,
    `uf` VARCHAR(2) NULL,
    `endereco` VARCHAR(160) NULL,
    `cidade` VARCHAR(40) NULL,
    `bairro` VARCHAR(50) NULL,
    `nacionalidade` VARCHAR(11) NULL,
    `telefone` VARCHAR(18) NULL,
    `telefoneSecundario` VARCHAR(18) NULL,
    `comoSoube` VARCHAR(100) NULL,
    `cursoDesejado` VARCHAR(191) NULL,
    `regime` VARCHAR(191) NULL,
    `cotista` BOOLEAN NOT NULL DEFAULT false,
    `cotistaTipo` VARCHAR(100) NULL,
    `condicao` BOOLEAN NOT NULL DEFAULT false,
    `condicaoTipo` VARCHAR(100) NULL,
    `bolsista` BOOLEAN NOT NULL DEFAULT false,
    `cursoGraduacao` VARCHAR(50) NULL,
    `instituicaoGraduacao` VARCHAR(50) NULL,
    `anoEgressoGraduacao` INTEGER NULL,
    `cursoPos` VARCHAR(50) NULL,
    `tipoPos` VARCHAR(30) NULL,
    `instituicaoPos` VARCHAR(50) NULL,
    `anoEgressoPos` INTEGER NULL,
    `tituloProposta` VARCHAR(100) NULL,
    `motivos` VARCHAR(1001) NULL,
    `nomeOrientador` VARCHAR(200) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `finishedAt` DATETIME(3) NULL,

    INDEX `Candidato_editalId_idx`(`editalId`),
    INDEX `Candidato_linhaPesquisaId_idx`(`linhaPesquisaId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CandidatoExperienciaAcademica` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `candidatoId` INTEGER NOT NULL,
    `instituicao` VARCHAR(60) NULL,
    `atividade` VARCHAR(60) NULL,
    `periodo` VARCHAR(30) NULL,

    INDEX `CandidatoExperienciaAcademica_candidatoId_idx`(`candidatoId`),
    PRIMARY KEY (`id`, `candidatoId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CandidatoPublicacao` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `candidatoId` INTEGER NOT NULL,
    `titulo` VARCHAR(255) NOT NULL,
    `ano` INTEGER NOT NULL,
    `local` VARCHAR(255) NULL,
    `tipo` INTEGER NOT NULL,
    `natureza` VARCHAR(255) NOT NULL,
    `autores` VARCHAR(255) NOT NULL,
    `issn` VARCHAR(300) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `CandidatoPublicacao_candidatoId_idx`(`candidatoId`),
    PRIMARY KEY (`id`, `candidatoId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CandidatoRecomendacao` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dataEnvio` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `dataResposta` DATETIME(3) NULL,
    `prazo` DATE NOT NULL,
    `nome` VARCHAR(100) NULL,
    `email` VARCHAR(100) NOT NULL,
    `token` VARCHAR(50) NOT NULL,
    `titulacao` VARCHAR(50) NULL,
    `cargo` VARCHAR(50) NULL,
    `instituicaoTitulacao` VARCHAR(100) NULL,
    `anoTitulacao` INTEGER NULL,
    `instituicaoAtual` VARCHAR(100) NULL,
    `dominio` SMALLINT NULL,
    `aprendizado` SMALLINT NULL,
    `assiduidade` SMALLINT NULL,
    `relacionamento` SMALLINT NULL,
    `iniciativa` SMALLINT NULL,
    `expressao` SMALLINT NULL,
    `classificacao` DOUBLE NULL,
    `informacoes` TEXT NULL,
    `anoContato` SMALLINT NULL,
    `conheceGraduacao` SMALLINT NOT NULL DEFAULT 0,
    `conhecePos` SMALLINT NOT NULL DEFAULT 0,
    `conheceEmpresa` SMALLINT NOT NULL DEFAULT 0,
    `conheceOutros` SMALLINT NOT NULL DEFAULT 0,
    `outrosLugares` VARCHAR(60) NULL,
    `orientador` SMALLINT NOT NULL DEFAULT 0,
    `professor` SMALLINT NOT NULL DEFAULT 0,
    `empregador` SMALLINT NOT NULL DEFAULT 0,
    `coordenador` SMALLINT NOT NULL DEFAULT 0,
    `colegaCurso` SMALLINT NOT NULL DEFAULT 0,
    `colegaTrabalho` SMALLINT NOT NULL DEFAULT 0,
    `outrosContatos` SMALLINT NOT NULL DEFAULT 0,
    `outrasFuncoes` VARCHAR(60) NULL,
    `passo` CHAR(1) NOT NULL DEFAULT '1',
    `candidatoId` INTEGER NOT NULL,
    `editalId` VARCHAR(20) NULL,

    INDEX `CandidatoRecomendacao_candidatoId_idx`(`candidatoId`),
    INDEX `CandidatoRecomendacao_editalId_idx`(`editalId`),
    PRIMARY KEY (`id`, `candidatoId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Edital` (
    `id` VARCHAR(191) NOT NULL,
    `vagasDoutorado` INTEGER NULL,
    `cotasDoutorado` INTEGER NULL,
    `vagasMestrado` INTEGER NULL,
    `cotasMestrado` INTEGER NULL,
    `cartaOrientador` VARCHAR(255) NOT NULL,
    `cartaRecomendacao` VARCHAR(255) NOT NULL,
    `documento` VARCHAR(255) NOT NULL,
    `dataInicio` DATE NOT NULL,
    `dataFim` DATE NOT NULL,
    `status` SMALLINT NOT NULL DEFAULT 0,
    `inscricoesIniciadas` SMALLINT NOT NULL DEFAULT 0,
    `inscricoesEncerradas` SMALLINT NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Edital_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LinhaPesquisa` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(255) NOT NULL,
    `sigla` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Orientacao` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `professorId` INTEGER NOT NULL,
    `titulo` VARCHAR(1024) NOT NULL,
    `aluno` VARCHAR(500) NOT NULL,
    `ano` INTEGER NOT NULL,
    `natureza` VARCHAR(1024) NULL,
    `tipo` SMALLINT NOT NULL,
    `status` SMALLINT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Orientacao_professorId_idx`(`professorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Premio` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `professorId` INTEGER NOT NULL,
    `titulo` VARCHAR(255) NOT NULL,
    `entidade` VARCHAR(255) NOT NULL,
    `ano` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Premio_professorId_idx`(`professorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Projeto` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `professorId` INTEGER NOT NULL,
    `titulo` VARCHAR(1024) NOT NULL,
    `descricao` VARCHAR(5000) NOT NULL,
    `dataInicio` INTEGER NOT NULL,
    `dataFim` INTEGER NULL,
    `papel` VARCHAR(500) NOT NULL,
    `financiadores` VARCHAR(1024) NOT NULL,
    `integrantes` VARCHAR(1024) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Projeto_professorId_idx`(`professorId`),
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
    `issn` VARCHAR(300) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Publicacao_tipo_idx`(`tipo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Recomendacoes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UsuarioPublicacao` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuarioId` INTEGER NOT NULL,
    `publicacaoId` INTEGER NOT NULL,

    INDEX `UsuarioPublicacao_usuarioId_idx`(`usuarioId`),
    INDEX `UsuarioPublicacao_publicacaoId_idx`(`publicacaoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ReservaSala` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `salaId` INTEGER NULL,
    `usuarioId` INTEGER NULL,
    `atividade` VARCHAR(255) NULL,
    `tipo` VARCHAR(255) NULL,
    `dias` VARCHAR(255) NULL,
    `dataInicio` DATE NULL,
    `dataFim` DATE NULL,
    `horaInicio` VARCHAR(255) NULL,
    `horaFim` VARCHAR(255) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `ReservaSala_salaId_idx`(`salaId`),
    INDEX `ReservaSala_usuarioId_idx`(`usuarioId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Sala` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(255) NULL,
    `capacidade` INTEGER NULL,
    `numero` INTEGER NULL,
    `andar` VARCHAR(255) NULL,
    `bloco` VARCHAR(255) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TipoPublicacao` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(255) NOT NULL,
    `chave` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Usuario` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nomeCompleto` VARCHAR(255) NOT NULL,
    `cpf` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `senhaHash` VARCHAR(255) NOT NULL,
    `tokenResetSenha` VARCHAR(255) NULL,
    `validadeTokenResetSenha` DATETIME(0) NULL,
    `status` SMALLINT NOT NULL DEFAULT 1,
    `administrador` SMALLINT NOT NULL DEFAULT 0,
    `coordenador` SMALLINT NOT NULL DEFAULT 0,
    `secretaria` SMALLINT NOT NULL DEFAULT 0,
    `diretor` SMALLINT NOT NULL DEFAULT 0,
    `professor` SMALLINT NOT NULL DEFAULT 0,
    `perfil` VARCHAR(255) NULL,
    `siape` VARCHAR(10) NULL,
    `dataIngresso` DATE NULL,
    `endereco` VARCHAR(255) NULL,
    `telCelular` VARCHAR(20) NULL,
    `telResidencial` VARCHAR(20) NULL,
    `unidade` VARCHAR(60) NULL,
    `turno` VARCHAR(32) NULL,
    `lattesId` BIGINT NULL,
    `formacao` VARCHAR(255) NULL,
    `formacaoIngles` VARCHAR(255) NULL,
    `resumo` VARCHAR(5000) NULL,
    `resumoIngles` VARCHAR(5000) NULL,
    `ultimaAtualizacao` DATETIME(0) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Usuario_cpf_key`(`cpf`),
    UNIQUE INDEX `Usuario_email_key`(`email`),
    UNIQUE INDEX `Usuario_tokenResetSenha_key`(`tokenResetSenha`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `AfastamentoTemporario` ADD CONSTRAINT `AfastamentoTemporario_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Avatar` ADD CONSTRAINT `Avatar_ibfk_1` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `Candidato` ADD CONSTRAINT `Candidato_editalId_fkey` FOREIGN KEY (`editalId`) REFERENCES `Edital`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Candidato` ADD CONSTRAINT `Candidato_linhaPesquisaId_fkey` FOREIGN KEY (`linhaPesquisaId`) REFERENCES `LinhaPesquisa`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CandidatoExperienciaAcademica` ADD CONSTRAINT `CandidatoExperienciaAcademica_candidatoId_fkey` FOREIGN KEY (`candidatoId`) REFERENCES `Candidato`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CandidatoPublicacao` ADD CONSTRAINT `CandidatoPublicacao_candidatoId_fkey` FOREIGN KEY (`candidatoId`) REFERENCES `Candidato`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CandidatoRecomendacao` ADD CONSTRAINT `CandidatoRecomendacao_candidatoId_fkey` FOREIGN KEY (`candidatoId`) REFERENCES `Candidato`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CandidatoRecomendacao` ADD CONSTRAINT `CandidatoRecomendacao_editalId_fkey` FOREIGN KEY (`editalId`) REFERENCES `Edital`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Orientacao` ADD CONSTRAINT `Orientacao_professorId_fkey` FOREIGN KEY (`professorId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Premio` ADD CONSTRAINT `Premio_professorId_fkey` FOREIGN KEY (`professorId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Projeto` ADD CONSTRAINT `Projeto_professorId_fkey` FOREIGN KEY (`professorId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Publicacao` ADD CONSTRAINT `Publicacao_tipo_fkey` FOREIGN KEY (`tipo`) REFERENCES `TipoPublicacao`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UsuarioPublicacao` ADD CONSTRAINT `UsuarioPublicacao_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UsuarioPublicacao` ADD CONSTRAINT `UsuarioPublicacao_publicacaoId_fkey` FOREIGN KEY (`publicacaoId`) REFERENCES `Publicacao`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ReservaSala` ADD CONSTRAINT `ReservaSala_salaId_fkey` FOREIGN KEY (`salaId`) REFERENCES `Sala`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ReservaSala` ADD CONSTRAINT `ReservaSala_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
