const {Aluno} = require('../models');
const { Op } = require("sequelize");

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
        const contagem = {
          matriculados: {
              CC: 0,
              SI: 0,
              ES: 0,
              D: 0,
              M: 0,
          },
          egressos: {
            PD: 254,
            CC: 0,
            SI: 0,
            ES: 0,
            D: 0,
            M: 0,
          },
          data: new Date()
        }
        const alunos = await Aluno.findAll({
          where: {
            curso: {
              [Op.not]: "Processamento de Dados", 
            }
          },
          attributes: ["formado", "curso", "createdAt"]
        })

        if (alunos.length > 0) {
          contagem.data = alunos[0].dataValues.createdAt
          alunos.forEach(aluno => {
            if(!aluno.dataValues.formado){
              switch (aluno.dataValues.curso) {
                case 'Ciência da Computação':
                  contagem.matriculados.CC += 1
                  break;
                case 'Engenharia de Software':
                  contagem.matriculados.ES += 1
                  break;
                case 'Mestrado':
                  contagem.matriculados.M += 1
                  break;
                default:
                  contagem.matriculados.D += 1
                  break;
              }
            }else{
              switch (aluno.dataValues.curso) {
                case 'Ciência da Computação':
                  contagem.egressos.CC += 1
                  break;
                case 'Engenharia de Software':
                  contagem.egressos.ES += 1
                  break;
                case 'Sistemas de Informação':
                  contagem.egressos.SI += 1
                  break;
                case 'Mestrado':
                  contagem.egressos.M += 1
                  break;
                default:
                  contagem.egressos.D += 1
                  break;
              }
            }
            
          });
        }
        
        return contagem
      }catch(err){
        throw err;
      }
      
    }


}

export default new AlunoService;