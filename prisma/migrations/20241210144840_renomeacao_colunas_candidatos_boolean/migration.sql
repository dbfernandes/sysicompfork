/*
  Warnings:

  - You are about to alter the column `cotista` on the `Candidato` table. The data in that column could be lost. The data in that column will be cast from `SmallInt` to `TinyInt`.
  - You are about to alter the column `condicao` on the `Candidato` table. The data in that column could be lost. The data in that column will be cast from `SmallInt` to `TinyInt`.
  - You are about to alter the column `bolsista` on the `Candidato` table. The data in that column could be lost. The data in that column will be cast from `SmallInt` to `TinyInt`.

*/
-- AlterTable
ALTER TABLE `Candidato` MODIFY `cotista` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `condicao` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `bolsista` BOOLEAN NOT NULL DEFAULT false;
