/*
  Warnings:

  - Added the required column `tipoFormacao` to the `LattesFormacaoAcademicaTitulacao` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `LattesFormacaoAcademicaTitulacao` ADD COLUMN `tipoFormacao` ENUM('GRADUACAO', 'ESPECIALIZACAO', 'MESTRADO', 'MESTRADO_PROFISSIONALIZANTE', 'DOUTORADO', 'POS_DOUTORADO', 'LIVRE_DOCENCIA', 'RESIDENCIA_MEDICA', 'CURSO_TECNICO_PROFISSIONALIZANTE', 'APERFEICOAMENTO', 'ENSINO_MEDIO', 'ENSINO_FUNDAMENTAL') NOT NULL;
