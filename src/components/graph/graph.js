import './graph.scss';

class Graph {
  constructor(className) {
    this.className = className;
    this._init();
  }

  getColors() {
    if (!this.canvas) return false;

    const center = {
      x: this.canvas.width,
      y: this.canvas.height,
    };

    const radiusQ = 180;

    const quadrants = [
      {
        name: 'excellent',
        x1: center.x + radiusQ,
        y1: center.y,
        x2: center.x,
        y2: center.y + radiusQ,
        colorStops: [
          { stop: 0, color: '#FFE39C' },
          { stop: 1, color: '#FFBA9C' },
        ],
      },
      {
        name: 'good',
        x1: center.x,
        y1: center.y - radiusQ,
        x2: center.x + radiusQ,
        y2: center.y,
        colorStops: [
          { stop: 0, color: '#6FCF97' },
          { stop: 1, color: '#66D2EA' },
        ],
      },
      {
        name: 'satisfactorily',
        x1: center.x,
        y1: center.y - radiusQ,
        x2: center.x + radiusQ,
        y2: center.y,
        colorStops: [
          { stop: 0, color: '#BC9CFF' },
          { stop: 1, color: '#8BA4F9' },
        ],
      },
      {
        name: 'disappointed',
        x1: center.x - radiusQ,
        y1: center.y,
        x2: center.x,
        y2: center.y - radiusQ,
        colorStops: [
          { stop: 0, color: '#909090' },
          { stop: 1, color: '#3D4975' },
        ],
      },
    ];

    const color = new Map();

    quadrants.forEach((item) => {
      if (this._canvasContext instanceof CanvasRenderingContext2D) {
        const grad = this._canvasContext.createLinearGradient(
          item.x1,
          item.y1,
          item.x2,
          item.y2,
        );

        item.colorStops.forEach((cs) => {
          grad.addColorStop(cs.stop, cs.color);
        });
        color.set(item.name, grad);
      }
    });

    return color;
  }

  getAttr() {
    const data = [];
    const getDataNum = (
      elem,
      attr,
    ) => Number(elem.getAttribute(attr)) ?? 0;

    const liItems = this._getElements('__colors-item');
    if (Array.isArray(liItems)) {
      liItems.forEach((item) => {
        const number = getDataNum(item, 'date-grade');
        const name = item.getAttribute('date-name');
        if (number) {
          data.push(number);
          if (name) this._nameLine.push(name);
        }
      });
    }

    this._nameLine = this._nameLine.reverse();
    return data.reverse();
  }

  _init() {
    this._nameLine = [];
    if (this._setDom()) {
      this._buildGraph();
    }
  }

  _getElements(str, domBase) {
    const dom = domBase ?? this.elem;
    if (dom) return [...dom.querySelectorAll(`${this.className}${str}`)];
    return null;
  }

  _getElement(str, domBase) {
    const dom = domBase ?? this.elem;
    if (!dom) return null;
    return dom.querySelector(`${this.className}${str}`);
  }

  _setDom() {
    this.elem = document.querySelector(this.className);
    if (!this.elem) return false;

    this.canvas = this._getElement('__canvas');
    if (this.canvas) { this._canvasContext = this.canvas.getContext('2d'); }
    return true;
  }

  _buildGraph() {
    // ----------------- options ---------------------
    const scaling = 2;
    const cordX = 60 * scaling;
    const cordY = 60 * scaling;
    const radius = 57 * scaling;
    const space = 0.022;
    const fontNum = 24 * scaling;
    const fontText = 15 * scaling;

    if (this._canvasContext instanceof CanvasRenderingContext2D) {
      this._canvasContext.lineWidth = 4 * scaling;
    }
    // ----------------- end options ------------------

    const vote = this.getAttr();

    const percent = vote.reduce((a, b) => a + b);
    const ugol = vote.map((item) => Number((item / percent).toFixed(2)));

    const color = this.getColors();

    let endLine = 0;
    let startLine = 0;
    const dot = (Math.PI / 180) * 270;

    if (this._canvasContext instanceof CanvasRenderingContext2D) {
      for (let i = 0; i < ugol.length; i += 1) {
        endLine = 2 * Math.PI * ugol[i];
        const start = startLine + dot + space;
        const end = startLine + endLine + dot - space;

        this._canvasContext.beginPath();
        this._canvasContext.arc(cordX, cordY, radius, start, end);

        if (color) {
          this._canvasContext.strokeStyle = color.get(this._nameLine[i]);
        }
        this._canvasContext.stroke();
        this._canvasContext.closePath();

        startLine += endLine;
      }
    }

    document.fonts.ready.then(() => {
      if (this._canvasContext instanceof CanvasRenderingContext2D) {
        this._canvasContext.fillStyle = '#BC9CFF';
        this._canvasContext.textAlign = 'center';
        this._canvasContext.textBaseline = 'middle';
        this._canvasContext.font = `bold ${fontNum}px Montserrat`;
        this._canvasContext.fillText(
          String(percent),
          60 * scaling,
          50 * scaling,
        );

        this._canvasContext.font = `normal ${fontText}px Montserrat`;
        this._canvasContext.fillText('голосов', 60 * scaling, 73 * scaling);
      }
    });
  }
}

export default Graph;
