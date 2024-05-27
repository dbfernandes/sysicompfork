import { genSalt, hash } from "bcrypt";

const { Candidato } = require("../models");

class CandidatoService {
  async create({ email, password, editalNumber }) {
    const step = 0;
    const salt = await genSalt(10);
    const passwordHash = await hash(password, salt);

    const candidate = await Candidato.create({
      email,
      senhaHash: passwordHash,
      idEdital: editalNumber,
      posicaoEdital: 1,
    });

    delete candidate.password;
    delete candidate.passwordHash;

    return candidate;
  }

  async findCandidatoByEmailAndEdital({ email, edital }) {
    const candidato = await Candidato.findOne({
      where: {
        email,
        idEdital: edital,
      }, 
    });

    return candidato;
  }

  async auth ({ email, password, editalNumber }) {
    const candidate = await Candidato.findOne({
      where: {
        email,
        idEdital: editalNumber
      }
    })
    if(!candidate) {
      return null
    }
    return await candidate.validPassword(password) ? candidate : null
  }

  async findById (id) {
    return await Candidato.findByPk(id)
  }

  async update({
    id,
    data
  }) {
    return await Candidato.update(data, {
      where: {
        id
      }
    })
  }

  async backEdital ({ id }) {
    const candidate = await Candidato.findByPk(id)
    
    await candidate.update({
      posicaoEdital: candidate.posicaoEdital - 1
    })
    return candidate
  }

}

export default new CandidatoService();
