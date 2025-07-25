-- AlterTable
ALTER TABLE `CandidatoRecomendacao` MODIFY `prazo` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `Edital` MODIFY `dataInicio` DATETIME(3) NOT NULL,
    MODIFY `dataFim` DATETIME(3) NOT NULL;
