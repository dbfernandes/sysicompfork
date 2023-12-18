const {Aluno} = require('../models');

class AlunoService {
    async adicionarVarios(
        alunoArr
        ){
          if(alunoArr!=undefined){
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

}

export default new AlunoService;