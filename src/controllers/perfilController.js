import UsuarioService from "../services/usuarioService";
import criarURL from '../utils/criar-url'

const visualizar = async (req, res) => {
    switch (req.method) {
        case 'GET':
            try {
                const { message, type, messageTitle } = req.query;
                const id = req.session.uid
                const usuario = await UsuarioService.listarUm(id)
                return res.render("perfil/perfil-dados", {
                    usuario,
                    csrfToken: req.csrfToken(),
                    nome: req.session.nome,
                    message, 
                    type,
                    messageTitle,
                    tipoUsuario: req.session.tipoUsuario
                })
            } catch (error) { 
                console.log(error)
                return res.status(503).redirect(
                    criarURL('/inicio', {
                        message: 'Não foi possível visualizar o seu perfil.',
                        type: 'danger',
                        messageTitle: 'Visualização do perfil indisponível!',
                        tipoUsuario: req.session.tipoUsuario
                    })
                );
            }
    
        default:
            return res.status(400).send('O Servidor não pode processar a requisição. Bad Request (400)');
    }
  
}

const editar = async (req, res) => {
  const id = req.session.uid
  switch (req.method) {
    case "GET":
        try {
            const { message, type, messageTitle } = req.query;
            const usuario = await UsuarioService.listarUm(id)
            return res.render("perfil/perfil-editar", {
                usuario,
                csrfToken: req.csrfToken(),
                nome: req.session.nome,
                message, 
                type,
                messageTitle,
                tipoUsuario: req.session.tipoUsuario
            })
        } catch (error) { 
            console.log(error)
            return res.status(503).redirect(
                criarURL('/inicio', {
                    message: 'Não foi possível abrir formulário de edição para este usuário.',
                    type: 'danger',
                    messageTitle: 'Edição de usuário indisponível!',
                    tipoUsuario: req.session.tipoUsuario
                })
                );
            }

    case "POST":
        const administrador = req.body.administrador && req.body.administrador == 'on' ? 1 : 0;
        const coordenador = req.body.coordenador && req.body.coordenador == 'on' ? 1 : 0;;
        const secretaria = req.body.secretaria && req.body.secretaria == 'on' ? 1 : 0;;
        const professor = req.body.professor && req.body.professor == 'on' ? 1 : 0;;
        const dados = { 
            nomeCompleto: req.body.nomeCompleto,
            cpf: req.body.cpf,
            email: req.body.email,
            senha: req.body.senha,
            administrador,
            coordenador,
            secretaria,
            professor,
            endereco: req.body.endereco,
            telResidencial: req.body.telefoneResidencial,
            telCelular: req.body.telefoneCelular,
            siape: req.body.siape,
            dataIngresso: req.body.dateDeIngresso,
            unidade: req.body.unidade,
            turno: req.body.turno,
        }
        try{
            await UsuarioService.alterar(id, dados)
            
        }catch(error){
            console.log(error)
            dados["id"] = id
            return res.status(500).render("perfil/perfil-editar", {
                usuario: dados,
                csrfToken: req.csrfToken(),
                nome: req.session.nome,
                message: 'Não foi possível editar este usuário. Verifique os erros abaixo e tente novamente.',
                type: 'danger',
                messageTitle: 'Edição de usuário indisponível!',
                errors: error.errors,
                tipoUsuario: req.session.tipoUsuario
            })
        }

        return res.status(200).redirect(
        criarURL(`/perfil`, {
            message: 'Dados alterados com sucesso!',
            type: 'success',
            messageTitle: 'Edição de usuário bem-sucedida!',
            tipoUsuario: req.session.tipoUsuario
        }
        ));
    default:
      return res.status(400).send('O Servidor não pode processar a requisição. Bad Request (400)');

  }
}

  const deletar = async (req, res)=> {
    switch (req.method) {
        case 'POST':       
            try {
                const id = req.session.uid
                await UsuarioService.alterar(id, { 
                    status: 0,
                })
                req.session.uid = null
                return res.redirect('/');
                
            }catch(error){
                console.log(error)
                return res.status(503).redirect(
                    criarURL('/perfil', {
                        messageTitle: 'Bloqueio de perfil indisponível!',
                        message: 'Não foi possível bloquear o seu perfil.',
                        type: 'danger',
                        tipoUsuario: req.session.tipoUsuario
                    })
                );
            }
    
        default:
            return res.status(400).send('O Servidor não pode processar a requisição. Bad Request (400)');
    }
    
    

}

export default { visualizar, editar, deletar}