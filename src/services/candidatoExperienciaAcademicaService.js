const { CandidatoExperienciaAcademica } = require('../models')

class CandidatoExperienciaAcademicaService {
    async create({ data, idCandidato }) {
        return await CandidatoExperienciaAcademica.create({
            ...data,
            idCandidato
        })
    }

    async dropAllByCandidateId(idCandidato) {
        return await CandidatoExperienciaAcademica.destroy({
            where: {
                idCandidato
            }
        })
    }

    async listByCandidateId(idCandidato) {
        return await CandidatoExperienciaAcademica.findAll({
            where: {
                idCandidato
            }
        })
    }
}

export default new CandidatoExperienciaAcademicaService()
