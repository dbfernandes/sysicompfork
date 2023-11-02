import PublicacaoService from "../services/publicacaoService";
import UsuarioService from "../services/usuarioService";

function criarURL(root, params = {}) {
  if (root instanceof URL) root = root.href;
  params = new URLSearchParams(params).toString();
  const token = !root.endsWith('?') && params ? '?' : '';
  return root + token + params;
}

const visualizar = async (req, res) => {
  try {
      const { message, type, messageTitle } = req.query;
      const professores = await UsuarioService.listarTodosPorCondicao({
        professor: 1
      })
      return res.render("curriculo/curriculo-adicionar", {
          professores,
          csrfToken: req.csrfToken(),
          nome: req.session.nome,
          usuarioId: req.session.uid,
          message, 
          type,
          messageTitle,
          tipoUsuario: req.session.tipoUsuario
      })
  } catch (error) { 
      console.log(error)
      return res.redirect(
          criarURL('/iniciar', {
              message: 'Não foi possível visualizar o seu perfil.',
              type: 'danger',
              messageTitle: 'Visualização do perfil indisponível!',
              tipoUsuario: req.session.tipoUsuario
          })
        );
  }
}

const carregar = async (req, res)=> {
  if (req.method === 'POST') {
    try {
      const {publicacoes, idProfessor} = req.body
        await PublicacaoService.adicionarVarios(idProfessor, publicacoes)
        return res.status(201).send();                
      }catch(error){  
        console.log(error)
      }
  }

    
    

}

export default { visualizar, carregar}