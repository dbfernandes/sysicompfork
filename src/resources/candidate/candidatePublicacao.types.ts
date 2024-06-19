import { CandidatePublications } from "@prisma/client";

export type CreateCandidatePublicationsDto = Pick<CandidatePublications,
    'ISSN' | 'titulo' | 'ano' | 'natureza' | 'tipo' | 'autores' | 'idCandidate' | 'local'
>