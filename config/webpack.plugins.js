const HTMLWebpackPlugin = require('html-webpack-plugin'); // упрощает создаение HTML файлов, добавления хеша в имена файлов
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); // удаляет все ненужные файлы при перестройке проекта
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');  // Копирует отдельные файлы или целые каталоги, которые уже существуют, в каталог сборки.
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // Он создает файл CSS для каждого файла JS, который содержит CSS
const fs = require('fs');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
//const FoxFavicon = require('webpack-favicons');
const FoxUrlConvertor = require('fox-url-convertor');
//const HappyPack = require('happypack');

// const threadLoader = require('thread-loader');

// threadLoader.warmup(
// 	{
// 		workers: 12,
// 	},
// 	[
// 		'ts-loader'
// 	]
// );



//const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const FL = require('./filename');
const DP = require('./isDev');
const PATHS = require('./paths');
const PAGES_DIR = `${PATHS.src}\\pages\\`; // каталог где располагаються PUG  файлы


const pages = [];
fs.readdirSync(PAGES_DIR).forEach((file) => {
	pages.push(file.split('/', 2));
});

const description =
	'Лучшие номера для вашей работы, отдыха и просто вдохновения';
const keywords = 'Номера, Отель';
const title = 'TOXIN';

module.exports = {

	plugins: [
		new CleanWebpackPlugin(),   // очищаем от лишних файлов в папке дист

		// new ForkTsCheckerWebpackPlugin({
		// 	typescript: {
		// 		configFile: '../tsconfig.json',
		// 		diagnosticOptions: {
		// 			semantic: true,
		// 			syntactic: true,
		// 		},
		// 	},
		// }),

		...pages.map(fileName => new HTMLWebpackPlugin({
			getData: () => {
				try {
					return JSON.parse(fs.readFileSync(
						`./pages/${fileName}/data.json`, 'utf8'
					));
				} catch (e) {
					console.warn(
						`data.json was not provided for page ${fileName}`
					);
					return {};
				}
			},
			title: title,
			filename: `${fileName}.html`,
			template: `./pages/${fileName}/${fileName}.pug`,
			alwaysWriteToDisk: true,
			inject: 'body',
			hash: true,
			meta: {
				'viewport': {
					'name': 'viewport',
					'content':
						'width=device-width, initial-scale=1, shrink-to-fit=no',

				},
				'Content-Type': {
					'http-equiv': 'Content-Type',
					'content': 'text/html; charset=utf-8'
				},
				'compatible': {
					'http-equiv': 'x-ua-compatible',
					'content': 'ie=edge'
				},
				'description': {
					'name': 'description',
					'content': description
				},
				'keywords': {
					'name': 'keywords',
					'content': keywords
				}
			},
		})),


		new FoxUrlConvertor({
			URLchange: '%5C',
			URLto: '/',
		}),


		// new FoxFavicon({
		// 	src: `${PATHS.src}${PATHS.assets}images/icon/favicon.png`,
		// 	path: "assets/favicons/",
		// 	// eslint-disable-next-line camelcase
		// 	url_icon: 'https://coderr.ru/assets/favicons/',
		// 	icons: {
		// 		'android': true,
		// 		'appleIcon': [
		// 			"apple-touch-icon-114x114.png",
		// 			"apple-touch-icon-120x120.png",
		// 			"apple-touch-icon-144x144.png",
		// 			"apple-touch-icon-152x152.png",
		// 			"apple-touch-icon-167x167.png",
		// 			"apple-touch-icon-180x180.png",
		// 			"apple-touch-icon-57x57.png",
		// 			"apple-touch-icon-60x60.png",
		// 			"apple-touch-icon-72x72.png",
		// 			"apple-touch-icon-76x76.png",
		// 			"apple-touch-icon-precomposed.png",
		// 			"apple-touch-icon.png"
		// 		],
		// 		'appleStartup': [
		// 			"apple-touch-startup-image-640x1136.png",
		// 			"apple-touch-startup-image-750x1334.png",
		// 			"apple-touch-startup-image-828x1792.png"
		// 		],
		// 		'coast': true,                // Create Opera Coast icon. `boolean`
		// 		'favicons': true,             // Create regular favicons. `boolean`
		// 		'firefox': true,              // Create Firefox OS icons. `boolean`
		// 		'opengraph': true,            // Create Facebook OpenGraph image. `boolean`
		// 		'twitter': true,              // Create Twitter Summary Card image. `boolean`
		// 		'windows': true,              // Create Windows 8 tile icons. `boolean`
		// 		'yandex': true                // Create Yandex browser icon. `boolean`
		// 	}
		// }),


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

		new webpack.HotModuleReplacementPlugin({ multiStep: true }),



	],

};