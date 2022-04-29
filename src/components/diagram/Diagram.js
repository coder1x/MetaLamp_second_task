class Diagram {
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

    const radiusGradient = 180;

    const gradientColor = [
      {
        name: 'excellent',
        x1: center.x + radiusGradient,
        y1: center.y,
        x2: center.x,
        y2: center.y + radiusGradient,
        colorStops: [
          { stop: 0, color: '#FFE39C' },
          { stop: 1, color: '#FFBA9C' },
        ],
      },
      {
        name: 'good',
        x1: center.x,
        y1: center.y - radiusGradient,
        x2: center.x + radiusGradient,
        y2: center.y,
        colorStops: [
          { stop: 0, color: '#6FCF97' },
          { stop: 1, color: '#66D2EA' },
        ],
      },
      {
        name: 'satisfactorily',
        x1: center.x,
        y1: center.y - radiusGradient,
        x2: center.x + radiusGradient,
        y2: center.y,
        colorStops: [
          { stop: 0, color: '#BC9CFF' },
          { stop: 1, color: '#8BA4F9' },
        ],
      },
      {
        name: 'disappointed',
        x1: center.x - radiusGradient,
        y1: center.y,
        x2: center.x,
        y2: center.y - radiusGradient,
        colorStops: [
          { stop: 0, color: '#909090' },
          { stop: 1, color: '#3D4975' },
        ],
      },
    ];

    const color = new Map();

    gradientColor.forEach((item) => {
      if (this._canvasContext instanceof CanvasRenderingContext2D) {
        const gradient = this._canvasContext.createLinearGradient(
          item.x1,
          item.y1,
          item.x2,
          item.y2,
        );

        item.colorStops.forEach((colorStop) => {
          gradient.addColorStop(colorStop.stop, colorStop.color);
        });
        color.set(item.name, gradient);
      }
    });

    return color;
  }

  getAttribute() {
    const data = [];
    const getDataNumber = (
      elem,
      attribute,
    ) => Number(elem.getAttribute(attribute)) ?? 0;

    const listItems = this._getElements('__colors-item');
    if (!Array.isArray(listItems)) return [];

    listItems.forEach((item) => {
      const number = getDataNumber(item, 'date-grade');
      const name = item.getAttribute('date-name');

      if (number && name) {
        data.push(number);
        this._nameLine.push(name);
      }
    });

    this._nameLine = this._nameLine.reverse();
    return data.reverse();
  }

  _init() {
    this._nameLine = [];
    if (this._setDomElement()) {
      this._buildDiagram();
    }
  }

  _getElements(string, parentElement) {
    const element = parentElement ?? this.element;
    if (element) {
      return [
        ...element.querySelectorAll(`${this.className}${string}`),
      ];
    }
    return null;
  }

  _getElement(string, parentElement) {
    const element = parentElement ?? this.element;
    if (!element) return null;
    return element.querySelector(`${this.className}${string}`);
  }

  _setDomElement() {
    this.element = document.querySelector(this.className);
    if (!this.element) return false;

    this.canvas = this._getElement('__canvas');
    if (this.canvas) { this._canvasContext = this.canvas.getContext('2d'); }
    return true;
  }

  _buildDiagram() {
    // ----------------- options ---------------------
    const scaling = 2;
    const coordinatesX = 60 * scaling;
    const coordinatesY = 60 * scaling;
    const radius = 57 * scaling;
    const space = 0.022;
    const fontSize = 24 * scaling;
    const fontText = 15 * scaling;

    if (this._canvasContext instanceof CanvasRenderingContext2D) {
      this._canvasContext.lineWidth = 4 * scaling;
    }
    // ----------------- end options ------------------

    const rating = this.getAttribute();

    const percent = rating.reduce((a, b) => a + b);
    const angle = rating.map((item) => Number((item / percent).toFixed(2)));

    const color = this.getColors();

    let endLine = 0;
    let startLine = 0;
    const dot = (Math.PI / 180) * 270;

    if (!(this._canvasContext instanceof CanvasRenderingContext2D)) return false;

    for (let i = 0; i < angle.length; i += 1) {
      endLine = 2 * Math.PI * angle[i];
      const start = startLine + dot + space;
      const end = startLine + endLine + dot - space;

      this._canvasContext.beginPath();
      this._canvasContext.arc(coordinatesX, coordinatesY, radius, start, end);

      if (color) {
        this._canvasContext.strokeStyle = color.get(this._nameLine[i]);
      }
      this._canvasContext.stroke();
      this._canvasContext.closePath();

      startLine += endLine;
    }

    document.fonts.ready.then(() => {
      if (this._canvasContext instanceof CanvasRenderingContext2D) {
        this._canvasContext.fillStyle = '#BC9CFF';
        this._canvasContext.textAlign = 'center';
        this._canvasContext.textBaseline = 'middle';
        this._canvasContext.font = `bold ${fontSize}px Montserrat`;
        this._canvasContext.fillText(
          String(percent),
          60 * scaling,
          50 * scaling,
        );

        this._canvasContext.font = `normal ${fontText}px Montserrat`;
        this._canvasContext.fillText('голосов', 60 * scaling, 73 * scaling);
      }
    });
    return true;
  }
}

export default Diagram;
