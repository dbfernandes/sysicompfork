const {Aluno} = require('../models');

class AlunoService {
    async adicionarVarios(
        alunoArr
        ){
          if(alunoArr!=undefined && alunoArr.length>0){
            try{
              await Aluno.truncate().then(async ()=>{
                await Aluno.bulkCreate(alunoArr)
              })
              
            }catch(err){
              throw err;
            }
          }
    
    }

    async listarTodos(curso, formado){
        try {
            const alunos = await Aluno.findAll({
                where: {
                    curso,
                    formado
                }
            })
            var AlunoDict = alunos.length == 0 ? alunos : alunos.map(a=>a.get())
            return AlunoDict
        }catch(err){
            throw err
        }
    }

    async contarTodos(){
      try{
      const data = await Aluno.findOne({atributes: ["createdAt"]})
      const contagem = {
        matriculados: {
            CC: await Aluno.count({where: {formado: 0, curso: "Ciência da Computação"}}),
            SI: await Aluno.count({where: {formado: 0, curso: "Sistemas de Informação"}}),
            ES: await Aluno.count({where: {formado: 0, curso: "Engenharia de Software"}}),
            D: await Aluno.count({where: {formado: 0, curso: "Doutorado"}}),
            M: await Aluno.count({where: {formado: 0, curso: "Mestrado"}}),
        },
        egressos: {
          PD: 254,
          CC: await Aluno.count({where: {formado: 1, curso: "Ciência da Computação"}}),
          SI: await Aluno.count({where: {formado: 1, curso: "Sistemas de Informação"}}),
          ES: await Aluno.count({where: {formado: 1, curso: "Engenharia de Software"}}),
          D: await Aluno.count({where: {formado: 1, curso: "Doutorado"}}),
          M: await Aluno.count({where: {formado: 1, curso: "Mestrado"}}),
        },
        data: data ? data.get().createdAt : new Date()
      }
      return contagem
      }catch(err){
        throw err;
      }
      
    }


}

export default new AlunoService;