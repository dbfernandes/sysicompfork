/*
  Warnings:

  - You are about to drop the column `CartaDoOrientador` on the `Candidate` table. All the data in the column will be lost.
  - You are about to drop the column `Curriculum` on the `Candidate` table. All the data in the column will be lost.
  - You are about to drop the column `PropostaDeTrabalho` on the `Candidate` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Candidate` DROP COLUMN `CartaDoOrientador`,
    DROP COLUMN `Curriculum`,
    DROP COLUMN `PropostaDeTrabalho`,
    MODIFY `Cotista` INTEGER NULL,
    MODIFY `Condicao` INTEGER NULL,
    MODIFY `Bolsista` INTEGER NULL;
