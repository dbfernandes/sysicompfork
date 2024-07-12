-- AlterTable
ALTER TABLE `prorrogacoes` MODIFY `status` SMALLINT NULL;

-- CreateTable
CREATE TABLE `Candidato` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `posicaoEdital` SMALLINT NULL,
    `senhaHash` VARCHAR(255) NOT NULL,
    `idEdital` VARCHAR(255) NOT NULL,
    `idLinhaPesquisa` INTEGER NULL,
    `nome` VARCHAR(60) NULL,
    `email` VARCHAR(50) NULL,
    `dataNascimento` DATE NULL,
    `sexo` VARCHAR(1) NULL,
    `nomeSocial` VARCHAR(60) NULL,
    `cep` VARCHAR(9) NULL,
    `uf` VARCHAR(2) NULL,
    `endereco` VARCHAR(160) NULL,
    `cidade` VARCHAR(40) NULL,
    `bairro` VARCHAR(50) NULL,
    `nacionalidade` VARCHAR(11) NULL,
    `telefone` VARCHAR(18) NULL,
    `telefoneSecundario` VARCHAR(18) NULL,
    `comoSoube` VARCHAR(100) NULL,
    `cursoDesejado` VARCHAR(191) NULL,
    `regime` VARCHAR(191) NULL,
    `cotista` BOOLEAN NULL,
    `cotistaTipo` VARCHAR(100) NULL,
    `condicao` BOOLEAN NULL,
    `condicaoTipo` VARCHAR(100) NULL,
    `bolsista` BOOLEAN NULL,
    `cursoGraduacao` VARCHAR(50) NULL,
    `instituicaoGraduacao` VARCHAR(50) NULL,
    `anoEgressoGraduacao` VARCHAR(191) NULL,
    `cursoPos` VARCHAR(50) NULL,
    `tipoPos` VARCHAR(30) NULL,
    `instituicaoPos` VARCHAR(50) NULL,
    `anoEgressoPos` VARCHAR(191) NULL,
    `tituloProposta` VARCHAR(100) NULL,
    `motivos` VARCHAR(1001) NULL,
    `nomeOrientador` VARCHAR(200) NULL,
    `Curriculum` LONGBLOB NULL,
    `CartaDoOrientador` LONGBLOB NULL,
    `PropostaDeTrabalho` LONGBLOB NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Candidato` ADD CONSTRAINT `Candidato_idEdital_fkey` FOREIGN KEY (`idEdital`) REFERENCES `Edital`(`editalId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Candidato` ADD CONSTRAINT `Candidato_idLinhaPesquisa_fkey` FOREIGN KEY (`idLinhaPesquisa`) REFERENCES `LinhasDePesquisa`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
