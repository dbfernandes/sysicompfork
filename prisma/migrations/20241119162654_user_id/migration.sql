/*
  Warnings:

  - You are about to drop the column `idUsuario` on the `Avatar` table. All the data in the column will be lost.
  - You are about to drop the column `idLattes` on the `Usuario` table. All the data in the column will be lost.
  - Added the required column `usuarioId` to the `Avatar` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Avatar` DROP FOREIGN KEY `Avatar_ibfk_1`;

-- AlterTable
ALTER TABLE `Avatar` DROP COLUMN `idUsuario`,
    ADD COLUMN `usuarioId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Usuario` DROP COLUMN `idLattes`,
    ADD COLUMN `lattesId` BIGINT NULL;

-- CreateIndex
CREATE INDEX `usuarioId` ON `Avatar`(`usuarioId`);

-- AddForeignKey
ALTER TABLE `Avatar` ADD CONSTRAINT `Avatar_ibfk_1` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
