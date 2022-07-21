class Diagram {
  constructor(className) {
    this.className = className;
    this._init();
  }

  _init() {
    this._nameLine = [];
    this._rating = [];
    this._titles = [];

    this._getDataAttribute();
    this._getData();
    if (this._setDomElement()) {
      this._buildDiagram();
    }
  }

  _getColors() {
    if (!this.canvas) {
      return false;
    }

    const center = {
      x: this.canvas.width,
      y: this.canvas.height,
    };

    const RADIUS_GRADIENT = 180;
    const color = new Map();

    this.dataVotes.forEach((item) => {
      if (this._canvasContext instanceof CanvasRenderingContext2D) {
        const gradient = this._canvasContext.createLinearGradient(
          center.x + RADIUS_GRADIENT,
          center.y,
          center.x,
          center.y + RADIUS_GRADIENT,
        );

        item.colorStops.forEach((colorStop) => {
          gradient.addColorStop(colorStop.stop, colorStop.color);
        });
        color.set(item.name, gradient);
      }
    });
    return color;
  }

  _getData() {
    this.dataVotes.forEach((item) => {
      this._titles.push(item.title);
      this._rating.push(Number(item.votes) ?? 0);
      this._nameLine.push(item.name);
    });

    this._nameLine = this._nameLine.reverse();
    this._rating = this._rating.reverse();

    const index = this._rating.findIndex((item) => item === 0);
    if (index !== -1) {
      this._rating.splice(index, 1);
      this._nameLine.splice(index, 1);
    }
  }

  _getDataAttribute() {
    this.element = document.querySelector(this.className);
    this.dataVotes = JSON.parse(this.element.getAttribute('data-votes'));
  }

  _getElement(selector, parentElement) {
    const element = parentElement ?? this.element;
    if (!element) {
      return null;
    }
    return element.querySelector(`${this.className}${selector}`);
  }

  _setDomElement() {
    if (!this.element) {
      return false;
    }
    const diagramSelector = this.className.replace(/^\.js-/, '');
    const listSelector = `.${diagramSelector}__colors`;

    const list = this.element.querySelector(listSelector);

    this._titles.forEach((title, index) => {
      const liElement = document.createElement('li');
      liElement.classList.add(`${diagramSelector}__colors-item`);
      liElement.innerText = title;
      list.append(liElement);

      const divElement = document.createElement('div');
      divElement.classList.add(`${diagramSelector}__colors-dot`);

      const { colorStops } = this.dataVotes[index];

      divElement.style.background = `linear-gradient(180deg, 
        ${colorStops[0].color} 0%, ${colorStops[1].color} 100%)`;

      liElement.append(divElement);
    });

    this.canvas = this._getElement('__canvas');
    if (this.canvas) {
      this._canvasContext = this.canvas.getContext('2d');
    }
    return true;
  }

  _buildDiagram() {
    const color = this._getColors();
    // ----------------- options ---------------------
    const SCALING = 2;
    const coordinatesX = 60 * SCALING;
    const coordinatesY = 60 * SCALING;
    const radius = 57 * SCALING;
    const SPACE = 0.022;
    const fontSize = 24 * SCALING;
    const fontText = 15 * SCALING;

    if (this._canvasContext instanceof CanvasRenderingContext2D) {
      this._canvasContext.lineWidth = 4 * SCALING;
    }
    // ----------------- end options ------------------

    const percent = this._rating.reduce((a, b) => a + b);
    const angle = this._rating.map((item) => Number((item / percent).toFixed(2)));

    let endLine = 0;
    let startLine = 0;
    const dot = (Math.PI / 180) * 270;

    if (!(this._canvasContext instanceof CanvasRenderingContext2D)) {
      return false;
    }

    for (let i = 0; i < angle.length; i += 1) {
      endLine = 2 * Math.PI * angle[i];
      const start = startLine + dot + SPACE;
      const end = startLine + endLine + dot - SPACE;

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
          60 * SCALING,
          50 * SCALING,
        );

        this._canvasContext.font = `normal ${fontText}px Montserrat`;
        this._canvasContext.fillText('голосов', 60 * SCALING, 73 * SCALING);
      }
    });
    return true;
  }
}

export default Diagram;
