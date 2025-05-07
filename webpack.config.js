const path = require('path');
const nodeExternals = require('webpack-node-externals');
const CopyPlugin = require('copy-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
  entry: './src/server.ts', // Ponto de entrada da sua aplicação
  target: 'node', // Define o ambiente como Node.js
  externals: [nodeExternals()], // Ignora módulos do Node.js
  output: {
    path: path.resolve(__dirname, 'build'), // Pasta de saída (igual ao outDir do tsconfig)
    filename: 'bundle.js', // Nome do arquivo de saída
  },
  resolve: {
    extensions: ['.ts', '.js', '.json'], // Extensões de arquivo que o Webpack vai resolver
    plugins: [
      new TsconfigPathsPlugin({ configFile: './tsconfig.json' }), // Resolve os paths do tsconfig
    ],
  },
  module: {
    rules: [
      {
        test: /\.ts$/, // Compila arquivos TypeScript
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.hbs$/, // Processa arquivos Handlebars
        use: 'handlebars-loader',
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'src/views/**/*.hbs', to: '[path][name][ext]' }, // Copia todas as views

        // Copia todas as pastas de views dentro de "resources"
        {
          from: 'src/resources/**/views', // Padrão para encontrar todas as pastas "views"
          to: '[path]/[name][ext]', // Mantém a estrutura de diretórios
          globOptions: {
            ignore: ['**/*.ts', '**/*.js'], // Ignora arquivos TypeScript/JavaScript
          },
        },
        // Copia outros arquivos estáticos, se necessário
        {
          from: 'public', // Exemplo: pasta de arquivos estáticos
          to: 'public',
        },
      ],
    }),
    new Dotenv(), // Injeta variáveis de ambiente
  ],
};
