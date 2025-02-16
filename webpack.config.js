const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: path.resolve(__dirname, 'src', 'main.js'), // Точка входа
  output: {
    path: path.resolve(__dirname, 'build'), // Абсолютный путь к папке сборки
    filename: 'bundle.[contenthash].js', // Имя файла сборки с хэшем
    clean: true, // Очищает папку перед новой сборкой
  },
  devtool: 'source-map', // Генерация source maps
  module: {
    rules: [
      {
        test: /\.js$/, // Применяется к файлам .js
        exclude: /node_modules/, // Исключаем node_modules
        use: {
          loader: 'babel-loader', // Используем Babel
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [{ from: 'public', to: '', globOptions: { ignore: ['**/index.html'] } }],
    }),
    new HtmlWebpackPlugin({
      template: 'public/index.html', // Использует index.html как шаблон
    }),
  ],
};
