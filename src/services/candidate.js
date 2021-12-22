const {Candidate} = require('../models')

class CandidateService{
    async create({email, password, editalNumber}){
        console.log(email, password, editalNumber);
        let candidate = await Candidate.findOne({where: {email, editalId:editalNumber}}).catch(err => {
            console.log(err);
            throw new Error("Can not create candidate");
        });

        if(candidate){
            throw new Error("Candidate already exists");
        }
        
        candidate = await Candidate.create({
            email: email,
            passwordHash: password,
            editalId:editalNumber
        }).catch(err => {
            console.log(`[ERROR] Create Candidate: ${err}`)
            throw new Error("Can not create candidate");
        })
        return candidate;
    }

    async list(){
        const candidates = await Candidate.findAll().catch(err => {
            console.log(`[ERROR] List Candidates: ${err}`)
            throw new Error("Can not list candidates");
        })
        return candidates;
    }
}

export default new CandidateService();