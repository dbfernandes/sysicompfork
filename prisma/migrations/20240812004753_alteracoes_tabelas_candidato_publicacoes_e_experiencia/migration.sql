/*
  Warnings:

  - The primary key for the `CandidatoExperienciaAcademica` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `CandidateAcademicExperience` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CandidatePublications` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE `CandidatoExperienciaAcademica` DROP PRIMARY KEY,
    ADD PRIMARY KEY (`id`, `idCandidato`);

-- DropTable
DROP TABLE `CandidateAcademicExperience`;

-- DropTable
DROP TABLE `CandidatePublications`;

-- CreateTable
CREATE TABLE `CandidatoPublicacoes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idCandidato` BIGINT NOT NULL,
    `titulo` VARCHAR(255) NOT NULL,
    `ano` INTEGER NOT NULL,
    `local` VARCHAR(255) NULL,
    `tipo` INTEGER NOT NULL,
    `natureza` VARCHAR(255) NOT NULL,
    `autores` VARCHAR(255) NOT NULL,
    `ISSN` VARCHAR(300) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`, `idCandidato`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CandidatoPublicacoes` ADD CONSTRAINT `CandidatoPublicacoes_idCandidato_fkey` FOREIGN KEY (`idCandidato`) REFERENCES `Candidato`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
