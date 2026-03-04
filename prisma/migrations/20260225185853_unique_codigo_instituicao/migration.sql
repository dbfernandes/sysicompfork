/*
  Warnings:

  - A unique constraint covering the columns `[codigoInstituicaoEmpresa]` on the table `LattesInstituicaoEmpresa` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `LattesInstituicaoEmpresa_codigoInstituicaoEmpresa_key` ON `LattesInstituicaoEmpresa`(`codigoInstituicaoEmpresa`);
