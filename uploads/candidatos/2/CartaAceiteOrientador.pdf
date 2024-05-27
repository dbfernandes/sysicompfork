-- phpMyAdmin SQL Dump
-- version 4.6.6
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: May 14, 2024 at 11:29 AM
-- Server version: 10.1.37-MariaDB-0+deb9u1
-- PHP Version: 7.0.33-0+deb9u3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `novoppgi`
--

-- --------------------------------------------------------

--
-- Table structure for table `archive`
--

CREATE TABLE `archive` (
  `id` int(11) NOT NULL,
  `createdAt` bigint(20) DEFAULT NULL,
  `fromModel` varchar(255) DEFAULT NULL,
  `originalRecord` longtext,
  `originalRecordId` longtext
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `arquivos`
--

CREATE TABLE `arquivos` (
  `id` int(11) NOT NULL,
  `id_projeto` int(11) NOT NULL,
  `nome` varchar(100) DEFAULT NULL,
  `tipo` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `article`
--

CREATE TABLE `article` (
  `pubid` int(11) DEFAULT NULL,
  `journal` text COLLATE utf8_unicode_ci,
  `volume` text COLLATE utf8_unicode_ci,
  `number` text COLLATE utf8_unicode_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `beneficiario`
--

CREATE TABLE `beneficiario` (
  `id` int(11) NOT NULL,
  `nome` varchar(200) DEFAULT NULL,
  `rg` varchar(20) DEFAULT NULL,
  `orgao_emissor` varchar(20) DEFAULT NULL,
  `nivel_academico` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `conta_corrente`
--

CREATE TABLE `conta_corrente` (
  `id` int(11) NOT NULL,
  `id_projeto` int(11) DEFAULT NULL,
  `banco` varchar(50) DEFAULT NULL,
  `agencia` varchar(10) DEFAULT NULL,
  `conta` varchar(15) DEFAULT NULL,
  `tipo_conta_corrente` tinyint(4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `defesas_tipo`
--

CREATE TABLE `defesas_tipo` (
  `id` int(11) NOT NULL,
  `sigla` varchar(20) NOT NULL,
  `nome` varchar(100) NOT NULL,
  `curso` int(11) NOT NULL,
  `status` int(11) NOT NULL DEFAULT '10'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `despesa`
--

CREATE TABLE `despesa` (
  `id` int(11) NOT NULL,
  `id_projeto` int(11) NOT NULL,
  `id_beneficiario` int(11) DEFAULT NULL,
  `id_fornecedor` int(11) DEFAULT NULL,
  `id_item` int(11) DEFAULT NULL,
  `valor_unitario` double DEFAULT NULL,
  `qtde` int(11) DEFAULT NULL,
  `tipo_desp` tinyint(4) DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL,
  `forma_de_pagamento` varchar(50) DEFAULT NULL,
  `data_emissao_NF` datetime DEFAULT NULL,
  `pendencias` text,
  `numero_cheque` varchar(50) DEFAULT NULL,
  `data_pgto` datetime DEFAULT NULL,
  `nf_recibo` varchar(50) DEFAULT NULL,
  `objetivo` text,
  `anexo` varchar(320) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `despesa_diaria`
--

CREATE TABLE `despesa_diaria` (
  `id_despesa` int(11) NOT NULL,
  `destino` varchar(200) DEFAULT NULL,
  `data_hora_volta` datetime DEFAULT NULL,
  `data_hora_ida` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `despesa_passagem`
--

CREATE TABLE `despesa_passagem` (
  `id_despesa` int(11) NOT NULL,
  `data_hora_ida` datetime DEFAULT NULL,
  `data_hora_volta` datetime DEFAULT NULL,
  `destino` varchar(200) DEFAULT NULL,
  `localizador` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `fornecedor`
--

CREATE TABLE `fornecedor` (
  `id` int(11) NOT NULL,
  `nome` varchar(200) DEFAULT NULL,
  `cpf_cnpj` varchar(30) DEFAULT NULL,
  `tipo` tinyint(4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `inproceedings`
--

CREATE TABLE `inproceedings` (
  `pubid` int(11) DEFAULT NULL,
  `booktitle` text COLLATE utf8_unicode_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `item`
--

CREATE TABLE `item` (
  `id` int(11) NOT NULL,
  `id_projeto` int(11) DEFAULT NULL,
  `id_tipo_item` int(11) DEFAULT NULL,
  `natureza` varchar(40) DEFAULT NULL,
  `valor` double DEFAULT NULL,
  `numero_item` varchar(100) DEFAULT NULL,
  `justificativa` text,
  `quantidade` int(11) DEFAULT NULL,
  `custo_unitario` double DEFAULT NULL,
  `tipo_item` tinyint(4) DEFAULT NULL,
  `descricao` text,
  `professor_responsavel` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `j17_afastamentos`
--

CREATE TABLE `j17_afastamentos` (
  `id` int(11) NOT NULL,
  `idusuario` int(11) NOT NULL,
  `nomeusuario` varchar(60) NOT NULL,
  `emailusuario` varchar(60) NOT NULL,
  `local` varchar(40) NOT NULL,
  `tipo` smallint(6) NOT NULL,
  `datasaida` date NOT NULL,
  `dataretorno` date NOT NULL,
  `justificativa` longtext NOT NULL,
  `dataenvio` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `reposicao` longtext NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `j17_aluno`
--

CREATE TABLE `j17_aluno` (
  `id` int(11) NOT NULL,
  `nome` varchar(60) CHARACTER SET utf8 NOT NULL,
  `email` varchar(60) CHARACTER SET utf8 NOT NULL,
  `senha` varchar(128) CHARACTER SET utf8 DEFAULT NULL,
  `matricula` varchar(15) CHARACTER SET utf8 NOT NULL,
  `area` int(11) NOT NULL,
  `curso` int(11) NOT NULL,
  `endereco` varchar(160) CHARACTER SET utf8 DEFAULT NULL,
  `bairro` varchar(50) CHARACTER SET utf8 DEFAULT NULL,
  `cidade` varchar(40) CHARACTER SET utf8 DEFAULT NULL,
  `uf` varchar(5) CHARACTER SET utf8 DEFAULT NULL,
  `cep` varchar(9) CHARACTER SET utf8 DEFAULT NULL,
  `datanascimento` varchar(10) CHARACTER SET utf8 DEFAULT NULL,
  `sexo` char(1) CHARACTER SET utf8 DEFAULT NULL,
  `nacionalidade` int(11) DEFAULT NULL,
  `estadocivil` varchar(15) CHARACTER SET utf8 DEFAULT NULL,
  `cpf` varchar(14) CHARACTER SET utf8 NOT NULL,
  `rg` varchar(10) CHARACTER SET utf8 DEFAULT NULL,
  `orgaoexpeditor` varchar(10) CHARACTER SET utf8 DEFAULT NULL,
  `dataexpedicao` varchar(10) CHARACTER SET utf8 DEFAULT NULL,
  `telresidencial` varchar(18) CHARACTER SET utf8 DEFAULT NULL,
  `telcomercial` varchar(18) CHARACTER SET utf8 DEFAULT NULL,
  `telcelular` varchar(18) CHARACTER SET utf8 DEFAULT NULL,
  `nomepai` varchar(60) CHARACTER SET utf8 DEFAULT NULL,
  `nomemae` varchar(60) CHARACTER SET utf8 DEFAULT NULL,
  `regime` int(11) DEFAULT NULL,
  `bolsista` varchar(3) CHARACTER SET utf8 DEFAULT NULL,
  `financiadorbolsa` varchar(45) DEFAULT NULL,
  `dataimplementacaobolsa` date DEFAULT NULL,
  `agencia` varchar(30) CHARACTER SET utf8 DEFAULT NULL,
  `pais` varchar(30) DEFAULT NULL,
  `status` smallint(6) NOT NULL DEFAULT '0',
  `dataingresso` date NOT NULL,
  `idiomaExameProf` varchar(20) DEFAULT NULL,
  `conceitoExameProf` varchar(9) DEFAULT NULL,
  `dataExameProf` varchar(10) DEFAULT NULL,
  `tituloQual2` varchar(180) DEFAULT NULL,
  `dataQual2` varchar(10) DEFAULT NULL,
  `conceitoQual2` varchar(9) DEFAULT NULL,
  `tituloTese` varchar(180) DEFAULT NULL,
  `dataTese` varchar(10) DEFAULT NULL,
  `conceitoTese` varchar(9) DEFAULT NULL,
  `horarioQual2` varchar(10) DEFAULT NULL,
  `localQual2` varchar(100) DEFAULT NULL,
  `resumoQual2` text,
  `horarioTese` varchar(10) DEFAULT NULL,
  `localTese` varchar(100) DEFAULT NULL,
  `resumoTese` text,
  `tituloQual1` varchar(180) DEFAULT NULL,
  `numDefesa` int(11) DEFAULT NULL,
  `dataQual1` varchar(10) DEFAULT NULL,
  `examinadorQual1` varchar(60) DEFAULT NULL,
  `conceitoQual1` varchar(9) DEFAULT NULL,
  `cursograd` varchar(100) DEFAULT NULL,
  `instituicaograd` varchar(100) DEFAULT NULL,
  `crgrad` varchar(10) DEFAULT NULL,
  `egressograd` int(11) DEFAULT NULL,
  `dataformaturagrad` varchar(10) DEFAULT NULL,
  `idUser` int(11) DEFAULT NULL,
  `orientador` smallint(6) DEFAULT NULL,
  `anoconclusao` date DEFAULT NULL,
  `sede` varchar(2) NOT NULL DEFAULT 'AM'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `j17_aluno_grad`
--

CREATE TABLE `j17_aluno_grad` (
  `id` int(11) NOT NULL,
  `ID_PESSOA` int(11) DEFAULT NULL,
  `NOME_PESSOA` varchar(255) DEFAULT NULL,
  `SEXO` char(1) DEFAULT NULL,
  `DT_NASCIMENTO` varchar(10) DEFAULT NULL,
  `FORMA_INGRESSO` varchar(255) DEFAULT NULL,
  `FORMA_EVASAO` varchar(255) DEFAULT NULL,
  `COD_CURSO` varchar(45) DEFAULT NULL,
  `NOME_UNIDADE` varchar(255) DEFAULT NULL,
  `MATR_ALUNO` varchar(45) NOT NULL,
  `NUM_VERSAO` varchar(45) DEFAULT NULL,
  `PERIODO_INGRESSO` varchar(100) DEFAULT NULL,
  `DT_EVASAO` varchar(50) DEFAULT NULL,
  `PERIODO_EVASAO` varchar(100) DEFAULT NULL,
  `ATUALIZACAO` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `j17_aluno_modifications`
--

CREATE TABLE `j17_aluno_modifications` (
  `id` int(11) NOT NULL,
  `id_responsavel` int(11) NOT NULL,
  `id_aluno` int(11) NOT NULL,
  `atributo` varchar(50) NOT NULL,
  `antigo_valor` varchar(2000) DEFAULT NULL,
  `novo_valor` varchar(2000) DEFAULT NULL,
  `data` varchar(2000) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `j17_banca_controledefesas`
--

CREATE TABLE `j17_banca_controledefesas` (
  `id` int(11) NOT NULL,
  `status_banca` int(11) DEFAULT NULL,
  `justificativa` text NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `j17_banca_has_membrosbanca`
--

CREATE TABLE `j17_banca_has_membrosbanca` (
  `banca_id` int(11) NOT NULL,
  `membrosbanca_id` int(11) NOT NULL,
  `funcao` text,
  `passagem` char(1) DEFAULT 'N'
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `j17_candidatos`
--

CREATE TABLE `j17_candidatos` (
  `id` bigint(20) NOT NULL,
  `posicaoEdital` smallint(6) NOT NULL,
  `idEdital` varchar(20) NOT NULL,
  `senha` varchar(60) NOT NULL,
  `inicio` datetime DEFAULT NULL,
  `fim` datetime DEFAULT NULL,
  `passoatual` int(1) NOT NULL DEFAULT '0',
  `nome` varchar(60) DEFAULT '',
  `nomesocial` varchar(60) DEFAULT NULL,
  `endereco` varchar(160) DEFAULT '',
  `bairro` varchar(50) DEFAULT '',
  `cidade` varchar(40) DEFAULT '',
  `uf` varchar(2) DEFAULT '',
  `cep` varchar(9) DEFAULT '',
  `email` varchar(50) DEFAULT NULL,
  `datanascimento` varchar(10) DEFAULT NULL,
  `nacionalidade` int(11) DEFAULT NULL,
  `pais` varchar(20) DEFAULT NULL,
  `passaporte` varchar(20) DEFAULT NULL,
  `cpf` varchar(14) DEFAULT '',
  `sexo` char(1) DEFAULT '',
  `telresidencial` varchar(18) DEFAULT NULL,
  `telcelular` varchar(18) DEFAULT NULL,
  `cursodesejado` int(11) DEFAULT NULL,
  `regime` int(11) DEFAULT NULL,
  `inscricaoposcomp` varchar(20) DEFAULT '',
  `anoposcomp` int(11) DEFAULT NULL,
  `notaposcomp` varchar(5) DEFAULT '',
  `solicitabolsa` char(1) DEFAULT NULL,
  `tituloproposta` varchar(100) DEFAULT NULL,
  `nomeorientador` varchar(200) DEFAULT NULL,
  `cartaorientador` longtext,
  `motivos` longtext,
  `proposta` longtext,
  `curriculum` longtext,
  `prova_anterior` longtext,
  `diploma` longtext,
  `comprovantepagamento` longtext,
  `cursograd` varchar(50) DEFAULT NULL,
  `instituicaograd` varchar(50) DEFAULT NULL,
  `egressograd` int(11) DEFAULT NULL,
  `dataformaturagrad` varchar(10) DEFAULT NULL,
  `cursopos` varchar(50) DEFAULT NULL,
  `instituicaopos` varchar(50) DEFAULT NULL,
  `tipopos` int(11) DEFAULT NULL,
  `egressopos` int(11) DEFAULT NULL,
  `dataformaturapos` varchar(10) DEFAULT NULL,
  `periodicosinternacionais` int(11) DEFAULT NULL,
  `periodicosnacionais` int(11) DEFAULT NULL,
  `conferenciasinternacionais` int(11) DEFAULT NULL,
  `conferenciasnacionais` int(11) DEFAULT NULL,
  `resultado` int(11) DEFAULT NULL,
  `periodo` varchar(10) DEFAULT NULL,
  `como_soube` varchar(100) DEFAULT NULL,
  `cotas` char(1) NOT NULL DEFAULT '0',
  `cotaTipo` varchar(100) DEFAULT NULL,
  `deficiencia` char(1) DEFAULT NULL,
  `deficienciaTipo` varchar(100) DEFAULT NULL,
  `status` smallint(6) NOT NULL,
  `password_reset_token` varchar(255) DEFAULT NULL,
  `auth_key` varchar(32) DEFAULT NULL,
  `idLinhaPesquisa` int(20) DEFAULT NULL,
  `declaracao` char(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `j17_candidato_experiencia_academica`
--

CREATE TABLE `j17_candidato_experiencia_academica` (
  `id` bigint(20) NOT NULL,
  `idCandidato` bigint(20) NOT NULL,
  `instituicao` varchar(60) NOT NULL,
  `atividade` varchar(30) DEFAULT NULL,
  `periodo` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `j17_candidato_publicacoes`
--

CREATE TABLE `j17_candidato_publicacoes` (
  `id` int(11) NOT NULL,
  `idCandidato` bigint(20) NOT NULL,
  `titulo` varchar(300) NOT NULL,
  `ano` int(4) NOT NULL,
  `local` varchar(300) NOT NULL,
  `tipo` smallint(1) NOT NULL,
  `natureza` varchar(100) NOT NULL,
  `autores` varchar(300) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `j17_contproj_agencias`
--

CREATE TABLE `j17_contproj_agencias` (
  `id` int(11) NOT NULL,
  `nome` varchar(70) NOT NULL,
  `sigla` varchar(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `j17_contproj_bancos`
--

CREATE TABLE `j17_contproj_bancos` (
  `id` int(11) NOT NULL,
  `codigo` varchar(5) DEFAULT NULL,
  `nome` varchar(70) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `j17_contproj_despesas`
--

CREATE TABLE `j17_contproj_despesas` (
  `id` int(11) NOT NULL,
  `rubricasdeprojetos_id` int(11) NOT NULL,
  `descricao` varchar(150) NOT NULL,
  `valor_despesa` double NOT NULL,
  `tipo_pessoa` varchar(11) NOT NULL,
  `data_emissao` date NOT NULL,
  `ident_nf` varchar(100) NOT NULL,
  `nf` varchar(100) NOT NULL,
  `ident_cheque` varchar(70) NOT NULL,
  `data_emissao_cheque` date NOT NULL,
  `valor_cheque` double NOT NULL,
  `favorecido` varchar(150) NOT NULL,
  `cnpj_cpf` varchar(20) NOT NULL,
  `comprovante` varchar(200) NOT NULL,
  `quantidade` int(11) NOT NULL DEFAULT '1',
  `valor_unitario` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `j17_contproj_projetos`
--

CREATE TABLE `j17_contproj_projetos` (
  `id` int(11) NOT NULL,
  `nomeprojeto` varchar(200) NOT NULL,
  `orcamento` double NOT NULL DEFAULT '0',
  `saldo` double NOT NULL DEFAULT '0',
  `data_inicio` date NOT NULL,
  `data_fim` date NOT NULL,
  `data_fim_alterada` date NOT NULL DEFAULT '0000-00-00',
  `coordenador_id` int(11) NOT NULL,
  `agencia_id` int(11) NOT NULL,
  `banco_id` int(11) NOT NULL,
  `agencia` varchar(11) NOT NULL,
  `conta` varchar(11) NOT NULL,
  `edital` varchar(150) NOT NULL,
  `proposta` varchar(200) NOT NULL,
  `status` varchar(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `j17_contproj_prorrogacoes`
--

CREATE TABLE `j17_contproj_prorrogacoes` (
  `id` int(11) NOT NULL,
  `projeto_id` int(11) NOT NULL,
  `data_fim_alterada` date NOT NULL,
  `descricao` text
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `j17_contproj_receitas`
--

CREATE TABLE `j17_contproj_receitas` (
  `id` int(11) NOT NULL,
  `rubricasdeprojetos_id` int(11) NOT NULL,
  `descricao` varchar(150) NOT NULL,
  `valor_receita` double NOT NULL,
  `data` date NOT NULL,
  `ordem_bancaria` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `j17_contproj_registradatas`
--

CREATE TABLE `j17_contproj_registradatas` (
  `id` int(11) NOT NULL,
  `evento` varchar(150) NOT NULL,
  `data` date NOT NULL,
  `projeto_id` int(5) NOT NULL,
  `observacao` varchar(200) NOT NULL,
  `tipo` varchar(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `j17_contproj_rubricas`
--

CREATE TABLE `j17_contproj_rubricas` (
  `id` int(11) NOT NULL,
  `codigo` varchar(11) NOT NULL,
  `nome` varchar(150) NOT NULL,
  `tipo` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `j17_contproj_rubricasdeprojetos`
--

CREATE TABLE `j17_contproj_rubricasdeprojetos` (
  `id` int(11) NOT NULL,
  `projeto_id` int(11) NOT NULL,
  `rubrica_id` int(11) NOT NULL,
  `descricao` varchar(200) NOT NULL,
  `valor_total` double NOT NULL,
  `valor_gasto` double NOT NULL,
  `valor_disponivel` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `j17_contproj_transferenciassaldorubricas`
--

CREATE TABLE `j17_contproj_transferenciassaldorubricas` (
  `id` int(11) NOT NULL,
  `projeto_id` int(11) NOT NULL,
  `rubrica_origem` int(11) NOT NULL,
  `rubrica_destino` int(11) NOT NULL,
  `valor` double NOT NULL,
  `data` date NOT NULL,
  `autorizacao` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `j17_defesa`
--

CREATE TABLE `j17_defesa` (
  `idDefesa` int(11) NOT NULL,
  `titulo` varchar(180) DEFAULT NULL,
  `tipoDefesa` char(2) DEFAULT NULL,
  `data` varchar(10) DEFAULT NULL,
  `conceito` varchar(9) DEFAULT NULL,
  `horario` varchar(10) DEFAULT NULL,
  `local` varchar(100) DEFAULT NULL,
  `resumo` text,
  `numDefesa` int(11) DEFAULT NULL,
  `examinador` text,
  `emailExaminador` text,
  `reservas_id` int(10) DEFAULT NULL,
  `banca_id` int(11) DEFAULT NULL,
  `aluno_id` int(11) NOT NULL,
  `previa` varchar(45) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `j17_disciplina`
--

CREATE TABLE `j17_disciplina` (
  `codDisciplina` varchar(10) CHARACTER SET utf8 NOT NULL,
  `nome` varchar(100) CHARACTER SET utf8 NOT NULL,
  `creditos` int(11) NOT NULL,
  `nomeCurso` varchar(50) DEFAULT NULL,
  `cargaHoraria` int(11) NOT NULL,
  `instituicao` varchar(50) DEFAULT NULL,
  `preRequisito` int(11) DEFAULT NULL,
  `obrigatoria` int(11) DEFAULT NULL,
  `id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='Lista de Disciplinas para Aproveitamento.';

-- --------------------------------------------------------

--
-- Table structure for table `j17_edital`
--

CREATE TABLE `j17_edital` (
  `numero` varchar(20) CHARACTER SET utf8 NOT NULL,
  `vagas_doutorado` smallint(11) DEFAULT NULL,
  `cotas_doutorado` smallint(11) DEFAULT NULL,
  `cartaorientador` char(1) NOT NULL,
  `vagas_mestrado` smallint(11) DEFAULT NULL,
  `cotas_mestrado` smallint(11) DEFAULT NULL,
  `cartarecomendacao` char(1) NOT NULL,
  `datainicio` date NOT NULL,
  `datafim` date NOT NULL,
  `documento` varchar(300) NOT NULL,
  `curso` char(1) NOT NULL,
  `datacriacao` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `status` smallint(6) NOT NULL DEFAULT '10'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `j17_ferias`
--

CREATE TABLE `j17_ferias` (
  `id` int(11) NOT NULL,
  `idusuario` int(11) NOT NULL,
  `nomeusuario` varchar(60) NOT NULL,
  `emailusuario` varchar(60) NOT NULL,
  `tipo` smallint(6) NOT NULL,
  `dataSaida` date NOT NULL,
  `dataRetorno` date NOT NULL,
  `dataPedido` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `j17_linhaspesquisa`
--

CREATE TABLE `j17_linhaspesquisa` (
  `id` int(20) NOT NULL,
  `nome` varchar(60) NOT NULL DEFAULT '',
  `icone` varchar(20) DEFAULT NULL,
  `sigla` varchar(20) NOT NULL,
  `cor` char(7) DEFAULT NULL,
  `descricao` longtext
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `j17_membrosbanca`
--

CREATE TABLE `j17_membrosbanca` (
  `id` int(11) NOT NULL,
  `nome` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `filiacao` varchar(100) NOT NULL,
  `telefone` varchar(20) NOT NULL,
  `cpf` varchar(15) NOT NULL,
  `dataCadastro` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `idProfessor` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `j17_orientacoes`
--

CREATE TABLE `j17_orientacoes` (
  `id` int(11) NOT NULL,
  `idProfessor` int(11) NOT NULL,
  `titulo` varchar(1024) NOT NULL,
  `aluno` varchar(500) NOT NULL,
  `ano` int(4) NOT NULL,
  `natureza` varchar(1024) DEFAULT NULL,
  `tipo` smallint(1) NOT NULL,
  `status` smallint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='- Tipo (1 - Graduação, 2 - Mestrado, 3 - Doutorado) - Status (1 - Em Andamento, ';

-- --------------------------------------------------------

--
-- Table structure for table `j17_premios`
--

CREATE TABLE `j17_premios` (
  `id` int(11) NOT NULL,
  `idProfessor` int(11) NOT NULL,
  `titulo` varchar(1024) NOT NULL,
  `entidade` varchar(1024) NOT NULL,
  `ano` int(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `j17_projetos`
--

CREATE TABLE `j17_projetos` (
  `id` int(11) NOT NULL,
  `idProfessor` int(11) NOT NULL,
  `titulo` varchar(1024) NOT NULL,
  `descricao` text NOT NULL,
  `inicio` int(4) NOT NULL,
  `fim` int(4) DEFAULT NULL,
  `papel` varchar(500) NOT NULL,
  `financiadores` varchar(1024) NOT NULL,
  `integrantes` varchar(1024) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `j17_prorrogacoes`
--

CREATE TABLE `j17_prorrogacoes` (
  `id` int(11) NOT NULL,
  `idAluno` int(11) NOT NULL,
  `dataSolicitacao` date NOT NULL,
  `dataInicio` date NOT NULL,
  `qtdDias` int(11) NOT NULL,
  `documento` text NOT NULL,
  `justificativa` text NOT NULL,
  `status` tinyint(1) NOT NULL,
  `data_termino` date DEFAULT NULL,
  `id_responsavel` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `j17_publicacoes`
--

CREATE TABLE `j17_publicacoes` (
  `id` int(11) NOT NULL,
  `idProfessor` int(11) NOT NULL,
  `titulo` varchar(1024) NOT NULL,
  `ano` int(4) NOT NULL,
  `local` varchar(1024) DEFAULT NULL,
  `tipo` smallint(1) NOT NULL,
  `natureza` varchar(100) DEFAULT NULL,
  `autores` varchar(1024) NOT NULL,
  `ISSN` varchar(300) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `j17_recomendacoes`
--

CREATE TABLE `j17_recomendacoes` (
  `id` int(11) NOT NULL,
  `dataEnvio` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `dataResposta` datetime NOT NULL,
  `prazo` date NOT NULL,
  `nome` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `token` varchar(50) NOT NULL,
  `titulacao` varchar(50) NOT NULL,
  `cargo` varchar(50) NOT NULL,
  `instituicaoTitulacao` varchar(100) NOT NULL,
  `anoTitulacao` int(11) DEFAULT NULL,
  `instituicaoAtual` varchar(100) NOT NULL,
  `dominio` smallint(6) NOT NULL,
  `aprendizado` smallint(6) NOT NULL,
  `assiduidade` smallint(6) NOT NULL,
  `relacionamento` smallint(6) NOT NULL,
  `iniciativa` smallint(6) NOT NULL,
  `expressao` smallint(6) NOT NULL,
  `classificacao` float NOT NULL,
  `informacoes` text NOT NULL,
  `anoContato` smallint(6) DEFAULT NULL,
  `conheceGraduacao` smallint(6) NOT NULL DEFAULT '0',
  `conhecePos` smallint(6) NOT NULL DEFAULT '0',
  `conheceEmpresa` smallint(6) NOT NULL DEFAULT '0',
  `conheceOutros` smallint(6) NOT NULL DEFAULT '0',
  `outrosLugares` varchar(60) DEFAULT NULL,
  `orientador` smallint(6) NOT NULL DEFAULT '0',
  `professor` smallint(6) NOT NULL DEFAULT '0',
  `empregador` smallint(6) NOT NULL DEFAULT '0',
  `coordenador` smallint(6) NOT NULL DEFAULT '0',
  `colegaCurso` smallint(6) NOT NULL DEFAULT '0',
  `colegaTrabalho` smallint(6) NOT NULL DEFAULT '0',
  `outrosContatos` smallint(6) NOT NULL DEFAULT '0',
  `outrasFuncoes` varchar(60) DEFAULT NULL,
  `passo` char(1) NOT NULL DEFAULT '1',
  `idCandidato` bigint(20) NOT NULL,
  `edital_idEdital` varchar(20) CHARACTER SET utf8 DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `j17_reservas`
--

CREATE TABLE `j17_reservas` (
  `id` int(10) NOT NULL,
  `dataReserva` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `sala` int(20) NOT NULL,
  `idSolicitante` int(10) NOT NULL,
  `atividade` varchar(50) NOT NULL,
  `tipo` varchar(30) DEFAULT NULL,
  `dataInicio` date NOT NULL,
  `dataTermino` date NOT NULL,
  `horaInicio` time NOT NULL,
  `horaTermino` time NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `j17_reservas_salas`
--

CREATE TABLE `j17_reservas_salas` (
  `id` int(10) NOT NULL,
  `nome` varchar(30) NOT NULL,
  `numero` int(5) DEFAULT NULL,
  `localizacao` varchar(50) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `j17_trancamentos`
--

CREATE TABLE `j17_trancamentos` (
  `id` int(11) NOT NULL,
  `idAluno` int(11) NOT NULL,
  `tipo` tinyint(1) NOT NULL,
  `dataSolicitacao` date NOT NULL,
  `dataInicio` date NOT NULL,
  `prevTermino` date DEFAULT NULL,
  `dataTermino` date DEFAULT NULL,
  `justificativa` varchar(250) NOT NULL,
  `documento` text NOT NULL,
  `doc_anexo` varchar(255) DEFAULT NULL,
  `status` tinyint(1) NOT NULL,
  `id_responsavel` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `j17_user`
--

CREATE TABLE `j17_user` (
  `id` int(11) NOT NULL,
  `nome` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `username` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `shortname` varchar(40) COLLATE utf8_unicode_ci DEFAULT NULL,
  `auth_key` varchar(32) COLLATE utf8_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `password_reset_token` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `status` smallint(6) NOT NULL DEFAULT '10',
  `created_at` varchar(10) COLLATE utf8_unicode_ci NOT NULL,
  `updated_at` varchar(10) COLLATE utf8_unicode_ci NOT NULL,
  `visualizacao_candidatos` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `visualizacao_candidatos_finalizados` datetime NOT NULL,
  `visualizacao_cartas_respondidas` datetime NOT NULL,
  `administrador` char(1) COLLATE utf8_unicode_ci DEFAULT NULL,
  `coordenador` char(1) COLLATE utf8_unicode_ci DEFAULT NULL,
  `secretaria` char(1) COLLATE utf8_unicode_ci DEFAULT NULL,
  `professor` char(1) COLLATE utf8_unicode_ci DEFAULT NULL,
  `suporte` char(1) COLLATE utf8_unicode_ci DEFAULT NULL,
  `aluno` char(1) COLLATE utf8_unicode_ci DEFAULT NULL,
  `siape` varchar(10) COLLATE utf8_unicode_ci DEFAULT NULL,
  `dataIngresso` varchar(10) COLLATE utf8_unicode_ci DEFAULT NULL,
  `endereco` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `telcelular` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  `telresidencial` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  `unidade` varchar(60) COLLATE utf8_unicode_ci DEFAULT NULL,
  `titulacao` varchar(15) COLLATE utf8_unicode_ci DEFAULT NULL,
  `classe` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  `nivel` varchar(6) COLLATE utf8_unicode_ci DEFAULT NULL,
  `regime` varchar(10) COLLATE utf8_unicode_ci DEFAULT NULL,
  `turno` varchar(32) COLLATE utf8_unicode_ci DEFAULT NULL,
  `idLattes` bigint(20) DEFAULT NULL,
  `formacao` varchar(300) COLLATE utf8_unicode_ci DEFAULT NULL,
  `resumo` text COLLATE utf8_unicode_ci,
  `alias` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  `ultimaAtualizacao` varchar(10) COLLATE utf8_unicode_ci DEFAULT NULL,
  `idRH` int(11) DEFAULT NULL,
  `cargo` varchar(32) COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migration`
--

CREATE TABLE `migration` (
  `version` varchar(180) NOT NULL,
  `apply_time` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `orcamento`
--

CREATE TABLE `orcamento` (
  `id` int(11) NOT NULL,
  `id_projeto` int(11) DEFAULT NULL,
  `recurso_aprovado` double DEFAULT NULL,
  `tipo_de_parcela` varchar(40) DEFAULT NULL,
  `valor_parcela` double DEFAULT NULL,
  `data_recebida` datetime DEFAULT NULL,
  `valor_receber` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `projeto`
--

CREATE TABLE `projeto` (
  `id` int(11) NOT NULL,
  `num_processo` varchar(50) DEFAULT NULL,
  `inicio_previsto` datetime DEFAULT NULL,
  `termino` datetime DEFAULT NULL,
  `nome_coordenador` varchar(200) DEFAULT NULL,
  `edital` varchar(200) DEFAULT NULL,
  `titulo_projeto` varchar(200) DEFAULT NULL,
  `num_protocolo` varchar(50) DEFAULT NULL,
  `cotacao_moeda_estrangeira` double DEFAULT NULL,
  `numero_fapeam_outorga` varchar(50) DEFAULT NULL,
  `publicacao_diario_oficial` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `publication`
--

CREATE TABLE `publication` (
  `pubid` int(11) DEFAULT NULL,
  `pubkey` text COLLATE utf8_unicode_ci,
  `title` text COLLATE utf8_unicode_ci,
  `year` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `qualisconf`
--

CREATE TABLE `qualisconf` (
  `nome` text,
  `sigla` text,
  `nota` text
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `qualisi`
--

CREATE TABLE `qualisi` (
  `id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `qualis_eventos`
--

CREATE TABLE `qualis_eventos` (
  `SIGLA` text COLLATE utf8_unicode_ci,
  `Nome` text COLLATE utf8_unicode_ci,
  `Qualis` text COLLATE utf8_unicode_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `qualis_periodicos`
--

CREATE TABLE `qualis_periodicos` (
  `issn` text COLLATE utf8_unicode_ci NOT NULL,
  `titulo` text COLLATE utf8_unicode_ci,
  `Qualis` varchar(10) CHARACTER SET utf8 DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `receita`
--

CREATE TABLE `receita` (
  `id` int(11) NOT NULL,
  `id_projeto` int(11) DEFAULT NULL,
  `valor` double DEFAULT NULL,
  `data_cadastro` datetime DEFAULT NULL,
  `tipo` tinyint(4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `relatorio_prestacao`
--

CREATE TABLE `relatorio_prestacao` (
  `id` int(11) NOT NULL,
  `id_projeto` int(11) DEFAULT NULL,
  `data_prevista` datetime DEFAULT NULL,
  `data_enviada` datetime DEFAULT NULL,
  `tipo` varchar(30) DEFAULT NULL,
  `situacao` varchar(40) DEFAULT NULL,
  `tipo_anexo` tinyint(4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `termo_aditivo`
--

CREATE TABLE `termo_aditivo` (
  `id` int(11) NOT NULL,
  `id_projeto` int(11) DEFAULT NULL,
  `numero_do_termo` varchar(50) DEFAULT NULL,
  `motivo` text,
  `vigencia` datetime DEFAULT NULL,
  `tipo` varchar(256) DEFAULT NULL,
  `valor` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tipo_item`
--

CREATE TABLE `tipo_item` (
  `id` int(11) NOT NULL,
  `descricao_tipo_item` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `todo`
--

CREATE TABLE `todo` (
  `createdAt` bigint(20) DEFAULT NULL,
  `updatedAt` bigint(20) DEFAULT NULL,
  `id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `sigla` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `valor_pago`
--

CREATE TABLE `valor_pago` (
  `id` int(11) NOT NULL,
  `id_projeto` int(11) DEFAULT NULL,
  `numero_ob` varchar(30) DEFAULT NULL,
  `data` datetime DEFAULT NULL,
  `natureza` varchar(40) DEFAULT NULL,
  `valor` double DEFAULT NULL,
  `tipo` varchar(40) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `archive`
--
ALTER TABLE `archive`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- Indexes for table `arquivos`
--
ALTER TABLE `arquivos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `arquivos_projeto_FK` (`id_projeto`);

--
-- Indexes for table `article`
--
ALTER TABLE `article`
  ADD KEY `idx_article_journal` (`journal`(255)),
  ADD KEY `idx_article_pubid` (`pubid`);

--
-- Indexes for table `beneficiario`
--
ALTER TABLE `beneficiario`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `beneficiario_UN` (`rg`);

--
-- Indexes for table `conta_corrente`
--
ALTER TABLE `conta_corrente`
  ADD PRIMARY KEY (`id`),
  ADD KEY `conta_corrente_projeto_FK` (`id_projeto`);

--
-- Indexes for table `defesas_tipo`
--
ALTER TABLE `defesas_tipo`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `despesa`
--
ALTER TABLE `despesa`
  ADD PRIMARY KEY (`id`),
  ADD KEY `despesa_beneficiario_FK` (`id_beneficiario`),
  ADD KEY `despesa_fornecedor_FK` (`id_fornecedor`),
  ADD KEY `despesa_ibfk_1` (`id_projeto`),
  ADD KEY `despesa_item_FK` (`id_item`);

--
-- Indexes for table `despesa_diaria`
--
ALTER TABLE `despesa_diaria`
  ADD PRIMARY KEY (`id_despesa`);

--
-- Indexes for table `despesa_passagem`
--
ALTER TABLE `despesa_passagem`
  ADD PRIMARY KEY (`id_despesa`);

--
-- Indexes for table `fornecedor`
--
ALTER TABLE `fornecedor`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `fornecedor_UN` (`cpf_cnpj`);

--
-- Indexes for table `inproceedings`
--
ALTER TABLE `inproceedings`
  ADD KEY `idx_inproceedings_booktitle` (`booktitle`(255)),
  ADD KEY `idx_inproceedings_pubid` (`pubid`);

--
-- Indexes for table `item`
--
ALTER TABLE `item`
  ADD PRIMARY KEY (`id`),
  ADD KEY `item_projeto_FK` (`id_projeto`),
  ADD KEY `item_tipo_item_FK` (`id_tipo_item`);

--
-- Indexes for table `j17_afastamentos`
--
ALTER TABLE `j17_afastamentos`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `j17_aluno`
--
ALTER TABLE `j17_aluno`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `j17_aluno_grad`
--
ALTER TABLE `j17_aluno_grad`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_matricula` (`MATR_ALUNO`);

--
-- Indexes for table `j17_aluno_modifications`
--
ALTER TABLE `j17_aluno_modifications`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `j17_banca_controledefesas`
--
ALTER TABLE `j17_banca_controledefesas`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `j17_banca_has_membrosbanca`
--
ALTER TABLE `j17_banca_has_membrosbanca`
  ADD PRIMARY KEY (`banca_id`,`membrosbanca_id`);

--
-- Indexes for table `j17_candidatos`
--
ALTER TABLE `j17_candidatos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_j17_candidato_j17_idEdital_idx` (`idEdital`),
  ADD KEY `idLinhaPesquisa` (`idLinhaPesquisa`);

--
-- Indexes for table `j17_candidato_experiencia_academica`
--
ALTER TABLE `j17_candidato_experiencia_academica`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idCandidato` (`idCandidato`);

--
-- Indexes for table `j17_candidato_publicacoes`
--
ALTER TABLE `j17_candidato_publicacoes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_j17_candidato_publicacoes_j17_candidatos_idx` (`idCandidato`);

--
-- Indexes for table `j17_contproj_agencias`
--
ALTER TABLE `j17_contproj_agencias`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `j17_contproj_bancos`
--
ALTER TABLE `j17_contproj_bancos`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `j17_contproj_despesas`
--
ALTER TABLE `j17_contproj_despesas`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `j17_contproj_projetos`
--
ALTER TABLE `j17_contproj_projetos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nomeprojeto` (`nomeprojeto`),
  ADD UNIQUE KEY `nomeprojeto_2` (`nomeprojeto`),
  ADD UNIQUE KEY `nomeprojeto_3` (`nomeprojeto`),
  ADD UNIQUE KEY `nomeprojeto_4` (`nomeprojeto`);

--
-- Indexes for table `j17_contproj_prorrogacoes`
--
ALTER TABLE `j17_contproj_prorrogacoes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `projeto_id` (`projeto_id`);

--
-- Indexes for table `j17_contproj_receitas`
--
ALTER TABLE `j17_contproj_receitas`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `j17_contproj_registradatas`
--
ALTER TABLE `j17_contproj_registradatas`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `j17_contproj_rubricas`
--
ALTER TABLE `j17_contproj_rubricas`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `codigo` (`codigo`),
  ADD UNIQUE KEY `nome` (`nome`),
  ADD UNIQUE KEY `id` (`id`);

--
-- Indexes for table `j17_contproj_rubricasdeprojetos`
--
ALTER TABLE `j17_contproj_rubricasdeprojetos`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `j17_contproj_transferenciassaldorubricas`
--
ALTER TABLE `j17_contproj_transferenciassaldorubricas`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `j17_defesa`
--
ALTER TABLE `j17_defesa`
  ADD PRIMARY KEY (`idDefesa`,`aluno_id`);

--
-- Indexes for table `j17_disciplina`
--
ALTER TABLE `j17_disciplina`
  ADD PRIMARY KEY (`codDisciplina`),
  ADD UNIQUE KEY `id` (`id`);

--
-- Indexes for table `j17_edital`
--
ALTER TABLE `j17_edital`
  ADD PRIMARY KEY (`numero`);

--
-- Indexes for table `j17_ferias`
--
ALTER TABLE `j17_ferias`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `j17_linhaspesquisa`
--
ALTER TABLE `j17_linhaspesquisa`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id` (`id`);

--
-- Indexes for table `j17_membrosbanca`
--
ALTER TABLE `j17_membrosbanca`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `j17_orientacoes`
--
ALTER TABLE `j17_orientacoes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `j17_premios`
--
ALTER TABLE `j17_premios`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `j17_prorrogacoes`
--
ALTER TABLE `j17_prorrogacoes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idAluno` (`idAluno`);

--
-- Indexes for table `j17_publicacoes`
--
ALTER TABLE `j17_publicacoes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `j17_recomendacoes`
--
ALTER TABLE `j17_recomendacoes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_j17_recomendacoes_j17_candidatos1_idx` (`idCandidato`),
  ADD KEY `edital_idEdital` (`edital_idEdital`);

--
-- Indexes for table `j17_reservas`
--
ALTER TABLE `j17_reservas`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `j17_reservas_salas`
--
ALTER TABLE `j17_reservas_salas`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `j17_trancamentos`
--
ALTER TABLE `j17_trancamentos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idAluno` (`idAluno`);

--
-- Indexes for table `j17_user`
--
ALTER TABLE `j17_user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `password_reset_token` (`password_reset_token`);

--
-- Indexes for table `migration`
--
ALTER TABLE `migration`
  ADD PRIMARY KEY (`version`);

--
-- Indexes for table `orcamento`
--
ALTER TABLE `orcamento`
  ADD PRIMARY KEY (`id`),
  ADD KEY `orcamento_projeto_FK` (`id_projeto`);

--
-- Indexes for table `projeto`
--
ALTER TABLE `projeto`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `publication`
--
ALTER TABLE `publication`
  ADD KEY `idx_publication_title` (`title`(255)),
  ADD KEY `idx_publication_pubid` (`pubid`);

--
-- Indexes for table `qualisi`
--
ALTER TABLE `qualisi`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `qualis_periodicos`
--
ALTER TABLE `qualis_periodicos`
  ADD KEY `idx_qualis_periodicos_titulo` (`titulo`(255));

--
-- Indexes for table `receita`
--
ALTER TABLE `receita`
  ADD PRIMARY KEY (`id`),
  ADD KEY `receita_projeto_FK` (`id_projeto`);

--
-- Indexes for table `relatorio_prestacao`
--
ALTER TABLE `relatorio_prestacao`
  ADD PRIMARY KEY (`id`),
  ADD KEY `relatorio_prestacao_projeto_FK` (`id_projeto`);

--
-- Indexes for table `termo_aditivo`
--
ALTER TABLE `termo_aditivo`
  ADD PRIMARY KEY (`id`),
  ADD KEY `termo_aditivo_projeto_FK` (`id_projeto`);

--
-- Indexes for table `tipo_item`
--
ALTER TABLE `tipo_item`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `todo`
--
ALTER TABLE `todo`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- Indexes for table `valor_pago`
--
ALTER TABLE `valor_pago`
  ADD PRIMARY KEY (`id`),
  ADD KEY `valor_pago_projeto_FK` (`id_projeto`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `archive`
--
ALTER TABLE `archive`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `arquivos`
--
ALTER TABLE `arquivos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `beneficiario`
--
ALTER TABLE `beneficiario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `conta_corrente`
--
ALTER TABLE `conta_corrente`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `defesas_tipo`
--
ALTER TABLE `defesas_tipo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT for table `despesa`
--
ALTER TABLE `despesa`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `fornecedor`
--
ALTER TABLE `fornecedor`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `item`
--
ALTER TABLE `item`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;
--
-- AUTO_INCREMENT for table `j17_afastamentos`
--
ALTER TABLE `j17_afastamentos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=979;
--
-- AUTO_INCREMENT for table `j17_aluno`
--
ALTER TABLE `j17_aluno`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=883;
--
-- AUTO_INCREMENT for table `j17_aluno_grad`
--
ALTER TABLE `j17_aluno_grad`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2769;
--
-- AUTO_INCREMENT for table `j17_aluno_modifications`
--
ALTER TABLE `j17_aluno_modifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;
--
-- AUTO_INCREMENT for table `j17_banca_controledefesas`
--
ALTER TABLE `j17_banca_controledefesas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=794;
--
-- AUTO_INCREMENT for table `j17_banca_has_membrosbanca`
--
ALTER TABLE `j17_banca_has_membrosbanca`
  MODIFY `banca_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=794;
--
-- AUTO_INCREMENT for table `j17_candidatos`
--
ALTER TABLE `j17_candidatos`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1802;
--
-- AUTO_INCREMENT for table `j17_candidato_experiencia_academica`
--
ALTER TABLE `j17_candidato_experiencia_academica`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6717;
--
-- AUTO_INCREMENT for table `j17_candidato_publicacoes`
--
ALTER TABLE `j17_candidato_publicacoes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3861;
--
-- AUTO_INCREMENT for table `j17_contproj_agencias`
--
ALTER TABLE `j17_contproj_agencias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
--
-- AUTO_INCREMENT for table `j17_contproj_bancos`
--
ALTER TABLE `j17_contproj_bancos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=133;
--
-- AUTO_INCREMENT for table `j17_contproj_despesas`
--
ALTER TABLE `j17_contproj_despesas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1075;
--
-- AUTO_INCREMENT for table `j17_contproj_projetos`
--
ALTER TABLE `j17_contproj_projetos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=87;
--
-- AUTO_INCREMENT for table `j17_contproj_prorrogacoes`
--
ALTER TABLE `j17_contproj_prorrogacoes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;
--
-- AUTO_INCREMENT for table `j17_contproj_receitas`
--
ALTER TABLE `j17_contproj_receitas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=170;
--
-- AUTO_INCREMENT for table `j17_contproj_registradatas`
--
ALTER TABLE `j17_contproj_registradatas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT for table `j17_contproj_rubricas`
--
ALTER TABLE `j17_contproj_rubricas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;
--
-- AUTO_INCREMENT for table `j17_contproj_rubricasdeprojetos`
--
ALTER TABLE `j17_contproj_rubricasdeprojetos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=223;
--
-- AUTO_INCREMENT for table `j17_contproj_transferenciassaldorubricas`
--
ALTER TABLE `j17_contproj_transferenciassaldorubricas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;
--
-- AUTO_INCREMENT for table `j17_defesa`
--
ALTER TABLE `j17_defesa`
  MODIFY `idDefesa` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=997;
--
-- AUTO_INCREMENT for table `j17_disciplina`
--
ALTER TABLE `j17_disciplina`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `j17_ferias`
--
ALTER TABLE `j17_ferias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=669;
--
-- AUTO_INCREMENT for table `j17_linhaspesquisa`
--
ALTER TABLE `j17_linhaspesquisa`
  MODIFY `id` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
--
-- AUTO_INCREMENT for table `j17_membrosbanca`
--
ALTER TABLE `j17_membrosbanca`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=155;
--
-- AUTO_INCREMENT for table `j17_orientacoes`
--
ALTER TABLE `j17_orientacoes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7624;
--
-- AUTO_INCREMENT for table `j17_premios`
--
ALTER TABLE `j17_premios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1766;
--
-- AUTO_INCREMENT for table `j17_prorrogacoes`
--
ALTER TABLE `j17_prorrogacoes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `j17_publicacoes`
--
ALTER TABLE `j17_publicacoes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13661;
--
-- AUTO_INCREMENT for table `j17_recomendacoes`
--
ALTER TABLE `j17_recomendacoes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5056;
--
-- AUTO_INCREMENT for table `j17_reservas`
--
ALTER TABLE `j17_reservas`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26311;
--
-- AUTO_INCREMENT for table `j17_reservas_salas`
--
ALTER TABLE `j17_reservas_salas`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;
--
-- AUTO_INCREMENT for table `j17_trancamentos`
--
ALTER TABLE `j17_trancamentos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `j17_user`
--
ALTER TABLE `j17_user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=89;
--
-- AUTO_INCREMENT for table `orcamento`
--
ALTER TABLE `orcamento`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `projeto`
--
ALTER TABLE `projeto`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;
--
-- AUTO_INCREMENT for table `qualisi`
--
ALTER TABLE `qualisi`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `receita`
--
ALTER TABLE `receita`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `relatorio_prestacao`
--
ALTER TABLE `relatorio_prestacao`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `termo_aditivo`
--
ALTER TABLE `termo_aditivo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `todo`
--
ALTER TABLE `todo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `arquivos`
--
ALTER TABLE `arquivos`
  ADD CONSTRAINT `arquivos_ibfk_1` FOREIGN KEY (`id_projeto`) REFERENCES `projeto` (`id`);

--
-- Constraints for table `conta_corrente`
--
ALTER TABLE `conta_corrente`
  ADD CONSTRAINT `conta_corrente_ibfk_1` FOREIGN KEY (`id_projeto`) REFERENCES `projeto` (`id`);

--
-- Constraints for table `despesa`
--
ALTER TABLE `despesa`
  ADD CONSTRAINT `despesa_beneficiario_FK` FOREIGN KEY (`id_beneficiario`) REFERENCES `beneficiario` (`id`),
  ADD CONSTRAINT `despesa_fornecedor_FK` FOREIGN KEY (`id_fornecedor`) REFERENCES `fornecedor` (`id`),
  ADD CONSTRAINT `despesa_ibfk_1` FOREIGN KEY (`id_projeto`) REFERENCES `projeto` (`id`),
  ADD CONSTRAINT `despesa_item_FK` FOREIGN KEY (`id_item`) REFERENCES `item` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `item`
--
ALTER TABLE `item`
  ADD CONSTRAINT `item_projeto_FK` FOREIGN KEY (`id_projeto`) REFERENCES `projeto` (`id`),
  ADD CONSTRAINT `item_tipo_item_FK` FOREIGN KEY (`id_tipo_item`) REFERENCES `tipo_item` (`id`);

--
-- Constraints for table `j17_candidatos`
--
ALTER TABLE `j17_candidatos`
  ADD CONSTRAINT `fk_j17_candidatos_idEdital` FOREIGN KEY (`idEdital`) REFERENCES `j17_edital` (`numero`) ON DELETE CASCADE;

--
-- Constraints for table `j17_candidato_experiencia_academica`
--
ALTER TABLE `j17_candidato_experiencia_academica`
  ADD CONSTRAINT `fk_instituicao_idCandidato` FOREIGN KEY (`idCandidato`) REFERENCES `j17_candidatos` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `j17_candidato_publicacoes`
--
ALTER TABLE `j17_candidato_publicacoes`
  ADD CONSTRAINT `fk_j17_candidato_publicacoes_j17_candidatos` FOREIGN KEY (`idCandidato`) REFERENCES `j17_candidatos` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Constraints for table `j17_prorrogacoes`
--
ALTER TABLE `j17_prorrogacoes`
  ADD CONSTRAINT `fk_prorrogacao_aluno` FOREIGN KEY (`idAluno`) REFERENCES `j17_aluno` (`id`);

--
-- Constraints for table `j17_recomendacoes`
--
ALTER TABLE `j17_recomendacoes`
  ADD CONSTRAINT `fk_j17_recomendacoes_j17_candidatos1` FOREIGN KEY (`idCandidato`) REFERENCES `j17_candidatos` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_j17_recomendacoes_j17_edital_idEdital` FOREIGN KEY (`edital_idEdital`) REFERENCES `j17_edital` (`numero`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Constraints for table `j17_trancamentos`
--
ALTER TABLE `j17_trancamentos`
  ADD CONSTRAINT `fk_trancamento_aluno` FOREIGN KEY (`idAluno`) REFERENCES `j17_aluno` (`id`);

--
-- Constraints for table `orcamento`
--
ALTER TABLE `orcamento`
  ADD CONSTRAINT `orcamento_ibfk_1` FOREIGN KEY (`id_projeto`) REFERENCES `projeto` (`id`);

--
-- Constraints for table `receita`
--
ALTER TABLE `receita`
  ADD CONSTRAINT `receita_ibfk_1` FOREIGN KEY (`id_projeto`) REFERENCES `projeto` (`id`);

--
-- Constraints for table `relatorio_prestacao`
--
ALTER TABLE `relatorio_prestacao`
  ADD CONSTRAINT `relatorio_prestacao_ibfk_1` FOREIGN KEY (`id_projeto`) REFERENCES `projeto` (`id`);

--
-- Constraints for table `termo_aditivo`
--
ALTER TABLE `termo_aditivo`
  ADD CONSTRAINT `termo_aditivo_ibfk_1` FOREIGN KEY (`id_projeto`) REFERENCES `projeto` (`id`);

--
-- Constraints for table `valor_pago`
--
ALTER TABLE `valor_pago`
  ADD CONSTRAINT `valor_pago_ibfk_1` FOREIGN KEY (`id_projeto`) REFERENCES `projeto` (`id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
