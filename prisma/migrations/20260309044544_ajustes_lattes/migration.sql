/*
  Warnings:

  - A unique constraint covering the columns `[codigoInstituicaoEmpresa]` on the table `LattesInstituicaoEmpresa` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tipoFormacao` to the `LattesFormacaoAcademicaTitulacao` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizador` to the `LattesParticipacaoEvento` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `LattesFormacaoAcademicaTitulacao` ADD COLUMN `tipoFormacao` ENUM('GRADUACAO', 'ESPECIALIZACAO', 'MESTRADO', 'MESTRADO_PROFISSIONALIZANTE', 'DOUTORADO', 'POS_DOUTORADO', 'LIVRE_DOCENCIA', 'RESIDENCIA_MEDICA', 'CURSO_TECNICO_PROFISSIONALIZANTE', 'APERFEICOAMENTO', 'ENSINO_MEDIO', 'ENSINO_FUNDAMENTAL') NOT NULL;

-- AlterTable
ALTER TABLE `LattesParticipacaoEvento` ADD COLUMN `organizador` BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE `LattesVinculoAtuacaoProfissional` MODIFY `outrasInformacoes` VARCHAR(1000) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `LattesInstituicaoEmpresa_codigoInstituicaoEmpresa_key` ON `LattesInstituicaoEmpresa`(`codigoInstituicaoEmpresa`);
