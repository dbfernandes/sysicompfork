const fs = require('fs')

function getArgs() {
    const args = process.argv.slice
    (2)

    if(args.length === 0) {
        console.log('Erro: Informe o nome do módulo')
        console.log('Exemplo \'npm run criar-novo-modulo modulo-novo\'');
        process.exit(0)
    }

    return args[0].toString().toLowerCase()
}

function addLine(lines, line, section) {
    const start = lines.findIndex(line => line==section)
    newIndex = start + lines.slice(start+1).findIndex(line => line=='') + 1

    lines.splice(newIndex, 0, line)
    return lines
}

function isModuleExists(nomeDoModulo) {
    return fs.existsSync(`./src/views/${nomeDoModulo}`)
}

function isNameModuleValid(nomeDoModulo) {
    nomeDoModulo = nomeDoModulo.replace(/\n/g, '')
    return nomeDoModulo && 
        typeof(nomeDoModulo) === 'string' 
        && nomeDoModulo.length > 0

}

const nomeDoModulo = getArgs()

const criarArquivos = async (nomeDoModulo) => {
    if(!isNameModuleValid(nomeDoModulo)){
        console.log('Erro: Informe o nome do módulo válido')
        console.log('Necessário uma string não vazia')
        console.log('Exemplo \'npm run criar-novo-modulo modulo-novo\'');
        process.exit(0)
    }

    if(isModuleExists(nomeDoModulo)){
        console.log('Erro: Módulo já existe')
        console.log('Tente outro nome')
        process.exit(0)
    }
    
    fs.mkdirSync(`./src/views/${nomeDoModulo}`, { recursive: true })
    
    fs.writeFileSync(`./src/views/${nomeDoModulo}/${nomeDoModulo}-adicionar.hbs`, '')
    fs.writeFileSync(`./src/views/${nomeDoModulo}/${nomeDoModulo}-listar.hbs`, '')
    fs.writeFileSync(`./src/routes/${nomeDoModulo}.js`,
        "import express from 'express';\n" +
        `import ${nomeDoModulo}Controller from \'../controllers/${nomeDoModulo}\';\n`+
        "const router = express.Router()\n\n" +
        "/* TODO - Add routes */\n\n"+
        "export default router;"
    )
    fs.writeFileSync(`./src/controllers/${nomeDoModulo}.js`,
        "const control = async(req, res) => {\n" +
        `\t// code control example\n`+
        "}\n\n" +
        "export default {control};"
    )

    const routerIndex = fs.readFileSync('./src/routes/index.js').toString()

    let lines = routerIndex.split('\n')
    lines = addLine(lines, `import ${nomeDoModulo}Router from './${nomeDoModulo}';`, '/* Import routes */')
    lines = addLine(lines, `router.use('/${nomeDoModulo}', ${nomeDoModulo}Router);`, '/* Add routes */')

    fs.writeFileSync('./src/routes/index.js', lines.join('\n'))
    
}

criarArquivos(nomeDoModulo.toLowerCase())
