/*
  Warnings:

  - You are about to drop the column `idUsuario` on the `Avatar` table. All the data in the column will be lost.
  - You are about to drop the column `idEdital` on the `Candidato` table. All the data in the column will be lost.
  - You are about to drop the column `idLinhaPesquisa` on the `Candidato` table. All the data in the column will be lost.
  - The primary key for the `CandidatoExperienciaAcademica` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `idCandidato` on the `CandidatoExperienciaAcademica` table. All the data in the column will be lost.
  - The primary key for the `CandidatoRecomendacao` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `idCandidato` on the `CandidatoRecomendacao` table. All the data in the column will be lost.
  - You are about to drop the column `idEdital` on the `CandidatoRecomendacao` table. All the data in the column will be lost.
  - The primary key for the `Edital` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `editalId` on the `Edital` table. All the data in the column will be lost.
  - You are about to drop the column `idProfessor` on the `Orientacao` table. All the data in the column will be lost.
  - You are about to drop the column `idProfessor` on the `Projeto` table. All the data in the column will be lost.
  - You are about to drop the column `ISSN` on the `Publicacao` table. All the data in the column will be lost.
  - You are about to drop the column `tipo` on the `Publicacao` table. All the data in the column will be lost.
  - You are about to drop the column `idPublicacao` on the `RelUsuarioPublicacao` table. All the data in the column will be lost.
  - You are about to drop the column `idUsuario` on the `RelUsuarioPublicacao` table. All the data in the column will be lost.
  - You are about to drop the `AfastamentoTemporarios` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CandidatoPublicacoes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LinhasDePesquisa` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Premios` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Recomendacoes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ReservaSalas` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Salas` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[editalCodigo]` on the table `Edital` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `usuarioId` to the `Avatar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `editalId` to the `Candidato` table without a default value. This is not possible if the table is not empty.
  - Added the required column `candidatoId` to the `CandidatoExperienciaAcademica` table without a default value. This is not possible if the table is not empty.
  - Added the required column `candidatoId` to the `CandidatoRecomendacao` table without a default value. This is not possible if the table is not empty.
  - Added the required column `editalId` to the `CandidatoRecomendacao` table without a default value. This is not possible if the table is not empty.
  - Added the required column `editalCodigo` to the `Edital` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `Edital` table without a default value. This is not possible if the table is not empty.
  - Added the required column `professorId` to the `Orientacao` table without a default value. This is not possible if the table is not empty.
  - Added the required column `professorId` to the `Projeto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `issn` to the `Publicacao` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipoPublicacaoId` to the `Publicacao` table without a default value. This is not possible if the table is not empty.
  - Added the required column `publicacaoId` to the `RelUsuarioPublicacao` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usuarioId` to the `RelUsuarioPublicacao` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Avatar` DROP FOREIGN KEY `Avatar_ibfk_1`;

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

-- AlterTable
ALTER TABLE `Avatar` DROP COLUMN `idUsuario`,
    ADD COLUMN `usuarioId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Candidato` DROP COLUMN `idEdital`,
    DROP COLUMN `idLinhaPesquisa`,
    ADD COLUMN `editalId` INTEGER NOT NULL,
    ADD COLUMN `linhaPesquisaId` INTEGER NULL;

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
    ADD COLUMN `editalId` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`, `candidatoId`);

-- AlterTable
ALTER TABLE `Edital` DROP PRIMARY KEY,
    DROP COLUMN `editalId`,
    ADD COLUMN `editalCodigo` VARCHAR(50) NOT NULL,
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Orientacao` DROP COLUMN `idProfessor`,
    ADD COLUMN `professorId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Projeto` DROP COLUMN `idProfessor`,
    ADD COLUMN `professorId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Publicacao` DROP COLUMN `ISSN`,
    DROP COLUMN `tipo`,
    ADD COLUMN `issn` VARCHAR(300) NOT NULL,
    ADD COLUMN `tipoPublicacaoId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `RelUsuarioPublicacao` DROP COLUMN `idPublicacao`,
    DROP COLUMN `idUsuario`,
    ADD COLUMN `publicacaoId` INTEGER NOT NULL,
    ADD COLUMN `usuarioId` INTEGER NOT NULL;

-- DropTable
DROP TABLE `AfastamentoTemporarios`;

-- DropTable
DROP TABLE `CandidatoPublicacoes`;

-- DropTable
DROP TABLE `LinhasDePesquisa`;

-- DropTable
DROP TABLE `Premios`;

-- DropTable
DROP TABLE `Recomendacoes`;

-- DropTable
DROP TABLE `ReservaSalas`;

-- DropTable
DROP TABLE `Salas`;

-- CreateTable
CREATE TABLE `AfastamentoTemporario` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuarioId` INTEGER NOT NULL,
    `usuarioNome` VARCHAR(255) NOT NULL,
    `dataSaida` DATE NOT NULL,
    `dataRetorno` DATE NOT NULL,
    `tipoViagem` VARCHAR(255) NOT NULL,
    `localViagem` VARCHAR(255) NOT NULL,
    `justificativa` TEXT NOT NULL,
    `planoReposicao` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

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

    PRIMARY KEY (`id`, `candidatoId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LinhaDePesquisa` (
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
CREATE TABLE `ReservaSala` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `salaId` INTEGER NULL,
    `usuarioId` INTEGER NULL,
    `atividade` VARCHAR(255) NULL,
    `tipo` VARCHAR(255) NULL,
    `dias` VARCHAR(255) NULL,
    `dataInicio` DATE NULL,
    `dataTermino` DATE NULL,
    `horaInicio` VARCHAR(255) NULL,
    `horaTermino` VARCHAR(255) NULL,
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
CREATE INDEX `Avatar_usuarioId_idx` ON `Avatar`(`usuarioId`);

-- CreateIndex
CREATE UNIQUE INDEX `Edital_editalCodigo_key` ON `Edital`(`editalCodigo`);

-- CreateIndex
CREATE INDEX `Orientacao_professorId_idx` ON `Orientacao`(`professorId`);

-- CreateIndex
CREATE INDEX `Projeto_professorId_idx` ON `Projeto`(`professorId`);

-- CreateIndex
CREATE INDEX `Publicacao_tipoPublicacaoId_idx` ON `Publicacao`(`tipoPublicacaoId`);

-- CreateIndex
CREATE INDEX `RelUsuarioPublicacao_publicacaoId_idx` ON `RelUsuarioPublicacao`(`publicacaoId`);

-- CreateIndex
CREATE INDEX `RelUsuarioPublicacao_usuarioId_idx` ON `RelUsuarioPublicacao`(`usuarioId`);

-- AddForeignKey
ALTER TABLE `Avatar` ADD CONSTRAINT `Avatar_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `Candidato` ADD CONSTRAINT `Candidato_editalId_fkey` FOREIGN KEY (`editalId`) REFERENCES `Edital`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Candidato` ADD CONSTRAINT `Candidato_linhaPesquisaId_fkey` FOREIGN KEY (`linhaPesquisaId`) REFERENCES `LinhaDePesquisa`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CandidatoExperienciaAcademica` ADD CONSTRAINT `CandidatoExperienciaAcademica_candidatoId_fkey` FOREIGN KEY (`candidatoId`) REFERENCES `Candidato`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CandidatoPublicacao` ADD CONSTRAINT `CandidatoPublicacao_candidatoId_fkey` FOREIGN KEY (`candidatoId`) REFERENCES `Candidato`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CandidatoRecomendacao` ADD CONSTRAINT `CandidatoRecomendacao_candidatoId_fkey` FOREIGN KEY (`candidatoId`) REFERENCES `Candidato`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CandidatoRecomendacao` ADD CONSTRAINT `CandidatoRecomendacao_editalId_fkey` FOREIGN KEY (`editalId`) REFERENCES `Edital`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Orientacao` ADD CONSTRAINT `Orientacao_professorId_fkey` FOREIGN KEY (`professorId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `Premio` ADD CONSTRAINT `Premio_professorId_fkey` FOREIGN KEY (`professorId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `Projeto` ADD CONSTRAINT `Projeto_professorId_fkey` FOREIGN KEY (`professorId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `Publicacao` ADD CONSTRAINT `Publicacao_tipoPublicacaoId_fkey` FOREIGN KEY (`tipoPublicacaoId`) REFERENCES `TipoPublicacao`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `RelUsuarioPublicacao` ADD CONSTRAINT `RelUsuarioPublicacao_ibfk_1` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `RelUsuarioPublicacao` ADD CONSTRAINT `RelUsuarioPublicacao_ibfk_2` FOREIGN KEY (`publicacaoId`) REFERENCES `Publicacao`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `ReservaSala` ADD CONSTRAINT `ReservaSala_salaId_fkey` FOREIGN KEY (`salaId`) REFERENCES `Sala`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ReservaSala` ADD CONSTRAINT `ReservaSala_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
