/*
  Warnings:

  - The primary key for the `Candidato` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Candidato` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `CandidatoExperienciaAcademica` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `idCandidato` on the `CandidatoExperienciaAcademica` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `CandidatoPublicacoes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `idCandidato` on the `CandidatoPublicacoes` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.

*/
-- DropForeignKey
ALTER TABLE `CandidatoExperienciaAcademica` DROP FOREIGN KEY `CandidatoExperienciaAcademica_idCandidato_fkey`;

-- DropForeignKey
ALTER TABLE `CandidatoPublicacoes` DROP FOREIGN KEY `CandidatoPublicacoes_idCandidato_fkey`;

-- AlterTable
ALTER TABLE `Candidato` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `CandidatoExperienciaAcademica` DROP PRIMARY KEY,
    MODIFY `idCandidato` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`, `idCandidato`);

-- AlterTable
ALTER TABLE `CandidatoPublicacoes` DROP PRIMARY KEY,
    MODIFY `idCandidato` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`, `idCandidato`);

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
    `idCandidato` INTEGER NOT NULL,
    `idEdital` VARCHAR(20) NULL,

    PRIMARY KEY (`id`, `idCandidato`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CandidatoExperienciaAcademica` ADD CONSTRAINT `CandidatoExperienciaAcademica_idCandidato_fkey` FOREIGN KEY (`idCandidato`) REFERENCES `Candidato`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CandidatoPublicacoes` ADD CONSTRAINT `CandidatoPublicacoes_idCandidato_fkey` FOREIGN KEY (`idCandidato`) REFERENCES `Candidato`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CandidatoRecomendacao` ADD CONSTRAINT `CandidatoRecomendacao_idCandidato_fkey` FOREIGN KEY (`idCandidato`) REFERENCES `Candidato`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CandidatoRecomendacao` ADD CONSTRAINT `CandidatoRecomendacao_idEdital_fkey` FOREIGN KEY (`idEdital`) REFERENCES `Edital`(`editalId`) ON DELETE SET NULL ON UPDATE CASCADE;
