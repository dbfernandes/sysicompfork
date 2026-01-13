import candidatoService from '@resources/candidato/candidato.service';
import { TYPES_PUBLICACAO } from '@resources/candidatoPublicacao/candidato.publicacao.types';
import { CandidatoPublicacao } from '@prisma/client';

function formatarNumeroInscricao(numberId: string): string {
  // const num = '000-0000-000';
  // const id = numberId.toString();
  // return num.substring(0, num.length - id.length) + id;
  return numberId;
}

function formatarPublicacao(publicacao: CandidatoPublicacao) {
  return `${publicacao.autores.split(',').join(';')}; ${publicacao.titulo} ${publicacao.local}. ${publicacao.ano}.`;
}

export async function getFormattedDataCandidateFinish(candidateId: string) {
  const candidato = await candidatoService.getWithAllInformations(candidateId);
  const periodicals = candidato.publicacoes
    .filter((publicacao) => publicacao.tipoId === TYPES_PUBLICACAO.PERIODICOS)
    .map(formatarPublicacao);
  const conferences = candidato.publicacoes
    .filter((publicacao) => publicacao.tipoId === TYPES_PUBLICACAO.EVENTOS)
    .map(formatarPublicacao);
  const numberPeriodicos = periodicals.length;

  const numberConferencias = conferences.length;
  const [finishData, time] = new Date(candidato.finishedAt)
    .toLocaleString('pt-BR', {
      timeZone: 'America/Manaus',
    })
    .trim()
    .split(',');
  const finishTime = time
    .split(':')
    .reduce((acc, curr, index) => (index === 2 ? acc : `${acc}:${curr}`));

  const isBrazilian = candidato.nacionalidade === 'Brasileira';

  const registrationNumber = formatarNumeroInscricao(candidato.id);
  const name = candidato.nome;
  const socialName = candidato.nomeSocial || '-';
  const address = candidato.endereco || '-';
  const city = candidato.cidade || '-';
  // const state = candidato.estado || '-';
  const sexo =
    candidato.sexo === 'M'
      ? 'Masculino'
      : candidato.sexo === 'F'
        ? 'Feminino'
        : '-';
  const neighborhood = candidato.bairro || '-';
  const cep = candidato.cep || '-';
  const country = candidato.pais || '-';

  const nacionality = candidato.nacionalidade || '-';
  const birthDate = new Date(candidato.dataNascimento).toLocaleDateString(
    'pt-BR',
  );
  const cpf = isBrazilian ? candidato.cpf : false;
  const passport = !isBrazilian ? candidato.passaporte : false;

  const mainPhone = candidato.telefone || '-';
  const secondaryPhone = candidato.telefoneSecundario || '-';

  const undergrateCourse = candidato.cursoGraduacao || '-';
  const undergrateInstitution = candidato.instituicaoGraduacao || '-';
  const undergrateYear = candidato.anoEgressoGraduacao || '-';

  const postgrateCourse = candidato.cursoPos || '-';
  const postgrateInstitution = candidato.instituicaoPos || '-';
  const postgrateYear = candidato.anoEgressoPos || '-';
  const postgrateType = candidato.tipoPos || '-';

  const academicExperiences = candidato.experienciasAcademicas;
  const proposalTitle = candidato.tituloProposta || '-';
  const lineResearch = candidato.linhaPesquisa.nome || '-';
  const reasons = candidato.motivos || '-';

  const desiredCourse = candidato.cursoDesejado || '-';
  const regime = candidato.regime || '-';
  const scholarship = candidato.bolsista ? 'Sim' : 'Não';
  const quota = candidato.cotista ? `Sim - ${candidato.cotistaTipo}` : 'Não';
  const deficiency = candidato.condicao
    ? `Sim - ${candidato.condicaoTipo}`
    : 'Não';
  const isTae = candidato.tae ? 'Sim' : 'Não';
  const hasRecommendations = candidato.edital.cartaRecomendacao === '1';
  const recommendations = candidato.recomendacoes;

  return {
    finishData,
    finishTime,
    registrationNumber,
    name,
    socialName,
    address,
    city,
    isTae,
    // state,
    neighborhood,
    cep,
    cpf,
    sexo,
    passport,
    nacionality,
    country,
    birthDate,
    mainPhone,
    secondaryPhone,
    undergrateCourse,
    undergrateInstitution,
    undergrateYear,
    postgrateCourse,
    postgrateInstitution,
    postgrateYear,
    postgrateType,
    numberPeriodicos,
    numberConferencias,
    academicExperiences,
    proposalTitle,
    lineResearch,
    reasons,
    hasRecommendations,
    recommendations,
    periodicals,
    conferences,
    desiredCourse,
    regime,
    scholarship,
    quota,
    deficiency,
    hasProjetoPesquisa: candidato.edital.projetoPesquisa,
  };
}
