-- AlterTable
ALTER TABLE `DefesaFinalExtra` MODIFY `resumoPt` LONGTEXT NOT NULL,
    MODIFY `palavrasChavePt` TEXT NOT NULL,
    MODIFY `abstractEn` LONGTEXT NOT NULL,
    MODIFY `keywordsEn` TEXT NOT NULL,
    MODIFY `idiomaTese` VARCHAR(500) NOT NULL;

-- CreateTable
CREATE TABLE `LattesAgenciaFinanciadora` (
    `agenciaFinanciadoraId` INTEGER NOT NULL AUTO_INCREMENT,
    `nomeAgenciaFinanciadora` VARCHAR(200) NULL,

    PRIMARY KEY (`agenciaFinanciadoraId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LattesAreaConhecimento` (
    `areaConhecimentoId` INTEGER NOT NULL AUTO_INCREMENT,
    `grandeAreaConhecimento` VARCHAR(50) NULL,
    `areaConhecimento` VARCHAR(100) NULL,
    `subAreaConhecimento` VARCHAR(100) NULL,
    `especialidade` VARCHAR(100) NULL,
    `termoCompleto` VARCHAR(350) NULL,

    PRIMARY KEY (`areaConhecimentoId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LattesPalavraChave` (
    `palavraChaveId` INTEGER NOT NULL AUTO_INCREMENT,
    `nomePalavraChave` VARCHAR(150) NULL,

    PRIMARY KEY (`palavraChaveId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LattesIdioma` (
    `idiomaId` INTEGER NOT NULL AUTO_INCREMENT,
    `nomeIdioma` VARCHAR(50) NULL,

    PRIMARY KEY (`idiomaId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LattesEndereco` (
    `enderecoId` INTEGER NOT NULL AUTO_INCREMENT,
    `codigoInstituicaoEmpresa` VARCHAR(25) NULL,
    `codigoOrgaoInstituicaoEmpresa` VARCHAR(25) NULL,
    `codigoUnidadeInstituicaoEmpresa` VARCHAR(25) NULL,
    `nomeInstituicaoEmpresa` VARCHAR(200) NULL,
    `nomeOrgaoInstituicaoEmpresa` VARCHAR(200) NULL,
    `nomeUnidadeInstituicaoEmpresa` VARCHAR(200) NULL,
    `logradouro` VARCHAR(200) NULL,
    `cidade` VARCHAR(100) NULL,
    `uf` CHAR(2) NULL,
    `cep` VARCHAR(15) NULL,
    `pais` VARCHAR(50) NULL,
    `caixaPostal` VARCHAR(20) NULL,
    `bairro` VARCHAR(100) NULL,
    `ddd` VARCHAR(5) NULL,
    `telefone` VARCHAR(30) NULL,
    `ramal` VARCHAR(10) NULL,
    `fax` VARCHAR(30) NULL,
    `email` VARCHAR(200) NULL,
    `homePage` VARCHAR(200) NULL,

    PRIMARY KEY (`enderecoId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LattesInstituicaoEmpresa` (
    `instituicaoEmpresaId` INTEGER NOT NULL AUTO_INCREMENT,
    `nomeInstituicaoEmpresa` VARCHAR(200) NULL,
    `siglaInstituicaoEmpresa` VARCHAR(50) NULL,
    `codigoInstituicaoEmpresa` VARCHAR(25) NULL,

    PRIMARY KEY (`instituicaoEmpresaId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LattesOrgaoInstituicaoEmpresa` (
    `orgaoInstituicaoEmpresaId` INTEGER NOT NULL AUTO_INCREMENT,
    `instituicaoEmpresaId` INTEGER NOT NULL,
    `nomeOrgaoInstituicaoEmpresa` VARCHAR(200) NULL,
    `codigoOrgaoInstituicaoEmpresa` VARCHAR(25) NULL,

    INDEX `LattesOrgaoInstituicaoEmpresa_instituicaoEmpresaId_idx`(`instituicaoEmpresaId`),
    PRIMARY KEY (`orgaoInstituicaoEmpresaId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LattesUnidadeInstituicaoEmpresa` (
    `unidadeInstituicaoEmpresaId` INTEGER NOT NULL AUTO_INCREMENT,
    `instituicaoEmpresaId` INTEGER NOT NULL,
    `orgaoInstituicaoEmpresaId` INTEGER NULL,
    `nomeUnidadeInstituicaoEmpresa` VARCHAR(200) NULL,
    `codigoUnidadeInstituicaoEmpresa` VARCHAR(25) NULL,

    INDEX `LattesUnidadeInstituicaoEmpresa_instituicaoEmpresaId_idx`(`instituicaoEmpresaId`),
    INDEX `LattesUnidadeInstituicaoEmpresa_orgaoInstituicaoEmpresaId_idx`(`orgaoInstituicaoEmpresaId`),
    PRIMARY KEY (`unidadeInstituicaoEmpresaId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LattesProfessor` (
    `usuarioId` INTEGER NOT NULL,
    `professorId` INTEGER NOT NULL AUTO_INCREMENT,
    `numeroCurriculo` CHAR(20) NOT NULL,
    `nomeProfessor` VARCHAR(200) NOT NULL,
    `nomeEmCitacoesProfessor` VARCHAR(300) NULL,
    `enderecoResidencialId` INTEGER NULL,
    `logradouroResidencial` VARCHAR(250) NULL,
    `enderecoProfissionalId` INTEGER NULL,
    `logradouroProfissional` VARCHAR(250) NULL,
    `instituicaoEmpresaId` INTEGER NULL,
    `unidadeInstituicaoEmpresaId` INTEGER NULL,
    `orgaoInstituicaoEmpresaId` INTEGER NULL,
    `dataUltimaAtualizacaoCurriculo` DATETIME(3) NOT NULL,
    `dataUltimaPublicacaoCurriculo` DATE NOT NULL,
    `linkParaCurriculo` VARCHAR(150) NOT NULL,
    `nacionalidadeProfessor` VARCHAR(50) NULL,
    `paisNascimentoProfessor` VARCHAR(50) NULL,
    `ufNascimentoProfessor` CHAR(2) NULL,
    `cidadeNascimentoProfessor` VARCHAR(50) NULL,
    `paisNascionalidadeProfessor` VARCHAR(50) NULL,

    UNIQUE INDEX `LattesProfessor_usuarioId_key`(`usuarioId`),
    INDEX `LattesProfessor_enderecoResidencialId_idx`(`enderecoResidencialId`),
    INDEX `LattesProfessor_enderecoProfissionalId_idx`(`enderecoProfissionalId`),
    INDEX `LattesProfessor_instituicaoEmpresaId_idx`(`instituicaoEmpresaId`),
    INDEX `LattesProfessor_orgaoInstituicaoEmpresaId_idx`(`orgaoInstituicaoEmpresaId`),
    INDEX `LattesProfessor_unidadeInstituicaoEmpresaId_idx`(`unidadeInstituicaoEmpresaId`),
    INDEX `LattesProfessor_numeroCurriculo_idx`(`numeroCurriculo`),
    PRIMARY KEY (`professorId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LattesContatoProfessor` (
    `professorId` INTEGER NOT NULL,
    `enderecoEletronico` VARCHAR(200) NULL,
    `enderecoParaHomepage` VARCHAR(200) NULL,
    `dddTelefone` VARCHAR(5) NULL,
    `numeroTelefone` VARCHAR(30) NULL,
    `dddFax` VARCHAR(5) NULL,
    `numeroFax` VARCHAR(30) NULL,

    INDEX `LattesContatoProfessor_professorId_idx`(`professorId`),
    PRIMARY KEY (`professorId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LattesAreaAtuacao` (
    `professorId` INTEGER NOT NULL,
    `sequenciaAreaAtuacao` INTEGER NOT NULL,
    `grandeAreaAtuacao` VARCHAR(50) NULL,
    `areaAtuacao` VARCHAR(100) NULL,
    `subAreaAtuacao` VARCHAR(100) NULL,
    `especialidade` VARCHAR(100) NULL,
    `termoCompleto` VARCHAR(350) NULL,

    INDEX `LattesAreaAtuacao_professorId_idx`(`professorId`),
    PRIMARY KEY (`professorId`, `sequenciaAreaAtuacao`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LattesIdiomasProfessor` (
    `professorId` INTEGER NOT NULL,
    `idiomaId` INTEGER NOT NULL,
    `proficienciaLeitura` VARCHAR(25) NULL,
    `proficienciaFala` VARCHAR(25) NULL,
    `proficienciaEscrita` VARCHAR(25) NULL,
    `proficienciaCompreensao` VARCHAR(25) NULL,

    INDEX `LattesIdiomasProfessor_idiomaId_idx`(`idiomaId`),
    INDEX `LattesIdiomasProfessor_professorId_idx`(`professorId`),
    PRIMARY KEY (`professorId`, `idiomaId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LattesCurso` (
    `cursoId` INTEGER NOT NULL AUTO_INCREMENT,
    `nomeCurso` VARCHAR(150) NULL,
    `codigoCurso` VARCHAR(25) NULL,

    PRIMARY KEY (`cursoId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LattesLinhaDePesquisa` (
    `linhaDePesquisaId` INTEGER NOT NULL AUTO_INCREMENT,
    `nomeLinhaDePesquisa` VARCHAR(150) NULL,

    PRIMARY KEY (`linhaDePesquisaId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LattesOrientador` (
    `orientadorId` INTEGER NOT NULL AUTO_INCREMENT,
    `nomeOrientador` VARCHAR(150) NULL,

    PRIMARY KEY (`orientadorId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LattesFormacaoAcademicaTitulacao` (
    `professorId` INTEGER NOT NULL,
    `sequenciaFormacaoAcademica` INTEGER NOT NULL,
    `nivelFormacaoAcademica` VARCHAR(50) NULL,
    `codigoCurso` VARCHAR(25) NULL,
    `nomeCurso` VARCHAR(150) NULL,
    `codigoInstituicaoEmpresa` VARCHAR(25) NULL,
    `nomeInstituicaoEmpresa` VARCHAR(200) NULL,
    `statusDoCurso` ENUM('EM_ANDAMENTO', 'CONCLUIDO', 'INCOMPLETO') NULL,
    `anoInicio` INTEGER NULL,
    `anoConclusao` INTEGER NULL,
    `anoObtencaoTitulo` INTEGER NULL,
    `tituloTrabalhoConclusaoCurso` VARCHAR(350) NULL,
    `nomeOrientador` VARCHAR(150) NULL,
    `tipoBolsa` VARCHAR(50) NULL,
    `codigoAgenciaFinanciadora` VARCHAR(25) NULL,
    `nomeAgenciaFinanciadora` VARCHAR(200) NULL,
    `codigoInstituicaoEmpresaOutra` VARCHAR(25) NULL,
    `nomeInstituicaoEmpresaOutra` VARCHAR(200) NULL,
    `codigoOrgaoInstituicaoEmpresa` VARCHAR(25) NULL,
    `nomeOrgaoInstituicaoEmpresa` VARCHAR(200) NULL,
    `codigoUnidadeInstituicaoEmpresa` VARCHAR(25) NULL,
    `nomeUnidadeInstituicaoEmpresa` VARCHAR(200) NULL,
    `cursoId` INTEGER NULL,
    `instituicaoEmpresaId` INTEGER NULL,
    `orgaoInstituicaoEmpresaId` INTEGER NULL,
    `unidadeInstituicaoEmpresaId` INTEGER NULL,
    `orientadorId` INTEGER NULL,
    `agenciaFinanciadoraId` INTEGER NULL,

    INDEX `LattesFormacaoAcademicaTitulacao_agenciaFinanciadoraId_idx`(`agenciaFinanciadoraId`),
    INDEX `LattesFormacaoAcademicaTitulacao_cursoId_idx`(`cursoId`),
    INDEX `LattesFormacaoAcademicaTitulacao_instituicaoEmpresaId_idx`(`instituicaoEmpresaId`),
    INDEX `LattesFormacaoAcademicaTitulacao_orgaoInstituicaoEmpresaId_idx`(`orgaoInstituicaoEmpresaId`),
    INDEX `LattesFormacaoAcademicaTitulacao_unidadeInstituicaoEmpresaId_idx`(`unidadeInstituicaoEmpresaId`),
    INDEX `LattesFormacaoAcademicaTitulacao_orientadorId_idx`(`orientadorId`),
    INDEX `LattesFormacaoAcademicaTitulacao_professorId_idx`(`professorId`),
    PRIMARY KEY (`professorId`, `sequenciaFormacaoAcademica`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LattesFormacaoAcademicaTitulacaoAreaConhecimento` (
    `professorId` INTEGER NOT NULL,
    `sequenciaFormacaoAcademica` INTEGER NOT NULL,
    `areaConhecimentoId` INTEGER NOT NULL,

    INDEX `LattesFormacaoAcademicaTitulacaoAreaConhecimento_areaConheci_idx`(`areaConhecimentoId`),
    INDEX `LattesFormacaoAcademicaTitulacaoAreaConhecimento_professorId_idx`(`professorId`),
    PRIMARY KEY (`professorId`, `sequenciaFormacaoAcademica`, `areaConhecimentoId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LattesFormacaoAcademicaTitulacaoPalavraChave` (
    `professorId` INTEGER NOT NULL,
    `sequenciaFormacaoAcademica` INTEGER NOT NULL,
    `palavraChaveId` INTEGER NOT NULL,

    INDEX `LattesFormacaoAcademicaTitulacaoPalavraChave_palavraChaveId_idx`(`palavraChaveId`),
    INDEX `LattesFormacaoAcademicaTitulacaoPalavraChave_professorId_idx`(`professorId`),
    PRIMARY KEY (`professorId`, `sequenciaFormacaoAcademica`, `palavraChaveId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LattesAtividadeProfissional` (
    `professorId` INTEGER NOT NULL,
    `sequenciaAtividadeProfissional` INTEGER NOT NULL,
    `instituicaoEmpresaId` INTEGER NOT NULL,
    `unidadeInstituicaoEmpresaId` INTEGER NULL,
    `orgaoInstituicaoEmpresaId` INTEGER NULL,
    `tipoAtividadeProfissional` VARCHAR(50) NULL,
    `linhaDePesquisaId` INTEGER NULL,
    `disciplina` VARCHAR(150) NULL,
    `codigoCurso` VARCHAR(25) NULL,
    `cursoId` INTEGER NULL,
    `unidadeId` VARCHAR(25) NULL,
    `orgaoId` VARCHAR(25) NULL,
    `nomeUnidade` VARCHAR(150) NULL,
    `nomeOrgao` VARCHAR(150) NULL,
    `nomeCurso` VARCHAR(150) NULL,

    INDEX `LattesAtividadeProfissional_professorId_idx`(`professorId`),
    INDEX `LattesAtividadeProfissional_instituicaoEmpresaId_idx`(`instituicaoEmpresaId`),
    INDEX `LattesAtividadeProfissional_unidadeInstituicaoEmpresaId_idx`(`unidadeInstituicaoEmpresaId`),
    INDEX `LattesAtividadeProfissional_orgaoInstituicaoEmpresaId_idx`(`orgaoInstituicaoEmpresaId`),
    INDEX `LattesAtividadeProfissional_cursoId_idx`(`cursoId`),
    INDEX `LattesAtividadeProfissional_linhaDePesquisaId_idx`(`linhaDePesquisaId`),
    PRIMARY KEY (`professorId`, `sequenciaAtividadeProfissional`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LattesVinculoAtuacaoProfissional` (
    `professorId` INTEGER NOT NULL,
    `sequenciaAtividadeProfissional` INTEGER NOT NULL,
    `sequenciaVinculoAtuacaoProfissional` INTEGER NOT NULL,
    `tipoVinculoAtuacaoProfissional` VARCHAR(50) NULL,
    `regimeTrabalho` VARCHAR(50) NULL,
    `enquadramentoFuncional` VARCHAR(50) NULL,
    `cargaHorariaSemanal` INTEGER NULL,
    `anoInicio` INTEGER NULL,
    `anoFim` INTEGER NULL,
    `outrasInformacoes` VARCHAR(250) NULL,

    INDEX `LattesVinculoAtuacaoProfissional_professorId_idx`(`professorId`),
    PRIMARY KEY (`professorId`, `sequenciaAtividadeProfissional`, `sequenciaVinculoAtuacaoProfissional`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LattesProjeto` (
    `projetoId` INTEGER NOT NULL AUTO_INCREMENT,
    `professorId` INTEGER NOT NULL,
    `tituloProjeto` VARCHAR(350) NULL,
    `anoInicioProjeto` INTEGER NOT NULL,
    `anoFimProjeto` INTEGER NULL,
    `naturezaProjeto` VARCHAR(50) NULL,
    `situacaoProjeto` VARCHAR(50) NULL,
    `descricaoProjeto` TEXT NULL,
    `identificadorProjeto` VARCHAR(100) NULL,

    INDEX `LattesProjeto_professorId_idx`(`professorId`),
    PRIMARY KEY (`projetoId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LattesParticipacaoEmProjeto` (
    `projetoId` INTEGER NOT NULL,
    `professorId` INTEGER NOT NULL,
    `tipoParticipacao` VARCHAR(50) NULL,

    INDEX `LattesParticipacaoEmProjeto_projetoId_idx`(`projetoId`),
    INDEX `LattesParticipacaoEmProjeto_professorId_idx`(`professorId`),
    PRIMARY KEY (`projetoId`, `professorId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LattesFinanciamentoProjeto` (
    `projetoId` INTEGER NOT NULL,
    `agenciaFinanciadoraId` INTEGER NOT NULL,
    `naturezaFinanciamento` VARCHAR(50) NULL,

    INDEX `LattesFinanciamentoProjeto_projetoId_idx`(`projetoId`),
    INDEX `LattesFinanciamentoProjeto_agenciaFinanciadoraId_idx`(`agenciaFinanciadoraId`),
    PRIMARY KEY (`projetoId`, `agenciaFinanciadoraId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LattesPremioOuTitulo` (
    `premioOuTituloId` INTEGER NOT NULL AUTO_INCREMENT,
    `professorId` INTEGER NOT NULL,
    `nomePremioOuTitulo` VARCHAR(250) NULL,
    `nomeEntidadePromotora` VARCHAR(250) NULL,
    `anoPremioOuTitulo` INTEGER NOT NULL,

    INDEX `LattesPremioOuTitulo_professorId_idx`(`professorId`),
    PRIMARY KEY (`premioOuTituloId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LattesProducaoTecnica` (
    `producaoTecnicaId` INTEGER NOT NULL AUTO_INCREMENT,
    `professorId` INTEGER NOT NULL,
    `tipoProducaoTecnica` VARCHAR(50) NULL,
    `tituloProducaoTecnica` VARCHAR(350) NULL,
    `anoProducaoTecnica` INTEGER NOT NULL,
    `naturezaProducaoTecnica` VARCHAR(25) NULL,
    `meioDivulgacao` VARCHAR(50) NULL,
    `homePageDoTrabalho` VARCHAR(200) NULL,
    `flagRelevancia` VARCHAR(5) NULL,

    INDEX `LattesProducaoTecnica_professorId_idx`(`professorId`),
    PRIMARY KEY (`producaoTecnicaId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LattesAutorProducaoTecnica` (
    `producaoTecnicaId` INTEGER NOT NULL,
    `professorId` INTEGER NOT NULL,

    INDEX `LattesAutorProducaoTecnica_producaoTecnicaId_idx`(`producaoTecnicaId`),
    INDEX `LattesAutorProducaoTecnica_professorId_idx`(`professorId`),
    PRIMARY KEY (`producaoTecnicaId`, `professorId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LattesProducaoTecnicaAreaConhecimento` (
    `producaoTecnicaId` INTEGER NOT NULL,
    `areaConhecimentoId` INTEGER NOT NULL,

    INDEX `LattesProducaoTecnicaAreaConhecimento_producaoTecnicaId_idx`(`producaoTecnicaId`),
    INDEX `LattesProducaoTecnicaAreaConhecimento_areaConhecimentoId_idx`(`areaConhecimentoId`),
    PRIMARY KEY (`producaoTecnicaId`, `areaConhecimentoId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LattesProducaoTecnicaPalavraChave` (
    `producaoTecnicaId` INTEGER NOT NULL,
    `palavraChaveId` INTEGER NOT NULL,

    INDEX `LattesProducaoTecnicaPalavraChave_producaoTecnicaId_idx`(`producaoTecnicaId`),
    INDEX `LattesProducaoTecnicaPalavraChave_palavraChaveId_idx`(`palavraChaveId`),
    PRIMARY KEY (`producaoTecnicaId`, `palavraChaveId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LattesPatenteRegistro` (
    `patenteRegistroId` INTEGER NOT NULL AUTO_INCREMENT,
    `producaoTecnicaId` INTEGER NOT NULL,
    `numeroPatenteRegistro` VARCHAR(50) NULL,
    `dataDeposito` DATE NULL,
    `dataConcessao` DATE NULL,
    `codigoInstituicaoEmpresaDepositante` VARCHAR(25) NULL,
    `nomeInstituicaoEmpresaDepositante` VARCHAR(200) NULL,

    INDEX `LattesPatenteRegistro_producaoTecnicaId_idx`(`producaoTecnicaId`),
    PRIMARY KEY (`patenteRegistroId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LattesExtratoQualis` (
    `extratoQualisId` INTEGER NOT NULL AUTO_INCREMENT,
    `nomeExtratoQualis` VARCHAR(10) NULL,

    PRIMARY KEY (`extratoQualisId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LattesPeriodicoQualis` (
    `periodicoQualisId` INTEGER NOT NULL AUTO_INCREMENT,
    `issn` VARCHAR(15) NULL,
    `tituloPeriodico` VARCHAR(200) NULL,
    `extratoQualisId` INTEGER NOT NULL,
    `anoBase` INTEGER NOT NULL,

    INDEX `LattesPeriodicoQualis_extratoQualisId_idx`(`extratoQualisId`),
    INDEX `LattesPeriodicoQualis_issn_idx`(`issn`),
    PRIMARY KEY (`periodicoQualisId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LattesProducaoBibliografica` (
    `producaoBibliograficaId` INTEGER NOT NULL AUTO_INCREMENT,
    `professorId` INTEGER NOT NULL,
    `tipoProducaoBibliografica` VARCHAR(50) NULL,
    `tituloProducaoBibliografica` VARCHAR(350) NULL,
    `anoProducaoBibliografica` INTEGER NOT NULL,
    `naturezaProducaoBibliografica` VARCHAR(25) NULL,
    `localPublicacaoProducaoBibliografica` VARCHAR(150) NULL,
    `issn` VARCHAR(15) NULL,
    `isbn` VARCHAR(25) NULL,
    `doi` VARCHAR(100) NULL,
    `nomeEvento` VARCHAR(250) NULL,
    `cidadeEvento` VARCHAR(50) NULL,
    `paisEvento` VARCHAR(50) NULL,
    `ufEvento` CHAR(2) NULL,
    `paginaInicial` VARCHAR(15) NULL,
    `paginaFinal` VARCHAR(15) NULL,
    `volume` VARCHAR(10) NULL,
    `fasciculo` VARCHAR(10) NULL,
    `serie` VARCHAR(10) NULL,
    `editora` VARCHAR(150) NULL,
    `edicao` VARCHAR(10) NULL,
    `cidadePublicacao` VARCHAR(50) NULL,
    `paisPublicacao` VARCHAR(50) NULL,
    `idiomaPublicacao` VARCHAR(50) NULL,
    `meioDivulgacao` VARCHAR(50) NULL,
    `homePageDoTrabalho` VARCHAR(200) NULL,
    `flagRelevancia` VARCHAR(5) NULL,
    `periodicoQualisId` INTEGER NULL,

    INDEX `LattesProducaoBibliografica_professorId_idx`(`professorId`),
    INDEX `LattesProducaoBibliografica_periodicoQualisId_idx`(`periodicoQualisId`),
    INDEX `LattesProducaoBibliografica_issn_idx`(`issn`),
    INDEX `LattesProducaoBibliografica_doi_idx`(`doi`),
    PRIMARY KEY (`producaoBibliograficaId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LattesAutorProducaoBibliografica` (
    `producaoBibliograficaId` INTEGER NOT NULL,
    `professorId` INTEGER NOT NULL,

    INDEX `LattesAutorProducaoBibliografica_producaoBibliograficaId_idx`(`producaoBibliograficaId`),
    INDEX `LattesAutorProducaoBibliografica_professorId_idx`(`professorId`),
    PRIMARY KEY (`producaoBibliograficaId`, `professorId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LattesProducaoBibliograficaPalavraChave` (
    `producaoBibliograficaId` INTEGER NOT NULL,
    `palavraChaveId` INTEGER NOT NULL,

    INDEX `LattesProducaoBibliograficaPalavraChave_producaoBibliografic_idx`(`producaoBibliograficaId`),
    INDEX `LattesProducaoBibliograficaPalavraChave_palavraChaveId_idx`(`palavraChaveId`),
    PRIMARY KEY (`producaoBibliograficaId`, `palavraChaveId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LattesProducaoBibliograficaAreaConhecimento` (
    `producaoBibliograficaId` INTEGER NOT NULL,
    `areaConhecimentoId` INTEGER NOT NULL,

    INDEX `LattesProducaoBibliograficaAreaConhecimento_producaoBibliogr_idx`(`producaoBibliograficaId`),
    INDEX `LattesProducaoBibliograficaAreaConhecimento_areaConhecimento_idx`(`areaConhecimentoId`),
    PRIMARY KEY (`producaoBibliograficaId`, `areaConhecimentoId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LattesOrientacaoSupervisao` (
    `orientacaoSupervisaoId` INTEGER NOT NULL AUTO_INCREMENT,
    `professorId` INTEGER NOT NULL,
    `naturezaOrientacaoSupervisao` VARCHAR(25) NULL,
    `tipoOrientacaoSupervisao` VARCHAR(50) NULL,
    `statusOrientacaoSupervisao` VARCHAR(50) NULL,
    `tituloOrientacaoSupervisao` VARCHAR(350) NULL,
    `anoOrientacaoSupervisao` INTEGER NOT NULL,
    `nomeOrientado` VARCHAR(200) NULL,
    `nomeInstituicao` VARCHAR(200) NULL,
    `nomeCurso` VARCHAR(200) NULL,

    INDEX `LattesOrientacaoSupervisao_professorId_idx`(`professorId`),
    PRIMARY KEY (`orientacaoSupervisaoId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LattesOrientacaoSupervisaoAreaConhecimento` (
    `orientacaoSupervisaoId` INTEGER NOT NULL,
    `areaConhecimentoId` INTEGER NOT NULL,

    INDEX `LattesOrientacaoSupervisaoAreaConhecimento_orientacaoSupervi_idx`(`orientacaoSupervisaoId`),
    INDEX `LattesOrientacaoSupervisaoAreaConhecimento_areaConhecimentoI_idx`(`areaConhecimentoId`),
    PRIMARY KEY (`orientacaoSupervisaoId`, `areaConhecimentoId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LattesOrientacaoSupervisaoPalavraChave` (
    `orientacaoSupervisaoId` INTEGER NOT NULL,
    `palavraChaveId` INTEGER NOT NULL,

    INDEX `LattesOrientacaoSupervisaoPalavraChave_orientacaoSupervisaoI_idx`(`orientacaoSupervisaoId`),
    INDEX `LattesOrientacaoSupervisaoPalavraChave_palavraChaveId_idx`(`palavraChaveId`),
    PRIMARY KEY (`orientacaoSupervisaoId`, `palavraChaveId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LattesEvento` (
    `eventoId` INTEGER NOT NULL AUTO_INCREMENT,
    `nomeEvento` VARCHAR(250) NULL,
    `anoEvento` INTEGER NOT NULL,
    `paisEvento` VARCHAR(50) NULL,
    `ufEvento` CHAR(2) NULL,
    `cidadeEvento` VARCHAR(50) NULL,
    `naturezaEvento` VARCHAR(25) NULL,

    PRIMARY KEY (`eventoId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LattesParticipacaoEvento` (
    `eventoId` INTEGER NOT NULL,
    `professorId` INTEGER NOT NULL,

    INDEX `LattesParticipacaoEvento_eventoId_idx`(`eventoId`),
    INDEX `LattesParticipacaoEvento_professorId_idx`(`professorId`),
    PRIMARY KEY (`eventoId`, `professorId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LattesParticipacaoEventoAreaConhecimento` (
    `eventoId` INTEGER NOT NULL,
    `professorId` INTEGER NOT NULL,
    `areaConhecimentoId` INTEGER NOT NULL,

    INDEX `LattesParticipacaoEventoAreaConhecimento_areaConhecimentoId_idx`(`areaConhecimentoId`),
    INDEX `LattesParticipacaoEventoAreaConhecimento_professorId_idx`(`professorId`),
    PRIMARY KEY (`eventoId`, `professorId`, `areaConhecimentoId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LattesParticipacaoEventoPalavraChave` (
    `eventoId` INTEGER NOT NULL,
    `professorId` INTEGER NOT NULL,
    `palavraChaveId` INTEGER NOT NULL,

    INDEX `LattesParticipacaoEventoPalavraChave_palavraChaveId_idx`(`palavraChaveId`),
    INDEX `LattesParticipacaoEventoPalavraChave_professorId_idx`(`professorId`),
    PRIMARY KEY (`eventoId`, `professorId`, `palavraChaveId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LattesBancaDeTrabalho` (
    `bancaDeTrabalhoId` INTEGER NOT NULL AUTO_INCREMENT,
    `naturezaBancaDeTrabalho` VARCHAR(25) NULL,
    `tipoBancaDeTrabalho` VARCHAR(50) NOT NULL,
    `tituloBancaDeTrabalho` VARCHAR(350) NOT NULL,
    `anoBancaDeTrabalho` INTEGER NOT NULL,
    `nomeCandidato` VARCHAR(200) NULL,
    `nomeInstituicao` VARCHAR(200) NULL,
    `nomeCurso` VARCHAR(200) NULL,

    PRIMARY KEY (`bancaDeTrabalhoId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LattesParticipacaoBancaDeTrabalho` (
    `bancaDeTrabalhoId` INTEGER NOT NULL,
    `professorId` INTEGER NOT NULL,

    INDEX `LattesParticipacaoBancaDeTrabalho_bancaDeTrabalhoId_idx`(`bancaDeTrabalhoId`),
    INDEX `LattesParticipacaoBancaDeTrabalho_professorId_idx`(`professorId`),
    PRIMARY KEY (`bancaDeTrabalhoId`, `professorId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LattesBancaDeTrabalhoAreaConhecimento` (
    `bancaDeTrabalhoId` INTEGER NOT NULL,
    `areaConhecimentoId` INTEGER NOT NULL,

    INDEX `LattesBancaDeTrabalhoAreaConhecimento_bancaDeTrabalhoId_idx`(`bancaDeTrabalhoId`),
    INDEX `LattesBancaDeTrabalhoAreaConhecimento_areaConhecimentoId_idx`(`areaConhecimentoId`),
    PRIMARY KEY (`bancaDeTrabalhoId`, `areaConhecimentoId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LattesBancaDeTrabalhoPalavraChave` (
    `bancaDeTrabalhoId` INTEGER NOT NULL,
    `palavraChaveId` INTEGER NOT NULL,

    INDEX `LattesBancaDeTrabalhoPalavraChave_bancaDeTrabalhoId_idx`(`bancaDeTrabalhoId`),
    INDEX `LattesBancaDeTrabalhoPalavraChave_palavraChaveId_idx`(`palavraChaveId`),
    PRIMARY KEY (`bancaDeTrabalhoId`, `palavraChaveId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LattesBancaJulgadora` (
    `bancaJulgadoraId` INTEGER NOT NULL AUTO_INCREMENT,
    `naturezaBancaJulgadora` VARCHAR(25) NULL,
    `tipoBancaJulgadora` VARCHAR(50) NOT NULL,
    `tituloBancaJulgadora` VARCHAR(350) NOT NULL,
    `anoBancaJulgadora` INTEGER NOT NULL,
    `nomeCandidato` VARCHAR(200) NULL,
    `nomeInstituicao` VARCHAR(200) NULL,
    `nomeCurso` VARCHAR(200) NULL,

    PRIMARY KEY (`bancaJulgadoraId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LattesParticipacaoBancaJulgadora` (
    `bancaJulgadoraId` INTEGER NOT NULL,
    `professorId` INTEGER NOT NULL,

    INDEX `LattesParticipacaoBancaJulgadora_bancaJulgadoraId_idx`(`bancaJulgadoraId`),
    INDEX `LattesParticipacaoBancaJulgadora_professorId_idx`(`professorId`),
    PRIMARY KEY (`bancaJulgadoraId`, `professorId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LattesBancaJulgadoraAreaConhecimento` (
    `bancaJulgadoraId` INTEGER NOT NULL,
    `areaConhecimentoId` INTEGER NOT NULL,

    INDEX `LattesBancaJulgadoraAreaConhecimento_bancaJulgadoraId_idx`(`bancaJulgadoraId`),
    INDEX `LattesBancaJulgadoraAreaConhecimento_areaConhecimentoId_idx`(`areaConhecimentoId`),
    PRIMARY KEY (`bancaJulgadoraId`, `areaConhecimentoId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LattesBancaJulgadoraPalavraChave` (
    `bancaJulgadoraId` INTEGER NOT NULL,
    `palavraChaveId` INTEGER NOT NULL,

    INDEX `LattesBancaJulgadoraPalavraChave_bancaJulgadoraId_idx`(`bancaJulgadoraId`),
    INDEX `LattesBancaJulgadoraPalavraChave_palavraChaveId_idx`(`palavraChaveId`),
    PRIMARY KEY (`bancaJulgadoraId`, `palavraChaveId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `LattesOrgaoInstituicaoEmpresa` ADD CONSTRAINT `LattesOrgaoInstituicaoEmpresa_instituicaoEmpresaId_fkey` FOREIGN KEY (`instituicaoEmpresaId`) REFERENCES `LattesInstituicaoEmpresa`(`instituicaoEmpresaId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LattesUnidadeInstituicaoEmpresa` ADD CONSTRAINT `LattesUnidadeInstituicaoEmpresa_instituicaoEmpresaId_fkey` FOREIGN KEY (`instituicaoEmpresaId`) REFERENCES `LattesInstituicaoEmpresa`(`instituicaoEmpresaId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LattesUnidadeInstituicaoEmpresa` ADD CONSTRAINT `LattesUnidadeInstituicaoEmpresa_orgaoInstituicaoEmpresaId_fkey` FOREIGN KEY (`orgaoInstituicaoEmpresaId`) REFERENCES `LattesOrgaoInstituicaoEmpresa`(`orgaoInstituicaoEmpresaId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LattesProfessor` ADD CONSTRAINT `LattesProfessor_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LattesProfessor` ADD CONSTRAINT `LattesProfessor_enderecoResidencialId_fkey` FOREIGN KEY (`enderecoResidencialId`) REFERENCES `LattesEndereco`(`enderecoId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LattesProfessor` ADD CONSTRAINT `LattesProfessor_enderecoProfissionalId_fkey` FOREIGN KEY (`enderecoProfissionalId`) REFERENCES `LattesEndereco`(`enderecoId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LattesProfessor` ADD CONSTRAINT `LattesProfessor_instituicaoEmpresaId_fkey` FOREIGN KEY (`instituicaoEmpresaId`) REFERENCES `LattesInstituicaoEmpresa`(`instituicaoEmpresaId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LattesProfessor` ADD CONSTRAINT `LattesProfessor_orgaoInstituicaoEmpresaId_fkey` FOREIGN KEY (`orgaoInstituicaoEmpresaId`) REFERENCES `LattesOrgaoInstituicaoEmpresa`(`orgaoInstituicaoEmpresaId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LattesProfessor` ADD CONSTRAINT `LattesProfessor_unidadeInstituicaoEmpresaId_fkey` FOREIGN KEY (`unidadeInstituicaoEmpresaId`) REFERENCES `LattesUnidadeInstituicaoEmpresa`(`unidadeInstituicaoEmpresaId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LattesContatoProfessor` ADD CONSTRAINT `LattesContatoProfessor_professorId_fkey` FOREIGN KEY (`professorId`) REFERENCES `LattesProfessor`(`professorId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LattesAreaAtuacao` ADD CONSTRAINT `LattesAreaAtuacao_professorId_fkey` FOREIGN KEY (`professorId`) REFERENCES `LattesProfessor`(`professorId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LattesIdiomasProfessor` ADD CONSTRAINT `LattesIdiomasProfessor_professorId_fkey` FOREIGN KEY (`professorId`) REFERENCES `LattesProfessor`(`professorId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LattesIdiomasProfessor` ADD CONSTRAINT `LattesIdiomasProfessor_idiomaId_fkey` FOREIGN KEY (`idiomaId`) REFERENCES `LattesIdioma`(`idiomaId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LattesFormacaoAcademicaTitulacao` ADD CONSTRAINT `LattesFormacaoAcademicaTitulacao_professorId_fkey` FOREIGN KEY (`professorId`) REFERENCES `LattesProfessor`(`professorId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LattesFormacaoAcademicaTitulacao` ADD CONSTRAINT `LattesFormacaoAcademicaTitulacao_cursoId_fkey` FOREIGN KEY (`cursoId`) REFERENCES `LattesCurso`(`cursoId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LattesFormacaoAcademicaTitulacao` ADD CONSTRAINT `LattesFormacaoAcademicaTitulacao_instituicaoEmpresaId_fkey` FOREIGN KEY (`instituicaoEmpresaId`) REFERENCES `LattesInstituicaoEmpresa`(`instituicaoEmpresaId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LattesFormacaoAcademicaTitulacao` ADD CONSTRAINT `LattesFormacaoAcademicaTitulacao_orgaoInstituicaoEmpresaId_fkey` FOREIGN KEY (`orgaoInstituicaoEmpresaId`) REFERENCES `LattesOrgaoInstituicaoEmpresa`(`orgaoInstituicaoEmpresaId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LattesFormacaoAcademicaTitulacao` ADD CONSTRAINT `LattesFormacaoAcademicaTitulacao_unidadeInstituicaoEmpresaI_fkey` FOREIGN KEY (`unidadeInstituicaoEmpresaId`) REFERENCES `LattesUnidadeInstituicaoEmpresa`(`unidadeInstituicaoEmpresaId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LattesFormacaoAcademicaTitulacao` ADD CONSTRAINT `LattesFormacaoAcademicaTitulacao_orientadorId_fkey` FOREIGN KEY (`orientadorId`) REFERENCES `LattesOrientador`(`orientadorId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LattesFormacaoAcademicaTitulacao` ADD CONSTRAINT `LattesFormacaoAcademicaTitulacao_agenciaFinanciadoraId_fkey` FOREIGN KEY (`agenciaFinanciadoraId`) REFERENCES `LattesAgenciaFinanciadora`(`agenciaFinanciadoraId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LattesFormacaoAcademicaTitulacaoAreaConhecimento` ADD CONSTRAINT `LattesFormacaoAcademicaTitulacaoAreaConhecimento_professorI_fkey` FOREIGN KEY (`professorId`, `sequenciaFormacaoAcademica`) REFERENCES `LattesFormacaoAcademicaTitulacao`(`professorId`, `sequenciaFormacaoAcademica`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LattesFormacaoAcademicaTitulacaoAreaConhecimento` ADD CONSTRAINT `LattesFormacaoAcademicaTitulacaoAreaConhecimento_areaConhec_fkey` FOREIGN KEY (`areaConhecimentoId`) REFERENCES `LattesAreaConhecimento`(`areaConhecimentoId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LattesFormacaoAcademicaTitulacaoPalavraChave` ADD CONSTRAINT `LattesFormacaoAcademicaTitulacaoPalavraChave_professorId_se_fkey` FOREIGN KEY (`professorId`, `sequenciaFormacaoAcademica`) REFERENCES `LattesFormacaoAcademicaTitulacao`(`professorId`, `sequenciaFormacaoAcademica`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LattesFormacaoAcademicaTitulacaoPalavraChave` ADD CONSTRAINT `LattesFormacaoAcademicaTitulacaoPalavraChave_palavraChaveId_fkey` FOREIGN KEY (`palavraChaveId`) REFERENCES `LattesPalavraChave`(`palavraChaveId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LattesAtividadeProfissional` ADD CONSTRAINT `LattesAtividadeProfissional_professorId_fkey` FOREIGN KEY (`professorId`) REFERENCES `LattesProfessor`(`professorId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LattesAtividadeProfissional` ADD CONSTRAINT `LattesAtividadeProfissional_instituicaoEmpresaId_fkey` FOREIGN KEY (`instituicaoEmpresaId`) REFERENCES `LattesInstituicaoEmpresa`(`instituicaoEmpresaId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LattesAtividadeProfissional` ADD CONSTRAINT `LattesAtividadeProfissional_unidadeInstituicaoEmpresaId_fkey` FOREIGN KEY (`unidadeInstituicaoEmpresaId`) REFERENCES `LattesUnidadeInstituicaoEmpresa`(`unidadeInstituicaoEmpresaId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LattesAtividadeProfissional` ADD CONSTRAINT `LattesAtividadeProfissional_orgaoInstituicaoEmpresaId_fkey` FOREIGN KEY (`orgaoInstituicaoEmpresaId`) REFERENCES `LattesOrgaoInstituicaoEmpresa`(`orgaoInstituicaoEmpresaId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LattesAtividadeProfissional` ADD CONSTRAINT `LattesAtividadeProfissional_cursoId_fkey` FOREIGN KEY (`cursoId`) REFERENCES `LattesCurso`(`cursoId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LattesAtividadeProfissional` ADD CONSTRAINT `LattesAtividadeProfissional_linhaDePesquisaId_fkey` FOREIGN KEY (`linhaDePesquisaId`) REFERENCES `LattesLinhaDePesquisa`(`linhaDePesquisaId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LattesVinculoAtuacaoProfissional` ADD CONSTRAINT `LattesVinculoAtuacaoProfissional_professorId_sequenciaAtivi_fkey` FOREIGN KEY (`professorId`, `sequenciaAtividadeProfissional`) REFERENCES `LattesAtividadeProfissional`(`professorId`, `sequenciaAtividadeProfissional`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LattesProjeto` ADD CONSTRAINT `LattesProjeto_professorId_fkey` FOREIGN KEY (`professorId`) REFERENCES `LattesProfessor`(`professorId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LattesParticipacaoEmProjeto` ADD CONSTRAINT `LattesParticipacaoEmProjeto_projetoId_fkey` FOREIGN KEY (`projetoId`) REFERENCES `LattesProjeto`(`projetoId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LattesParticipacaoEmProjeto` ADD CONSTRAINT `LattesParticipacaoEmProjeto_professorId_fkey` FOREIGN KEY (`professorId`) REFERENCES `LattesProfessor`(`professorId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LattesFinanciamentoProjeto` ADD CONSTRAINT `LattesFinanciamentoProjeto_projetoId_fkey` FOREIGN KEY (`projetoId`) REFERENCES `LattesProjeto`(`projetoId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LattesFinanciamentoProjeto` ADD CONSTRAINT `LattesFinanciamentoProjeto_agenciaFinanciadoraId_fkey` FOREIGN KEY (`agenciaFinanciadoraId`) REFERENCES `LattesAgenciaFinanciadora`(`agenciaFinanciadoraId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LattesPremioOuTitulo` ADD CONSTRAINT `LattesPremioOuTitulo_professorId_fkey` FOREIGN KEY (`professorId`) REFERENCES `LattesProfessor`(`professorId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LattesProducaoTecnica` ADD CONSTRAINT `LattesProducaoTecnica_professorId_fkey` FOREIGN KEY (`professorId`) REFERENCES `LattesProfessor`(`professorId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LattesAutorProducaoTecnica` ADD CONSTRAINT `LattesAutorProducaoTecnica_producaoTecnicaId_fkey` FOREIGN KEY (`producaoTecnicaId`) REFERENCES `LattesProducaoTecnica`(`producaoTecnicaId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LattesAutorProducaoTecnica` ADD CONSTRAINT `LattesAutorProducaoTecnica_professorId_fkey` FOREIGN KEY (`professorId`) REFERENCES `LattesProfessor`(`professorId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LattesProducaoTecnicaAreaConhecimento` ADD CONSTRAINT `LattesProducaoTecnicaAreaConhecimento_producaoTecnicaId_fkey` FOREIGN KEY (`producaoTecnicaId`) REFERENCES `LattesProducaoTecnica`(`producaoTecnicaId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LattesProducaoTecnicaAreaConhecimento` ADD CONSTRAINT `LattesProducaoTecnicaAreaConhecimento_areaConhecimentoId_fkey` FOREIGN KEY (`areaConhecimentoId`) REFERENCES `LattesAreaConhecimento`(`areaConhecimentoId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LattesProducaoTecnicaPalavraChave` ADD CONSTRAINT `LattesProducaoTecnicaPalavraChave_producaoTecnicaId_fkey` FOREIGN KEY (`producaoTecnicaId`) REFERENCES `LattesProducaoTecnica`(`producaoTecnicaId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LattesProducaoTecnicaPalavraChave` ADD CONSTRAINT `LattesProducaoTecnicaPalavraChave_palavraChaveId_fkey` FOREIGN KEY (`palavraChaveId`) REFERENCES `LattesPalavraChave`(`palavraChaveId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LattesPatenteRegistro` ADD CONSTRAINT `LattesPatenteRegistro_producaoTecnicaId_fkey` FOREIGN KEY (`producaoTecnicaId`) REFERENCES `LattesProducaoTecnica`(`producaoTecnicaId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LattesPeriodicoQualis` ADD CONSTRAINT `LattesPeriodicoQualis_extratoQualisId_fkey` FOREIGN KEY (`extratoQualisId`) REFERENCES `LattesExtratoQualis`(`extratoQualisId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LattesProducaoBibliografica` ADD CONSTRAINT `LattesProducaoBibliografica_professorId_fkey` FOREIGN KEY (`professorId`) REFERENCES `LattesProfessor`(`professorId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LattesProducaoBibliografica` ADD CONSTRAINT `LattesProducaoBibliografica_periodicoQualisId_fkey` FOREIGN KEY (`periodicoQualisId`) REFERENCES `LattesPeriodicoQualis`(`periodicoQualisId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LattesAutorProducaoBibliografica` ADD CONSTRAINT `LattesAutorProducaoBibliografica_producaoBibliograficaId_fkey` FOREIGN KEY (`producaoBibliograficaId`) REFERENCES `LattesProducaoBibliografica`(`producaoBibliograficaId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LattesAutorProducaoBibliografica` ADD CONSTRAINT `LattesAutorProducaoBibliografica_professorId_fkey` FOREIGN KEY (`professorId`) REFERENCES `LattesProfessor`(`professorId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LattesProducaoBibliograficaPalavraChave` ADD CONSTRAINT `LattesProducaoBibliograficaPalavraChave_producaoBibliografi_fkey` FOREIGN KEY (`producaoBibliograficaId`) REFERENCES `LattesProducaoBibliografica`(`producaoBibliograficaId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LattesProducaoBibliograficaPalavraChave` ADD CONSTRAINT `LattesProducaoBibliograficaPalavraChave_palavraChaveId_fkey` FOREIGN KEY (`palavraChaveId`) REFERENCES `LattesPalavraChave`(`palavraChaveId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LattesProducaoBibliograficaAreaConhecimento` ADD CONSTRAINT `LattesProducaoBibliograficaAreaConhecimento_producaoBibliog_fkey` FOREIGN KEY (`producaoBibliograficaId`) REFERENCES `LattesProducaoBibliografica`(`producaoBibliograficaId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LattesProducaoBibliograficaAreaConhecimento` ADD CONSTRAINT `LattesProducaoBibliograficaAreaConhecimento_areaConheciment_fkey` FOREIGN KEY (`areaConhecimentoId`) REFERENCES `LattesAreaConhecimento`(`areaConhecimentoId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LattesOrientacaoSupervisao` ADD CONSTRAINT `LattesOrientacaoSupervisao_professorId_fkey` FOREIGN KEY (`professorId`) REFERENCES `LattesProfessor`(`professorId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LattesOrientacaoSupervisaoAreaConhecimento` ADD CONSTRAINT `LattesOrientacaoSupervisaoAreaConhecimento_orientacaoSuperv_fkey` FOREIGN KEY (`orientacaoSupervisaoId`) REFERENCES `LattesOrientacaoSupervisao`(`orientacaoSupervisaoId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LattesOrientacaoSupervisaoAreaConhecimento` ADD CONSTRAINT `LattesOrientacaoSupervisaoAreaConhecimento_areaConhecimento_fkey` FOREIGN KEY (`areaConhecimentoId`) REFERENCES `LattesAreaConhecimento`(`areaConhecimentoId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LattesOrientacaoSupervisaoPalavraChave` ADD CONSTRAINT `LattesOrientacaoSupervisaoPalavraChave_orientacaoSupervisao_fkey` FOREIGN KEY (`orientacaoSupervisaoId`) REFERENCES `LattesOrientacaoSupervisao`(`orientacaoSupervisaoId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LattesOrientacaoSupervisaoPalavraChave` ADD CONSTRAINT `LattesOrientacaoSupervisaoPalavraChave_palavraChaveId_fkey` FOREIGN KEY (`palavraChaveId`) REFERENCES `LattesPalavraChave`(`palavraChaveId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LattesParticipacaoEvento` ADD CONSTRAINT `LattesParticipacaoEvento_eventoId_fkey` FOREIGN KEY (`eventoId`) REFERENCES `LattesEvento`(`eventoId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LattesParticipacaoEvento` ADD CONSTRAINT `LattesParticipacaoEvento_professorId_fkey` FOREIGN KEY (`professorId`) REFERENCES `LattesProfessor`(`professorId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LattesParticipacaoEventoAreaConhecimento` ADD CONSTRAINT `LattesParticipacaoEventoAreaConhecimento_eventoId_professor_fkey` FOREIGN KEY (`eventoId`, `professorId`) REFERENCES `LattesParticipacaoEvento`(`eventoId`, `professorId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LattesParticipacaoEventoAreaConhecimento` ADD CONSTRAINT `LattesParticipacaoEventoAreaConhecimento_areaConhecimentoId_fkey` FOREIGN KEY (`areaConhecimentoId`) REFERENCES `LattesAreaConhecimento`(`areaConhecimentoId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LattesParticipacaoEventoPalavraChave` ADD CONSTRAINT `LattesParticipacaoEventoPalavraChave_eventoId_professorId_fkey` FOREIGN KEY (`eventoId`, `professorId`) REFERENCES `LattesParticipacaoEvento`(`eventoId`, `professorId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LattesParticipacaoEventoPalavraChave` ADD CONSTRAINT `LattesParticipacaoEventoPalavraChave_palavraChaveId_fkey` FOREIGN KEY (`palavraChaveId`) REFERENCES `LattesPalavraChave`(`palavraChaveId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LattesParticipacaoBancaDeTrabalho` ADD CONSTRAINT `LattesParticipacaoBancaDeTrabalho_bancaDeTrabalhoId_fkey` FOREIGN KEY (`bancaDeTrabalhoId`) REFERENCES `LattesBancaDeTrabalho`(`bancaDeTrabalhoId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LattesParticipacaoBancaDeTrabalho` ADD CONSTRAINT `LattesParticipacaoBancaDeTrabalho_professorId_fkey` FOREIGN KEY (`professorId`) REFERENCES `LattesProfessor`(`professorId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LattesBancaDeTrabalhoAreaConhecimento` ADD CONSTRAINT `LattesBancaDeTrabalhoAreaConhecimento_bancaDeTrabalhoId_fkey` FOREIGN KEY (`bancaDeTrabalhoId`) REFERENCES `LattesBancaDeTrabalho`(`bancaDeTrabalhoId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LattesBancaDeTrabalhoAreaConhecimento` ADD CONSTRAINT `LattesBancaDeTrabalhoAreaConhecimento_areaConhecimentoId_fkey` FOREIGN KEY (`areaConhecimentoId`) REFERENCES `LattesAreaConhecimento`(`areaConhecimentoId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LattesBancaDeTrabalhoPalavraChave` ADD CONSTRAINT `LattesBancaDeTrabalhoPalavraChave_bancaDeTrabalhoId_fkey` FOREIGN KEY (`bancaDeTrabalhoId`) REFERENCES `LattesBancaDeTrabalho`(`bancaDeTrabalhoId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LattesBancaDeTrabalhoPalavraChave` ADD CONSTRAINT `LattesBancaDeTrabalhoPalavraChave_palavraChaveId_fkey` FOREIGN KEY (`palavraChaveId`) REFERENCES `LattesPalavraChave`(`palavraChaveId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LattesParticipacaoBancaJulgadora` ADD CONSTRAINT `LattesParticipacaoBancaJulgadora_bancaJulgadoraId_fkey` FOREIGN KEY (`bancaJulgadoraId`) REFERENCES `LattesBancaJulgadora`(`bancaJulgadoraId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LattesParticipacaoBancaJulgadora` ADD CONSTRAINT `LattesParticipacaoBancaJulgadora_professorId_fkey` FOREIGN KEY (`professorId`) REFERENCES `LattesProfessor`(`professorId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LattesBancaJulgadoraAreaConhecimento` ADD CONSTRAINT `LattesBancaJulgadoraAreaConhecimento_bancaJulgadoraId_fkey` FOREIGN KEY (`bancaJulgadoraId`) REFERENCES `LattesBancaJulgadora`(`bancaJulgadoraId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LattesBancaJulgadoraAreaConhecimento` ADD CONSTRAINT `LattesBancaJulgadoraAreaConhecimento_areaConhecimentoId_fkey` FOREIGN KEY (`areaConhecimentoId`) REFERENCES `LattesAreaConhecimento`(`areaConhecimentoId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LattesBancaJulgadoraPalavraChave` ADD CONSTRAINT `LattesBancaJulgadoraPalavraChave_bancaJulgadoraId_fkey` FOREIGN KEY (`bancaJulgadoraId`) REFERENCES `LattesBancaJulgadora`(`bancaJulgadoraId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LattesBancaJulgadoraPalavraChave` ADD CONSTRAINT `LattesBancaJulgadoraPalavraChave_palavraChaveId_fkey` FOREIGN KEY (`palavraChaveId`) REFERENCES `LattesPalavraChave`(`palavraChaveId`) ON DELETE RESTRICT ON UPDATE CASCADE;
