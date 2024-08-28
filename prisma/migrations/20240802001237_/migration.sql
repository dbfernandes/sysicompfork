/*
  Warnings:

  - You are about to drop the column `CartaDoOrientador` on the `Candidato` table. All the data in the column will be lost.
  - You are about to drop the column `Curriculum` on the `Candidato` table. All the data in the column will be lost.
  - You are about to drop the column `PropostaDeTrabalho` on the `Candidato` table. All the data in the column will be lost.
  - You are about to drop the column `tokenResetSenha` on the `Candidato` table. All the data in the column will be lost.
  - You are about to drop the column `validadeTokenReset` on the `Candidato` table. All the data in the column will be lost.
  - You are about to drop the column `tokenResetSenha` on the `Usuario` table. All the data in the column will be lost.
  - You are about to drop the column `validadeTokenResetSenha` on the `Usuario` table. All the data in the column will be lost.
  - You are about to drop the `CandidatePublications` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Recommendations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SequelizeMeta` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Trancamentos` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `prorrogacoes` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[tokenResetarSenha]` on the table `Usuario` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `tokenResetSenha` ON `Usuario`;

-- AlterTable
ALTER TABLE `Candidato` DROP COLUMN `CartaDoOrientador`,
    DROP COLUMN `Curriculum`,
    DROP COLUMN `PropostaDeTrabalho`,
    DROP COLUMN `tokenResetSenha`,
    DROP COLUMN `validadeTokenReset`,
    ADD COLUMN `cartaDoOrientador` LONGBLOB NULL,
    ADD COLUMN `curriculum` LONGBLOB NULL,
    ADD COLUMN `propostaDeTrabalho` LONGBLOB NULL,
    ADD COLUMN `tokenResetarSenha` VARCHAR(255) NULL,
    ADD COLUMN `validarTokenResetada` DATETIME(0) NULL;

-- AlterTable
ALTER TABLE `Usuario` DROP COLUMN `tokenResetSenha`,
    DROP COLUMN `validadeTokenResetSenha`,
    ADD COLUMN `tokenResetarSenha` VARCHAR(255) NULL,
    ADD COLUMN `validadeTokenResetadaSenha` DATETIME(0) NULL;

-- DropTable
DROP TABLE `CandidatePublications`;

-- DropTable
DROP TABLE `Recommendations`;

-- DropTable
DROP TABLE `SequelizeMeta`;

-- DropTable
DROP TABLE `Trancamentos`;

-- DropTable
DROP TABLE `prorrogacoes`;

-- CreateTable
CREATE TABLE `CandidatoPublicacoes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idCandidate` INTEGER NOT NULL,
    `titulo` VARCHAR(255) NOT NULL,
    `ano` INTEGER NOT NULL,
    `local` VARCHAR(255) NULL,
    `tipo` INTEGER NOT NULL,
    `natureza` VARCHAR(255) NOT NULL,
    `autores` VARCHAR(255) NOT NULL,
    `ISSN` VARCHAR(300) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`, `idCandidate`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Recomendacoes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `tokenResetSenha` ON `Usuario`(`tokenResetarSenha`);
