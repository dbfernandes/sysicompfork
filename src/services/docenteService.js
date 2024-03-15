const {Usuario, Publicacao, Avatar, Premio, Projeto, Orientacao, TipoPublicacao} = require('../models');

class DocenteService {
    async listarPerfil(id){
        try {
            const usuario = await Usuario.findByPk(id, {
                atributes: [
                    "id", "nomeCompleto", "email", "status", "idLattes", "formacao", "formacaoIngles", "resumo", "resumoIngles", "ultimaAtualizacao", "createdAt"
                ],
                include: [
                    {
                        model: Avatar,
                        as: 'Avatar'
                    },
                ],
            })
            if(usuario){
                const usuarioDict = usuario.get()
                usuarioDict["Avatar"] = usuario.Avatar ? usuario.Avatar.get() : usuario.Avatar
                usuarioDict["perfil"] = usuario.perfis()
                usuarioDict["createdAt"] = new Date(usuarioDict["createdAt"]).toLocaleString("pt-BR", {
                    timeZone: 'America/Manaus',
                }).slice(0,10);
                return usuarioDict;
            }
            return null
        } catch (error) {
            throw error
        }
    }


    async listarPublicacoes(id){
        try {
        const professor = await Usuario.findByPk(id, {
            attributes: ["id", "nomeCompleto"],
            include: {
                model: Publicacao,
                as: 'Publicacoes',
                include: {
                    model: TipoPublicacao,
                    as: 'Tipo'
                }
            },
            order: [['Publicacoes', 'ano', 'DESC']],
        })
        const publicacoesDict = {
            artigosConferencias: [],
            artigosPeriodicos: [],
            livros: [],
            capitulos: [],
        }
        if(professor 
            && professor.dataValues.Publicacoes 
            && professor.dataValues.Publicacoes.length > 0
        ){
            const publicacoes = professor.dataValues.Publicacoes
            publicacoes.forEach(publi => {
                const publiDict = publi.get()
                publiDict.Tipo = publiDict.Tipo.get()
                if(publiDict.tipo == 1){
                    publicacoesDict.artigosConferencias.push(publiDict)
                }else if(publiDict.tipo == 2){
                    publicacoesDict.artigosPeriodicos.push(publiDict) 
                }else if(publiDict.tipo == 3){
                    publicacoesDict.livros.push(publiDict) 
                }else{
                    publicacoesDict.capitulos.push(publiDict) 
                }
            });
            
        }
        return publicacoesDict;
        } catch (error) {
        throw error
        }
    }


    async listarPesquisas(id){
        try {
            const pesquisas = await Projeto.findAll(
                {
                    where: { idProfessor: id},
                    order: [['inicio', 'DESC']],
            })
            if(pesquisas){
                return pesquisas.map((p)=>p.get())
            }
            return null
        } catch (error) {
        throw error
        }
    }


    async listarOrientacoes(id, tipo){
        try {
            const orientacoes = await Orientacao.findAll(
                {
                    where: { 
                        idProfessor: id, 
                        tipo
                    },
                    order: [['ano', 'DESC']],
            })
            const orientacoesDict = {
                concluidas: [],
                andamento: [],
            }
            if(orientacoes){
                orientacoes.forEach(orientacao => {
                    const oriDict = orientacao.get()
                    if(oriDict.status == 1){
                        orientacoesDict.andamento.push(oriDict)
                    }else{
                        orientacoesDict.concluidas.push(oriDict) 
                    }
                });
            }
            return orientacoesDict;
        } catch (error) {
        throw error
        }
    }

    async listarPremios(id){
        try {
        const premios = await Premio.findAll(
            {
                where: { idProfessor: id},
                order: [['ano', 'DESC']],
        })
        if(premios){
            return premios.map((p)=>p.get())
        }
        return null
        } catch (error) {
        throw error
        }
    }
}

export default new DocenteService;