/*
  Warnings:

  - A unique constraint covering the columns `[usuarioId,publicacaoId]` on the table `UsuarioPublicacao` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `UsuarioPublicacao_usuarioId_publicacaoId_key` ON `UsuarioPublicacao`(`usuarioId`, `publicacaoId`);
