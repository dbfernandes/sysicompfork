-- CreateTable
CREATE TABLE `Defesa` (
    `id` VARCHAR(191) NOT NULL,
    `tipo` ENUM('QUALIFICACAO', 'DEFESA_FINAL') NOT NULL,
    `nivel` ENUM('MESTRADO', 'DOUTORADO') NOT NULL,
    `candidatoId` VARCHAR(191) NOT NULL,
    `orientadorId` INTEGER NOT NULL,
    `coorientadorId` INTEGER NULL,
    `tituloTrabalho` VARCHAR(191) NOT NULL,
    `dataHora` DATETIME(3) NOT NULL,
    `modalidade` ENUM('PRESENCIAL', 'ONLINE') NOT NULL,
    `localOuLink` VARCHAR(191) NULL,
    `status` ENUM('RASCUNHO', 'AGUARDANDO_VALIDACAO', 'VALIDADO', 'DIVULGADO', 'CONCLUIDO', 'CANCELADO') NOT NULL DEFAULT 'RASCUNHO',
    `linhaPesquisaId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `usuarioId` INTEGER NULL,

    INDEX `Defesa_tipo_nivel_idx`(`tipo`, `nivel`),
    INDEX `Defesa_status_dataHora_idx`(`status`, `dataHora`),
    INDEX `Defesa_linhaPesquisaId_idx`(`linhaPesquisaId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `QualificacaoExtra` (
    `defesaId` VARCHAR(191) NOT NULL,
    `resumoOuAbstract` VARCHAR(191) NOT NULL,
    `palavrasChaves` VARCHAR(191) NOT NULL,
    `creditosMinimosOk` BOOLEAN NOT NULL,
    `presidenteOrigem` ENUM('ORIENTADOR', 'COORIENTADOR') NOT NULL,
    `doutoradoArtigoComprovado` BOOLEAN NULL,
    `artigoTitulo` VARCHAR(191) NULL,
    `artigoVeiculoOuDoi` VARCHAR(191) NULL,
    `autoavaliacaoPreenchida` BOOLEAN NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`defesaId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DefesaFinalExtra` (
    `defesaId` VARCHAR(191) NOT NULL,
    `resumoPt` VARCHAR(191) NOT NULL,
    `palavrasChavePt` VARCHAR(191) NOT NULL,
    `abstractEn` VARCHAR(191) NOT NULL,
    `keywordsEn` VARCHAR(191) NOT NULL,
    `idiomaTese` VARCHAR(191) NOT NULL,
    `creditosOk` BOOLEAN NOT NULL,
    `creditosExigidos` INTEGER NULL,
    `artigoEstratoSuperiorOk` BOOLEAN NOT NULL,
    `artigoTitulo` VARCHAR(191) NOT NULL,
    `artigoVeiculoOuDoi` VARCHAR(191) NOT NULL,
    `incluiuAgradecimentosObrigatorios` BOOLEAN NOT NULL,
    `textoAgradecimentos` VARCHAR(191) NULL,
    `autoavaliacaoPreenchida` BOOLEAN NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`defesaId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MembroBanca` (
    `id` VARCHAR(191) NOT NULL,
    `defesaId` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `instituicao` VARCHAR(191) NULL,
    `papel` ENUM('PRESIDENTE', 'MEMBRO') NOT NULL,
    `suplente` BOOLEAN NOT NULL DEFAULT false,
    `vinculo` ENUM('INTERNO', 'EXTERNO') NOT NULL,
    `rsvpToken` VARCHAR(191) NULL,
    `confirmouPresenca` BOOLEAN NOT NULL DEFAULT false,
    `confirmadoEm` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `MembroBanca_rsvpToken_key`(`rsvpToken`),
    INDEX `MembroBanca_defesaId_suplente_idx`(`defesaId`, `suplente`),
    INDEX `MembroBanca_vinculo_suplente_idx`(`vinculo`, `suplente`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DefesaUpload` (
    `id` VARCHAR(191) NOT NULL,
    `defesaId` VARCHAR(191) NOT NULL,
    `tipo` ENUM('PROPOSTA_PDF', 'TESE_PDF', 'ARTIGO_COMPROVANTE_PDF', 'OUTRO') NOT NULL,
    `path` VARCHAR(191) NOT NULL,
    `originalName` VARCHAR(191) NOT NULL,
    `mimeType` VARCHAR(191) NOT NULL,
    `size` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `DefesaUpload_defesaId_tipo_idx`(`defesaId`, `tipo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Defesa` ADD CONSTRAINT `Defesa_candidatoId_fkey` FOREIGN KEY (`candidatoId`) REFERENCES `Candidato`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Defesa` ADD CONSTRAINT `Defesa_orientadorId_fkey` FOREIGN KEY (`orientadorId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Defesa` ADD CONSTRAINT `Defesa_coorientadorId_fkey` FOREIGN KEY (`coorientadorId`) REFERENCES `Usuario`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Defesa` ADD CONSTRAINT `Defesa_linhaPesquisaId_fkey` FOREIGN KEY (`linhaPesquisaId`) REFERENCES `LinhaPesquisa`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Defesa` ADD CONSTRAINT `Defesa_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `QualificacaoExtra` ADD CONSTRAINT `QualificacaoExtra_defesaId_fkey` FOREIGN KEY (`defesaId`) REFERENCES `Defesa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DefesaFinalExtra` ADD CONSTRAINT `DefesaFinalExtra_defesaId_fkey` FOREIGN KEY (`defesaId`) REFERENCES `Defesa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MembroBanca` ADD CONSTRAINT `MembroBanca_defesaId_fkey` FOREIGN KEY (`defesaId`) REFERENCES `Defesa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DefesaUpload` ADD CONSTRAINT `DefesaUpload_defesaId_fkey` FOREIGN KEY (`defesaId`) REFERENCES `Defesa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
