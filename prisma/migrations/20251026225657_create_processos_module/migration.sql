-- CreateTable
CREATE TABLE `Processo` (
    `id` VARCHAR(191) NOT NULL,
    `titulo` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(280) NOT NULL,
    `descricao` TEXT NULL,
    `xmlPath` VARCHAR(1024) NOT NULL,
    `previewPath` VARCHAR(1024) NULL,
    `origem` ENUM('MANUAL', 'IA', 'IMPORTADO') NOT NULL DEFAULT 'MANUAL',
    `bpmnVersion` VARCHAR(32) NULL,
    `isExecutable` BOOLEAN NULL,
    `criadoPorId` INTEGER NOT NULL,
    `collabRoomId` VARCHAR(255) NULL,
    `revisao` INTEGER NOT NULL DEFAULT 1,
    `ultimaGeracaoAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Processo_slug_key`(`slug`),
    UNIQUE INDEX `Processo_collabRoomId_key`(`collabRoomId`),
    INDEX `Processo_criadoPorId_idx`(`criadoPorId`),
    INDEX `Processo_slug_idx`(`slug`),
    INDEX `Processo_titulo_idx`(`titulo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tag` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(80) NOT NULL,
    `slug` VARCHAR(120) NOT NULL,
    `corHex` VARCHAR(9) NULL,
    `descricao` VARCHAR(255) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Tag_nome_key`(`nome`),
    UNIQUE INDEX `Tag_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProcessoTag` (
    `processoId` VARCHAR(191) NOT NULL,
    `tagId` INTEGER NOT NULL,

    INDEX `ProcessoTag_tagId_idx`(`tagId`),
    INDEX `ProcessoTag_processoId_idx`(`processoId`),
    PRIMARY KEY (`processoId`, `tagId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Processo` ADD CONSTRAINT `Processo_criadoPorId_fkey` FOREIGN KEY (`criadoPorId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProcessoTag` ADD CONSTRAINT `ProcessoTag_processoId_fkey` FOREIGN KEY (`processoId`) REFERENCES `Processo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProcessoTag` ADD CONSTRAINT `ProcessoTag_tagId_fkey` FOREIGN KEY (`tagId`) REFERENCES `Tag`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
