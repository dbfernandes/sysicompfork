import { Candidate } from "@prisma/client";

export type CreateCandidateDto = Pick<Candidate,
    'email' | 'passwordHash' | 'editalId' | 'editalPosition' | 'etapaAtual' |
    'linhaDePesquisaId' | 'Telefone' | 'Nome' | 'Bairro' | 'CEP' | 'Cidade' |
    'Bolsista' | 'AnoEgressoGraduacao' | 'CursoPos' | 'InstituicaoGraduacao' |
    'ComoSoube' | 'Condicao' | 'CondicaoTipo' | 'Cotista' | 'CotistaTipo' |
    'Curso' | 'CursoAnoEgressoPos' | 'CursoGraduacao' | 'CursoInstituicaoPos' |
    'CursoPosTipo' | 'Endereco' | 'Nacionalidade' | 'Nascimento' | 'NomeSocial' |
    'Regime' | 'Sexo' | 'TelefoneSecundario' | 'UF'
>

export type UpdateCandidateDto = Pick<Candidate,
    'email' | 'passwordHash' | 'editalId' | 'editalPosition' | 'etapaAtual' |
    'linhaDePesquisaId' | 'Telefone' | 'Nome' | 'Bairro' | 'CEP' | 'Cidade' |
    'Bolsista' | 'AnoEgressoGraduacao' | 'CursoPos' | 'InstituicaoGraduacao' |
    'ComoSoube' | 'Condicao' | 'CondicaoTipo' | 'Cotista' | 'CotistaTipo' |
    'Curso' | 'CursoAnoEgressoPos' | 'CursoGraduacao' | 'CursoInstituicaoPos' |
    'CursoPosTipo' | 'Endereco' | 'Nacionalidade' | 'Nascimento' | 'NomeSocial' |
    'Regime' | 'Sexo' | 'TelefoneSecundario' | 'UF'

>

export type CandidateSemSenha = Omit<Candidate, 'passwordHash'>;