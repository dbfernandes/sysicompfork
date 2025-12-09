-- DropForeignKey
ALTER TABLE `DefesaFinalExtra` DROP FOREIGN KEY `DefesaFinalExtra_defesaId_fkey`;

-- DropForeignKey
ALTER TABLE `DefesaUpload` DROP FOREIGN KEY `DefesaUpload_defesaId_fkey`;

-- DropForeignKey
ALTER TABLE `MembroBanca` DROP FOREIGN KEY `MembroBanca_defesaId_fkey`;

-- DropForeignKey
ALTER TABLE `QualificacaoExtra` DROP FOREIGN KEY `QualificacaoExtra_defesaId_fkey`;

-- AddForeignKey
ALTER TABLE `QualificacaoExtra` ADD CONSTRAINT `QualificacaoExtra_defesaId_fkey` FOREIGN KEY (`defesaId`) REFERENCES `Defesa`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DefesaFinalExtra` ADD CONSTRAINT `DefesaFinalExtra_defesaId_fkey` FOREIGN KEY (`defesaId`) REFERENCES `Defesa`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MembroBanca` ADD CONSTRAINT `MembroBanca_defesaId_fkey` FOREIGN KEY (`defesaId`) REFERENCES `Defesa`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DefesaUpload` ADD CONSTRAINT `DefesaUpload_defesaId_fkey` FOREIGN KEY (`defesaId`) REFERENCES `Defesa`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
