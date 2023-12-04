const {Avatar} = require('../models');
import fs from 'fs';

class AvatarService {
    async adicionar(
        idUsuario,
        nome,
        caminho
    ){
        try {
        this.remover(idUsuario)

        await Avatar.create({
            idUsuario,
            nome, 
            caminho
        }, {})
        } catch (error) {
            throw error
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
                fs.unlink(avatar.caminho, (err) => {
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