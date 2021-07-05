const HTMLWebpackPlugin = require('html-webpack-plugin'); // упрощает создаение HTML файлов, добавления хеша в имена файлов
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); // удаляет все ненужные файлы при перестройке проекта
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');  // Копирует отдельные файлы или целые каталоги, которые уже существуют, в каталог сборки.
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // Он создает файл CSS для каждого файла JS, который содержит CSS
const fs = require('fs');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const WebpackFavicons = require('webpack-favicons');


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

		new WebpackFavicons({
			src: `${PATHS.src}${PATHS.assets}images/icon/favicon.png`,
			path: "assets/favicons/",
			cache: true,
			icons: {
				android: true,              // Create Android homescreen icon. `boolean`
				appleIcon: [
					"apple-touch-icon-114x114.png",
					"apple-touch-icon-120x120.png",
					"apple-touch-icon-144x144.png",
					"apple-touch-icon-152x152.png",
					"apple-touch-icon-167x167.png",
					"apple-touch-icon-180x180.png",
					"apple-touch-icon-57x57.png",
					"apple-touch-icon-60x60.png",
					"apple-touch-icon-72x72.png",
					"apple-touch-icon-76x76.png",
					"apple-touch-icon-precomposed.png",
					"apple-touch-icon.png"
				],
				appleStartup: [
					"apple-touch-startup-image-640x1136.png",
					"apple-touch-startup-image-750x1334.png",
					"apple-touch-startup-image-828x1792.png"
				],
				coast: true,                // Create Opera Coast icon. `boolean`
				favicons: true,             // Create regular favicons. `boolean`
				firefox: true,              // Create Firefox OS icons. `boolean`
				opengraph: true,            // Create Facebook OpenGraph image. `boolean`
				twitter: true,              // Create Twitter Summary Card image. `boolean`
				windows: true,              // Create Windows 8 tile icons. `boolean`
				yandex: true                // Create Yandex browser icon. `boolean`
			}
		}),


		new CopyPlugin({
			patterns: [
				{
					from: `${PATHS.src}${PATHS.assets}images`,
					to: `${PATHS.dist}/${PATHS.assets}images/`
				},
				{
					context: `${PATHS.src}/components/`,
					from: `**/**/*.(svg|jpg|png|webp)`,
					to: `${PATHS.dist}/${PATHS.assets}images/`,
					force: true
				},
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