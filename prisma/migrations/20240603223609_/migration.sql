-- AlterTable
ALTER TABLE `Edital` MODIFY `dataInicio` VARCHAR(255) NOT NULL,
    MODIFY `dataFim` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `prorrogacoes` MODIFY `status` SMALLINT NULL;
