/*
  Warnings:

  - You are about to alter the column `etapaAtual` on the `Candidate` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `TinyInt`.

*/
-- AlterTable
ALTER TABLE `Candidate` MODIFY `etapaAtual` TINYINT NULL;
