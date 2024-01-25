const {Avatar} = require('../models');
import fs from 'fs';

class AvatarService {
    async adicionar(
        idUsuario,
        nome,
        caminho
    ){
        try {
        await this.remover(idUsuario)

        const caminhoFormated = "/src/uploads/"+nome

        await Avatar.create({
            idUsuario,
            nome, 
            caminho: caminhoFormated
        }, {})
        } catch (error) {
            throw error
        }
    }

    async listarUm(idUsuario){
        try {
            const avatar = await Avatar.findOne({
                where: {
                    idUsuario: idUsuario
                }
            })
            var avatarDict = avatar == null ? avatar : avatar.get()
            return avatarDict
        }catch(err){
            throw err
        }
    }

    async remover(idUsuario){
        try {
            const avatar = await Avatar.findOne({
                where: {
                    idUsuario: idUsuario
                }
            })
            if(avatar){
                const caminho = __dirname + "/../uploads/" + avatar.nome
                fs.unlink(caminho, (err) => {
                    if (err) {
                      console.error(err);
                      return;
                    }
                    avatar.destroy()
                    console.log('File deleted successfully');
                });
                  
            }
        }catch(err){
            throw err
        }
    }
}

export default new AvatarService;