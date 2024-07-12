-- CreateTable
CREATE TABLE `CandidatoExperienciaAcademica` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idCandidato` BIGINT NOT NULL,
    `instituicao` VARCHAR(60) NULL,
    `atividade` VARCHAR(60) NULL,
    `periodo` VARCHAR(30) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CandidatoExperienciaAcademica` ADD CONSTRAINT `CandidatoExperienciaAcademica_idCandidato_fkey` FOREIGN KEY (`idCandidato`) REFERENCES `Candidato`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
