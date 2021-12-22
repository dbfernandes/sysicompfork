const {Candidate} = require('../models')

class CandidateService{
    async create({email, password, editalNumber}){
        let candidate = await Candidate.findOne({where: {email, editalId:editalNumber}}).catch(err => {
            console.log(err);
            throw new Error("Não foi possivel criar o candidato");
        });

        if(candidate){
            throw new Error("Candidato já existe");
        }
        
        candidate = await Candidate.create({
            email: email,
            password: password,
            editalId: editalNumber,
            status: "created"
        }).catch(err => {
            console.log(`[ERROR] Criar de candidato: ${err}`)
            throw new Error("Não foi possivel criar o candidato");
        })

        delete candidate.password
        delete candidate.passwordHash

        return candidate;
    }

    async list(){
        const candidates = await Candidate.findAll({
            attributes: {exclude: ['passwordHash']}
          }).catch(err => {
            console.log(`[ERROR] Listar Candidatos: ${err}`)
            throw new Error("Não foi possivel listar o candidato");
        })
        return candidates;
    }

    async auth({email, password, editalNumber}){
        const candidate = await Candidate.findOne({
            where:{email, editalId: editalNumber}
        })

        if(!candidate){
            throw new Error("Usuário não encontrado")
        }

        if(!(await candidate.validPassword(password))){
            throw new Error("Usuário ou senha incorretos")
        }

        return true;
    }
}

export default new CandidateService();