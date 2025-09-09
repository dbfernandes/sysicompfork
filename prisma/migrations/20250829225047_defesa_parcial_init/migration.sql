/*
  Warnings:

  - Added the required column `criadoPorId` to the `Defesa` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Defesa` DROP FOREIGN KEY `Defesa_candidatoId_fkey`;

-- DropForeignKey
ALTER TABLE `Defesa` DROP FOREIGN KEY `Defesa_orientadorId_fkey`;

-- AlterTable
ALTER TABLE `Defesa` ADD COLUMN `criadoPorId` INTEGER NOT NULL,
    MODIFY `candidatoId` VARCHAR(191) NULL,
    MODIFY `orientadorId` INTEGER NULL,
    MODIFY `tituloTrabalho` VARCHAR(191) NULL,
    MODIFY `dataHora` DATETIME(3) NULL,
    MODIFY `modalidade` ENUM('PRESENCIAL', 'ONLINE') NULL;

-- AddForeignKey
ALTER TABLE `Defesa` ADD CONSTRAINT `Defesa_candidatoId_fkey` FOREIGN KEY (`candidatoId`) REFERENCES `Candidato`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Defesa` ADD CONSTRAINT `Defesa_orientadorId_fkey` FOREIGN KEY (`orientadorId`) REFERENCES `Usuario`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Defesa` ADD CONSTRAINT `Defesa_criadoPorId_fkey` FOREIGN KEY (`criadoPorId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
