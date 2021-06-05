const HTMLWebpackPlugin = require('html-webpack-plugin'); // упрощает создаение HTML файлов, добавления хеша в имена файлов
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); // удаляет все ненужные файлы при перестройке проекта
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');  // Копирует отдельные файлы или целые каталоги, которые уже существуют, в каталог сборки.
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // Он создает файл CSS для каждого файла JS, который содержит CSS
const fs = require('fs');
const ImageminPlugin = require('imagemin-webpack-plugin').default;



const FL = require('./filename');
const DP = require('./isDev');
const PATHS = require('./paths');
const PAGES_DIR = `${PATHS.src}\\pages\\`; // каталог где располагаються PUG  файлы
const PAGES = fs.readdirSync(PAGES_DIR).
	filter(fileName => fileName.endsWith('.pug')); // получаем все PUG файлы в данном каталоге


module.exports = {

	plugins: [
		new CleanWebpackPlugin(),   // очищаем от лишних файлов в папке дист

		...PAGES.map(page => new HTMLWebpackPlugin({  // автоматическое добавление страниц PUG 
			template: `${PAGES_DIR}/${page}`,
			filename: `./${page.replace(/\.pug/, '.html')}`,
			inject: 'body',
		})),

		new CopyPlugin({
			patterns: [
				{
					from: `${PATHS.src}${PATHS.assets}img`,
					to: `${PATHS.dist}/${PATHS.assets}img/`
				}, // копируем все изображения в папку продакшена
			],
		}),

		new ImageminPlugin({
			test: /\.(jpe?g|png|gif|svg|webp)$/i, // сжатие изображений работает только после плагина копирования
			disable: !DP.isProd // сжимать только в продакшене.
		}),


		new MiniCssExtractPlugin({
			filename: FL.filename('css')
		}),


		new webpack.ProvidePlugin({  // подключаем jquery плагином, самый нормальный способ ..
			$: 'jquery',
			jQuery: 'jquery',
			'window.jQuery': 'jquery'
		}),

		new webpack.HotModuleReplacementPlugin(),

	],

};