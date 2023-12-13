const {Usuario, Publicacao, TipoPublicacao, Avatar, Premio} = require('../models');

class DocenteService {
    async listarUm(id){
        try {
        const usuario = await Usuario.findByPk(id, {
            atributes: ["id", "nomeCompleto", "email", "status", "idLattes", "formacao", "resumo", "ultimaAtualizacao", "createdAt"],
            include: [
                {
                    model: Publicacao,
                    as: 'Publicacoes',
                    include: {
                        model: TipoPublicacao,
                        as: "Tipo",
                    },
                },
                {
                    model: Avatar,
                    as: 'Avatar'
                },
                {
                    model: Premio,
                    as: "Premios"
                }
            ],
            order: [
                [{ model: Publicacao, as:'Publicacoes' }, 'ano', 'DESC' ],
                [{ model: Premio, as:'Premios' }, 'ano', 'DESC' ],
                ],
        })
        const usuarioDict = usuario.get()
        usuarioDict["Avatar"] = usuario.Avatar ? usuario.Avatar.get() : usuario.Avatar
        usuarioDict["Premios"] = usuario.Premios.length > 0 ? usuario.Premios.map((p)=>p.get()) : usuario.Premios
        usuarioDict["perfil"] = usuario.perfis()
        usuarioDict["createdAt"] = new Date(usuarioDict["createdAt"]).toLocaleString("pt-BR", {
            timeZone: 'America/Manaus',
        }).slice(0,10);
        usuarioDict["artigosConferencias"] = []
        usuarioDict["artigosPeriodicos"] = []
        usuarioDict["livros"] = []
        usuarioDict["capitulos"] = []
        usuarioDict.Publicacoes.forEach(publi => {
            const publiDict = publi.get()
            publiDict.Tipo = publiDict.Tipo.get()
            if(publiDict.tipo == 1){
                usuarioDict["artigosConferencias"].push(publiDict)
            }else if(publiDict.tipo == 2){
                usuarioDict["artigosPeriodicos"].push(publiDict) 
            }else if(publiDict.tipo == 3){
                usuarioDict["livros"].push(publiDict) 
            }else{
                usuarioDict["capitulos"] .push(publiDict) 
            }
        });
        delete usuarioDict['Publicacoes']
        return usuarioDict;
        } catch (error) {
        throw error
        }
    }
}

export default new DocenteService;