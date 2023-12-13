import AvatarService from "../services/avatarService";
import PublicacaoService from "../services/publicacaoService";
import PremioService from "../services/premioService";
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
          tipoUsuario: req.session.tipoUsuario,
          avatar: null
      })
  } catch (error) { 
      console.log(error)
      return res.redirect(
          criarURL('/iniciar', {
              message: 'Não foi possível abrir o envio de currículo.',
              type: 'danger',
              messageTitle: 'Envio de currículo indisponível!',
              tipoUsuario: req.session.tipoUsuario,
          })
        );
  }
}

const verificarAvatar = async (req, res) => {
  try {
    const {id} = req.params
    const avatar = await AvatarService.listarUm(id)
    res.status(200).send(avatar)
  }catch(err){
    throw err
  }
}

const carregar = async (req, res)=> {
  if (req.method === 'POST') {
    try {
        const {publicacoes, idProfessor, premios, info} = req.body
        const publicacoesParsed = JSON.parse(publicacoes)
        const premiosParsed = JSON.parse(premios)
        const infoParsed = JSON.parse(info)

        await UsuarioService.alterarInfo(idProfessor, infoParsed)
        await PremioService.adicionarVarios(idProfessor, premiosParsed)
        await PublicacaoService.adicionarVarios(idProfessor, publicacoesParsed)
        if(req.file){
          await AvatarService.adicionar(idProfessor, req.file.filename, req.file.path)
        }
        return res.status(201).send();                
      }catch(error){  
        console.log(error)
        throw error
      }
  }

    
    

}

export default { visualizar, verificarAvatar, carregar}