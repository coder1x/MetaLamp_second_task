import './graph.scss';




class Graph {
	className: string;
	ctx: CanvasRenderingContext2D;

	constructor(className: string) {
		this.className = className;


		if (this.setDom()) {
			this.buildGraph();
		}

	}

	setDom() {
		let canvas: HTMLCanvasElement =
			document.querySelector(this.className + '__convas');

		if (!canvas) return false;

		this.ctx = canvas.getContext('2d');

		return true;
	}

	getAttr() {

		// Sumptuously 
		// Okay
		// Satisfactorily
		// Disappointed



	}

	getColors() {

		const width = Number(this.ctx.canvas.attributes[1].value);
		const height = Number(this.ctx.canvas.attributes[2].value);

		let center = { "x": width, "y": height };
		let radiusQ = 180;

		let quadrants = [
			{
				"x1": center.x,
				"y1": center.y - radiusQ,
				"x2": center.x + radiusQ,
				"y2": center.y,
				"colorStops": [
					{ "stop": 0, "color": "#6FCF97" },
					{ "stop": 1, "color": "#66D2EA" }
				]
			},
			{
				"x1": center.x + radiusQ,
				"y1": center.y,
				"x2": center.x,
				"y2": center.y + radiusQ,
				"colorStops": [
					{ "stop": 0, "color": "#FFE39C" },
					{ "stop": 1, "color": "#FFBA9C" }
				]
			},
			{
				"x1": center.x,
				"y1": center.y - radiusQ,
				"x2": center.x + radiusQ,
				"y2": center.y,
				"colorStops": [
					{ "stop": 0, "color": "#BC9CFF" },
					{ "stop": 1, "color": "#8BA4F9" }
				]
			},
			{
				"x1": center.x - radiusQ,
				"y1": center.y,
				"x2": center.x,
				"y2": center.y - radiusQ,
				"colorStops": [
					{ "stop": 0, "color": "#909090" },
					{ "stop": 1, "color": "#3D4975" }
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

		// -----------------------------------------------
		// входные данные.

		const sumptuously = 130; 		// Великолепно
		const okay = 65; 					// Хорошо
		const satisfactorily = 65; 	// Удовлетворительно
		const disappointed = 0; 		// Разочарован

		// -----------------------------------------------

		let mas = [
			okay,
			sumptuously,
			satisfactorily,
			disappointed
		];
		mas = mas.filter(item => item > 0);

		const reducer = (a: number, b: number) => a + b;
		const percent = mas.reduce(reducer);
		const ugol = mas.map((item) => Number((item / percent).toFixed(2)));


		function getRadians(degrees: number) {
			return (Math.PI / 180) * (degrees * 360);
		}

		const color = this.getColors();


		let line = 0;

		for (let i = 0; i < ugol.length; i++) {

			// if (i == ugol.length - 1)
			// 	space = space * 2;

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



		this.ctx.fillStyle = '#BC9CFF';
		this.ctx.textAlign = 'center';
		this.ctx.textBaseline = "middle";
		this.ctx.font = 'bold ' + fontNum + 'px Montserrat';
		this.ctx.fillText(String(percent), 60 * scaling, 50 * scaling);

		this.ctx.font = fontText + 'px Montserrat';
		this.ctx.fillText('голосов', 60 * scaling, 72 * scaling);

	}


}

new Graph('.graph');





