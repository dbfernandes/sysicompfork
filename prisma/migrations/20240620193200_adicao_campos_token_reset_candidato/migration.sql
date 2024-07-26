-- AlterTable
ALTER TABLE `Candidato` ADD COLUMN `tokenResetSenha` VARCHAR(255) NULL,
    ADD COLUMN `validadeTokenReset` DATETIME(0) NULL;
