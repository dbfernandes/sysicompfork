/*
  Warnings:

  - You are about to drop the `Candidate` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CandidateAcademicExperience` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Candidate` DROP FOREIGN KEY `fk_Candidate_LinhaDePesquisa`;

-- DropTable
DROP TABLE `Candidate`;

-- DropTable
DROP TABLE `CandidateAcademicExperience`;
