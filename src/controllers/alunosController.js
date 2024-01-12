import AlunoService from '../services/alunoService'
import criarURL from '../utils/criar-url'


const inicio = async (req, res) => {
    try {
        const { message, type, messageTitle } = req.query;
        const contagem = await AlunoService.contarTodos()
        return res.render("alunos/alunos-gerenciar", {
            csrfToken: req.csrfToken(),
            nome: req.session.nome,
            usuarioId: req.session.uid,
            message, 
            type,
            messageTitle,
            tipoUsuario: req.session.tipoUsuario,
        })
    } catch (error) { 
        console.log(error)
        return res.redirect(
            criarURL('/iniciar', {
                message: 'Não foi possível acessar o gerenciamento de alunos.',
                type: 'danger',
                messageTitle: 'Gerenciamento de alunos indisponível!',
                tipoUsuario: req.session.tipoUsuario,
            })
          );
    }
  }

  const carregar = async (req, res)=> {
    if (req.method === 'POST') {
      try {
          const {alunos} = req.body
          console.log(req.body)
          await AlunoService.adicionarVarios(alunos)

          return res.status(201).send();                
        }catch(error){  
          console.log(error)
          throw error
        }
    }
  
  }

  export default {inicio, carregar}