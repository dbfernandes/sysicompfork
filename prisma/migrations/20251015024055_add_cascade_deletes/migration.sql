-- DropForeignKey
ALTER TABLE `defesafinalextra` DROP FOREIGN KEY `DefesaFinalExtra_defesaId_fkey`;

-- DropForeignKey
ALTER TABLE `defesaupload` DROP FOREIGN KEY `DefesaUpload_defesaId_fkey`;

-- DropForeignKey
ALTER TABLE `membrobanca` DROP FOREIGN KEY `MembroBanca_defesaId_fkey`;

-- DropForeignKey
ALTER TABLE `qualificacaoextra` DROP FOREIGN KEY `QualificacaoExtra_defesaId_fkey`;

-- AddForeignKey
ALTER TABLE `QualificacaoExtra` ADD CONSTRAINT `QualificacaoExtra_defesaId_fkey` FOREIGN KEY (`defesaId`) REFERENCES `Defesa`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DefesaFinalExtra` ADD CONSTRAINT `DefesaFinalExtra_defesaId_fkey` FOREIGN KEY (`defesaId`) REFERENCES `Defesa`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MembroBanca` ADD CONSTRAINT `MembroBanca_defesaId_fkey` FOREIGN KEY (`defesaId`) REFERENCES `Defesa`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DefesaUpload` ADD CONSTRAINT `DefesaUpload_defesaId_fkey` FOREIGN KEY (`defesaId`) REFERENCES `Defesa`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
