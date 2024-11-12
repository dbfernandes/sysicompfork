/*
  Warnings:

  - You are about to drop the column `idEdital` on the `Candidato` table. All the data in the column will be lost.
  - You are about to drop the column `idLinhaPesquisa` on the `Candidato` table. All the data in the column will be lost.
  - You are about to alter the column `anoEgressoGraduacao` on the `Candidato` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `anoEgressoPos` on the `Candidato` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `CandidatoExperienciaAcademica` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `idCandidato` on the `CandidatoExperienciaAcademica` table. All the data in the column will be lost.
  - The primary key for the `CandidatoRecomendacao` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `idCandidato` on the `CandidatoRecomendacao` table. All the data in the column will be lost.
  - You are about to drop the column `idEdital` on the `CandidatoRecomendacao` table. All the data in the column will be lost.
  - The primary key for the `Edital` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `editalId` on the `Edital` table. All the data in the column will be lost.
  - You are about to drop the column `vagaDoutorado` on the `Edital` table. All the data in the column will be lost.
  - You are about to drop the column `vagaMestrado` on the `Edital` table. All the data in the column will be lost.
  - You are about to alter the column `dataInicio` on the `Edital` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `Date`.
  - You are about to alter the column `dataFim` on the `Edital` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `Date`.
  - You are about to alter the column `status` on the `Edital` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `SmallInt`.
  - You are about to alter the column `inscricoesIniciadas` on the `Edital` table. The data in that column could be lost. The data in that column will be cast from `Int` to `SmallInt`.
  - You are about to alter the column `inscricoesEncerradas` on the `Edital` table. The data in that column could be lost. The data in that column will be cast from `Int` to `SmallInt`.
  - You are about to drop the column `idProfessor` on the `Orientacao` table. All the data in the column will be lost.
  - You are about to drop the column `fim` on the `Projeto` table. All the data in the column will be lost.
  - You are about to drop the column `idProfessor` on the `Projeto` table. All the data in the column will be lost.
  - You are about to drop the column `inicio` on the `Projeto` table. All the data in the column will be lost.
  - You are about to drop the column `ISSN` on the `Publicacao` table. All the data in the column will be lost.
  - You are about to drop the column `tokenResetarSenha` on the `Usuario` table. All the data in the column will be lost.
  - You are about to drop the column `validadeTokenResetadaSenha` on the `Usuario` table. All the data in the column will be lost.
  - You are about to alter the column `dataIngresso` on the `Usuario` table. The data in that column could be lost. The data in that column will be cast from `VarChar(10)` to `Date`.
  - You are about to drop the `AfastamentoTemporarios` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CandidatoPublicacoes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LinhasDePesquisa` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Premios` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RelUsuarioPublicacao` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ReservaSalas` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Salas` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[id]` on the table `Edital` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tokenResetSenha]` on the table `Usuario` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `editalId` to the `Candidato` table without a default value. This is not possible if the table is not empty.
  - Made the column `cotista` on table `Candidato` required. This step will fail if there are existing NULL values in that column.
  - Made the column `condicao` on table `Candidato` required. This step will fail if there are existing NULL values in that column.
  - Made the column `bolsista` on table `Candidato` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `candidatoId` to the `CandidatoExperienciaAcademica` table without a default value. This is not possible if the table is not empty.
  - Added the required column `candidatoId` to the `CandidatoRecomendacao` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `Edital` table without a default value. This is not possible if the table is not empty.
  - Added the required column `professorId` to the `Orientacao` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dataInicio` to the `Projeto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `professorId` to the `Projeto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `issn` to the `Publicacao` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Candidato` DROP FOREIGN KEY `Candidato_idEdital_fkey`;

-- DropForeignKey
ALTER TABLE `Candidato` DROP FOREIGN KEY `Candidato_idLinhaPesquisa_fkey`;

-- DropForeignKey
ALTER TABLE `CandidatoExperienciaAcademica` DROP FOREIGN KEY `CandidatoExperienciaAcademica_idCandidato_fkey`;

-- DropForeignKey
ALTER TABLE `CandidatoPublicacoes` DROP FOREIGN KEY `CandidatoPublicacoes_idCandidato_fkey`;

-- DropForeignKey
ALTER TABLE `CandidatoRecomendacao` DROP FOREIGN KEY `CandidatoRecomendacao_idCandidato_fkey`;

-- DropForeignKey
ALTER TABLE `CandidatoRecomendacao` DROP FOREIGN KEY `CandidatoRecomendacao_idEdital_fkey`;

-- DropForeignKey
ALTER TABLE `Orientacao` DROP FOREIGN KEY `Orientacao_ibfk_1`;

-- DropForeignKey
ALTER TABLE `Premios` DROP FOREIGN KEY `Premios_ibfk_1`;

-- DropForeignKey
ALTER TABLE `Projeto` DROP FOREIGN KEY `Projeto_ibfk_1`;

-- DropForeignKey
ALTER TABLE `Publicacao` DROP FOREIGN KEY `Publicacao_ibfk_1`;

-- DropForeignKey
ALTER TABLE `RelUsuarioPublicacao` DROP FOREIGN KEY `RelUsuarioPublicacao_ibfk_1`;

-- DropForeignKey
ALTER TABLE `RelUsuarioPublicacao` DROP FOREIGN KEY `RelUsuarioPublicacao_ibfk_2`;

-- DropForeignKey
ALTER TABLE `ReservaSalas` DROP FOREIGN KEY `reserva_sala_fk`;

-- DropForeignKey
ALTER TABLE `ReservaSalas` DROP FOREIGN KEY `reserva_usuario_fk`;

-- DropIndex
DROP INDEX `editalId` ON `Edital`;

-- DropIndex
DROP INDEX `tokenResetSenha` ON `Usuario`;

-- AlterTable
ALTER TABLE `Candidato` DROP COLUMN `idEdital`,
    DROP COLUMN `idLinhaPesquisa`,
    ADD COLUMN `editalId` VARCHAR(191) NOT NULL,
    ADD COLUMN `linhaPesquisaId` INTEGER NULL,
    MODIFY `cotista` SMALLINT NOT NULL DEFAULT 0,
    MODIFY `condicao` SMALLINT NOT NULL DEFAULT 0,
    MODIFY `bolsista` SMALLINT NOT NULL DEFAULT 0,
    MODIFY `anoEgressoGraduacao` INTEGER NULL,
    MODIFY `anoEgressoPos` INTEGER NULL;

-- AlterTable
ALTER TABLE `CandidatoExperienciaAcademica` DROP PRIMARY KEY,
    DROP COLUMN `idCandidato`,
    ADD COLUMN `candidatoId` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`, `candidatoId`);

-- AlterTable
ALTER TABLE `CandidatoRecomendacao` DROP PRIMARY KEY,
    DROP COLUMN `idCandidato`,
    DROP COLUMN `idEdital`,
    ADD COLUMN `candidatoId` INTEGER NOT NULL,
    ADD COLUMN `editalId` VARCHAR(20) NULL,
    ADD PRIMARY KEY (`id`, `candidatoId`);

-- AlterTable
ALTER TABLE `Edital` DROP PRIMARY KEY,
    DROP COLUMN `editalId`,
    DROP COLUMN `vagaDoutorado`,
    DROP COLUMN `vagaMestrado`,
    ADD COLUMN `id` VARCHAR(191) NOT NULL,
    ADD COLUMN `vagasDoutorado` INTEGER NULL,
    ADD COLUMN `vagasMestrado` INTEGER NULL,
    MODIFY `dataInicio` DATE NOT NULL,
    MODIFY `dataFim` DATE NOT NULL,
    MODIFY `status` SMALLINT NOT NULL DEFAULT 0,
    MODIFY `inscricoesIniciadas` SMALLINT NOT NULL DEFAULT 0,
    MODIFY `inscricoesEncerradas` SMALLINT NOT NULL DEFAULT 0,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Orientacao` DROP COLUMN `idProfessor`,
    ADD COLUMN `professorId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Projeto` DROP COLUMN `fim`,
    DROP COLUMN `idProfessor`,
    DROP COLUMN `inicio`,
    ADD COLUMN `dataFim` INTEGER NULL,
    ADD COLUMN `dataInicio` INTEGER NOT NULL,
    ADD COLUMN `professorId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Publicacao` DROP COLUMN `ISSN`,
    ADD COLUMN `issn` VARCHAR(300) NOT NULL;

-- AlterTable
ALTER TABLE `Usuario` DROP COLUMN `tokenResetarSenha`,
    DROP COLUMN `validadeTokenResetadaSenha`,
    ADD COLUMN `tokenResetSenha` VARCHAR(255) NULL,
    ADD COLUMN `validadeTokenResetSenha` DATETIME(0) NULL,
    MODIFY `dataIngresso` DATE NULL;

-- DropTable
DROP TABLE `AfastamentoTemporarios`;

-- DropTable
DROP TABLE `CandidatoPublicacoes`;

-- DropTable
DROP TABLE `LinhasDePesquisa`;

-- DropTable
DROP TABLE `Premios`;

-- DropTable
DROP TABLE `RelUsuarioPublicacao`;

-- DropTable
DROP TABLE `ReservaSalas`;

-- DropTable
DROP TABLE `Salas`;

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
CREATE TABLE `LinhaPesquisa` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(255) NOT NULL,
    `sigla` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

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

-- CreateIndex
CREATE INDEX `Candidato_editalId_idx` ON `Candidato`(`editalId`);

-- CreateIndex
CREATE INDEX `Candidato_linhaPesquisaId_idx` ON `Candidato`(`linhaPesquisaId`);

-- CreateIndex
CREATE INDEX `CandidatoExperienciaAcademica_candidatoId_idx` ON `CandidatoExperienciaAcademica`(`candidatoId`);

-- CreateIndex
CREATE INDEX `CandidatoRecomendacao_candidatoId_idx` ON `CandidatoRecomendacao`(`candidatoId`);

-- CreateIndex
CREATE INDEX `CandidatoRecomendacao_editalId_idx` ON `CandidatoRecomendacao`(`editalId`);

-- CreateIndex
CREATE UNIQUE INDEX `Edital_id_key` ON `Edital`(`id`);

-- CreateIndex
CREATE INDEX `Orientacao_professorId_idx` ON `Orientacao`(`professorId`);

-- CreateIndex
CREATE INDEX `Projeto_professorId_idx` ON `Projeto`(`professorId`);

-- CreateIndex
CREATE UNIQUE INDEX `Usuario_tokenResetSenha_key` ON `Usuario`(`tokenResetSenha`);

-- AddForeignKey
ALTER TABLE `AfastamentoTemporario` ADD CONSTRAINT `AfastamentoTemporario_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

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

-- RenameIndex
ALTER TABLE `Publicacao` RENAME INDEX `tipo` TO `Publicacao_tipo_idx`;

-- RenameIndex
ALTER TABLE `Usuario` RENAME INDEX `cpf` TO `Usuario_cpf_key`;

-- RenameIndex
ALTER TABLE `Usuario` RENAME INDEX `email` TO `Usuario_email_key`;
