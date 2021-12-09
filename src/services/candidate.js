const {Candidate} = require('../models')

class Candidate{
    async create({email, password, editalNumber}){
        const candidate = await Candidate.create({
            email,
            password,
            editalNumber,
        }).catch(err => {
            console.log(`[ERROR] Create Candidate: ${err}`)
            throw new Error("Can not create candidate");
        })

    }
}

export default new Candidate();