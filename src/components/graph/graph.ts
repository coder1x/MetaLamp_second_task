import './graph.scss';

class Graph {
	className: string;
	ctx: CanvasRenderingContext2D;
	canvas: HTMLCanvasElement;

	constructor(className: string) {
		this.className = className;


		if (this.setDom()) {
			this.buildGraph();
		}

	}

	setDom() {
		this.canvas = document.querySelector(this.className + '__convas');

		if (!this.canvas) return false;

		this.ctx = this.canvas.getContext('2d');

		return true;
	}


	getColors() {

		let center = { 'x': this.canvas.width, 'y': this.canvas.height };
		let radiusQ = 180;

		let quadrants = [
			{
				'x1': center.x,
				'y1': center.y - radiusQ,
				'x2': center.x + radiusQ,
				'y2': center.y,
				'colorStops': [
					{ 'stop': 0, 'color': '#6FCF97' },
					{ 'stop': 1, 'color': '#66D2EA' }
				]
			},
			{
				'x1': center.x + radiusQ,
				'y1': center.y,
				'x2': center.x,
				'y2': center.y + radiusQ,
				'colorStops': [
					{ 'stop': 0, 'color': '#FFE39C' },
					{ 'stop': 1, 'color': '#FFBA9C' }
				]
			},
			{
				'x1': center.x,
				'y1': center.y - radiusQ,
				'x2': center.x + radiusQ,
				'y2': center.y,
				'colorStops': [
					{ 'stop': 0, 'color': '#BC9CFF' },
					{ 'stop': 1, 'color': '#8BA4F9' }
				]
			},
			{
				'x1': center.x - radiusQ,
				'y1': center.y,
				'x2': center.x,
				'y2': center.y - radiusQ,
				'colorStops': [
					{ 'stop': 0, 'color': '#909090' },
					{ 'stop': 1, 'color': '#3D4975' }
				]
			}
		];

		const color: CanvasGradient[] = [];

		for (let item of quadrants) {
			let grad = this.ctx.createLinearGradient(
				item.x1,
				item.y1,
				item.x2,
				item.y2);

			for (let cs of item.colorStops) {
				grad.addColorStop(cs.stop, cs.color);
			}
			color.push(grad);
		}

		return color;
	}

	getAttr() {
		let data: number[] = [];
		let getData = (attr: string) => {
			data.push(Number(this.canvas.getAttribute(attr)) ?? 0);
		};

		getData('data-good');
		getData('data-excellent');
		getData('data-satisfactorily');
		getData('data-disappointed');

		return data;
	}

	buildGraph() {

		// ----------------- options ---------------------

		const scaling = 2;
		const cordX = 60 * scaling;
		const cordY = 60 * scaling;
		const radius = 57 * scaling;
		let space = 0.006;
		const fontNum = 24 * scaling;
		const fontText = 16 * scaling;
		this.ctx.lineWidth = 4 * scaling;

		let vote = this.getAttr();
		vote = vote.filter(item => item > 0);

		const reducer = (a: number, b: number) => a + b;
		const percent = vote.reduce(reducer);
		const ugol = vote.map((item) => Number((item / percent).toFixed(2)));

		function getRadians(degrees: number) {
			return (Math.PI / 180) * (degrees * 360);
		}

		const color = this.getColors();


		let line = 0;

		for (let i = 0; i < ugol.length; i++) {

			this.ctx.beginPath();
			this.ctx.arc(
				cordX,
				cordY,
				radius,
				getRadians(line),
				getRadians(ugol[i] + line - space));

			this.ctx.strokeStyle = color[i];
			this.ctx.stroke();
			this.ctx.closePath();
			line += ugol[i];
		}

		document.fonts.load('14px Montserrat').then(() => {

			this.ctx.fillStyle = '#BC9CFF';
			this.ctx.textAlign = 'center';
			this.ctx.textBaseline = 'middle';
			this.ctx.font = 'bold ' + fontNum + 'px Montserrat';
			this.ctx.fillText(String(percent), 60 * scaling, 50 * scaling);

			this.ctx.font = fontText + 'px Montserrat';
			this.ctx.fillText('голосов', 60 * scaling, 73 * scaling);

		});
	}


}

new Graph('.graph');





