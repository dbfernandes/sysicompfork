const fs = require('fs')

const nomeDoModulo = process.argv[2].toString().toLowerCase()

const criarArquivos = async (nomeDoModulo) => {
    if(nomeDoModulo && typeof(nomeDoModulo) === 'string' && nomeDoModulo.length > 0) {
        fs.mkdirSync(`./src/views/layouts/${nomeDoModulo}`, { recursive: true })
        fs.mkdirSync(`./src/views/layouts/${nomeDoModulo}`, { recursive: true })
        
        fs.writeFileSync(`./src/views/layouts/${nomeDoModulo}/${nomeDoModulo}-adicionar.hbs`, '')
        fs.writeFileSync(`./src/views/layouts/${nomeDoModulo}/${nomeDoModulo}-listar.hbs`, '')
        fs.writeFileSync(`./src/routes/${nomeDoModulo}.js`,
            "const express = require('express')\n" +
            "const router = express.Router()\n\n" +
            "module.exports = router"
        )

        const routerIndex = fs.readFileSync('./src/routes/index.js').toString()

        const lines = routerIndex.split('\n')

        lines[lines.length -1] = 
            `const ${nomeDoModulo}Routes = require('./${nomeDoModulo}')\n` + 
            `router.use('${nomeDoModulo}', ${nomeDoModulo}Routes)\n\n` + 
            `module.exports = router`

        fs.writeFileSync('./src/routes/index.js', lines.join('\n'))
    }
}

criarArquivos(nomeDoModulo.toLowerCase())
