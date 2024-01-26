import AlunoService from '../services/alunoService'
import criarURL from '../utils/criar-url'


const inicio = async (req, res) => {
  switch (req.method) {
    case 'GET':
      try {
        const { message, type, messageTitle } = req.query;
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
          return res.status(503).redirect(
              criarURL('/inicio', {
                  message: 'Não foi possível acessar o gerenciamento de alunos.',
                  type: 'danger',
                  messageTitle: 'Gerenciamento de alunos indisponível!',
                  tipoUsuario: req.session.tipoUsuario,
              })
            );
      }
  
    default:
      return res.status(400).send('O Servidor não pode processar a requisição. Bad Request (400)');
  }
    
  }

  const carregar = async (req, res)=> {
    switch (req.method) {
      case 'POST':   
        try {
          const {alunos} = req.body
          await AlunoService.adicionarVarios(alunos)

          return res.status(201).send();                
        }catch(error){  
          console.log(error)
          return res.status(500).send(); 
        }
    
      default:
        return res.status(400).send('O Servidor não pode processar a requisição. Bad Request (400)');
    }
  }

  export default {inicio, carregar}