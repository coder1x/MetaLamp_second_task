import './graph.scss';

class Graph {
  className: string;
  canvas: HTMLCanvasElement | null = null;
  elem: Element | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private nameLine: string[];

  constructor(className: string) {
    this.className = className;
    this.nameLine = [];

    if (this.setDom()) {
      this.buildGraph();
    }
  }

  getColors() {
    if (!this.canvas) return false;

    const center = {
      'x': this.canvas.width,
      'y': this.canvas.height
    };

    const radiusQ = 180;

    const quadrants = [
      {
        'name': 'excellent',
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
        'name': 'good',
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
        'name': 'satisfactorily',
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
        'name': 'disappointed',
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

    const color = new Map();
    for (let item of quadrants) {
      if (this.ctx instanceof CanvasRenderingContext2D) {
        const grad = this.ctx.createLinearGradient(
          item.x1,
          item.y1,
          item.x2,
          item.y2);

        for (let cs of item.colorStops) {
          grad.addColorStop(cs.stop, cs.color);
        }
        color.set(item.name, grad);
      }
    }

    return color;
  }

  getAttr() {
    let data: number[] = [];
    const getDataNum = (elem: Element, attr: string) => {
      return Number(elem.getAttribute(attr)) ?? 0;
    };

    const liItems = this.getElements('__colors-item');
    if (Array.isArray(liItems))
      for (let item of liItems) {
        const number = getDataNum(item, 'date-grade');
        const name = item.getAttribute('date-name');
        if (number) {
          data.push(number);
          if (name)
            this.nameLine.push(name);
        }
      }

    this.nameLine = this.nameLine.reverse();
    return data.reverse();
  }

  private getElements(str: string, domBase?: Element): Element[] | null {
    const dom = domBase ?? this.elem;
    const selector = `${this.className}${str}`;
    if (dom)
      return [...dom.querySelectorAll(selector)];
    else return null;
  }

  private getElement(str: string, domBase?: Element) {
    const dom = domBase ?? this.elem;
    if (!dom) return null;
    const selector = `${this.className}${str}`;
    return dom.querySelector(selector);
  }

  private setDom() {
    this.elem = document.querySelector(this.className);
    if (!this.elem) return false;

    this.canvas = this.getElement('__canvas') as HTMLCanvasElement;
    if (this.canvas)
      this.ctx = this.canvas.getContext('2d');
    return true;
  }

  private buildGraph() {

    // ----------------- options ---------------------
    const scaling = 2;
    const cordX = 60 * scaling;
    const cordY = 60 * scaling;
    const radius = 57 * scaling;
    const space = 0.022;
    const fontNum = 24 * scaling;
    const fontText = 15 * scaling;
    if (this.ctx instanceof CanvasRenderingContext2D)
      this.ctx.lineWidth = 4 * scaling;
    // ----------------- end options ------------------

    const vote = this.getAttr();

    const reducer = (a: number, b: number) => a + b;
    const percent = vote.reduce(reducer);
    const ugol = vote.map((item) => Number((item / percent).toFixed(2)));

    const color = this.getColors();

    let endLine = 0;
    let startLine = 0;
    const dot = (Math.PI / 180) * 270;

    if (this.ctx instanceof CanvasRenderingContext2D)
      for (let i = 0; i < ugol.length; i++) {

        endLine = 2 * Math.PI * ugol[i];
        const start = startLine + dot + space;
        const end = startLine + endLine + dot - space;

        this.ctx.beginPath();
        this.ctx.arc(cordX, cordY, radius, start, end);

        if (color)
          this.ctx.strokeStyle = color.get(this.nameLine[i]);
        this.ctx.stroke();
        this.ctx.closePath();

        startLine += endLine;
      }

    document.fonts.ready.then(() => {
      if (this.ctx instanceof CanvasRenderingContext2D) {
        this.ctx.fillStyle = '#BC9CFF';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.font = `bold ${fontNum}px Montserrat`;
        this.ctx.fillText(String(percent), 60 * scaling, 50 * scaling);

        this.ctx.font = `normal ${fontText}px Montserrat`;
        this.ctx.fillText('голосов', 60 * scaling, 73 * scaling);
      }
    });
  }
}

new Graph('.js-graph');