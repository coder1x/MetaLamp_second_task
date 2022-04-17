import autoBind from 'auto-bind';
import 'ion-rangeslider/css/ion.rangeSlider.min.css';
import 'ion-rangeslider/js/ion.rangeSlider.min.js';

import './range-slider.scss';

class RangeSlider {
  constructor(className, elem) {
    autoBind(this);
    this.className = className;
    this.elem = elem;
    this.init();
  }

  init() {
    this.dotFocus = '';
    this._setDomElem();
    this._createRangeSlider();
  }

  handleFromFocus() {
    this.dotFocus = 'from';
  }

  handleDotFocus() {
    this.dotFocus = 'to';
  }

  _setAttrDot(data, flag = false) {
    [this.dotFrom] = this.elem.getElementsByClassName('irs-handle from');
    [this.dotTo] = this.elem.getElementsByClassName('irs-handle to');
    const lineEl = this.elem.getElementsByClassName('irs-line')[0];

    lineEl.setAttribute('tabindex', '-2');
    this.dotFrom.setAttribute('tabindex', '0');
    this.dotTo.setAttribute('tabindex', '0');

    if (flag) {
      if (this.dotFocus === 'from') { this.dotFrom.focus(); }

      if (this.dotFocus === 'to') { this.dotTo.focus(); }
    }

    this._setActionsDot(data);
  }

  _setDomElem() {
    const classVal = `${this.className}__value`;
    this.valueEl = this.elem.querySelector(classVal);
  }

  _createRangeSlider() {
    const setRange = ({ from, to }) => {
      const numFrom = from.toLocaleString();
      const numTo = to.toLocaleString();
      const range = `${numFrom}₽ - ${numTo}₽`;
      this.valueEl.innerText = range;
    };

    this.$myRange = $('.js-range-slider__input').ionRangeSlider({
      type: 'double',
      step: 1,
      // eslint-disable-next-line camelcase
      hide_min_max: true,
      // eslint-disable-next-line camelcase
      hide_from_to: true,
      onUpdate: (data) => {
        setRange(data);
        this._setAttrDot(data, true);
      },
      onStart: (data) => {
        setRange(data);
        this._setAttrDot(data);
      },
      onChange: (data) => {
        setRange(data);
      },
    }).data('ionRangeSlider');
  }

  _setActionsDot({
    from, to, min, max,
  }) {
    const movement = (event, flag = false) => {
      const value = flag ? to : from;
      const name = flag ? 'to' : 'from';

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        this.$myRange.update({
          [name]: value >= min ? value - 50 : value,
        });
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        this.$myRange.update({
          [name]: value <= max ? value + 50 : value,
        });
      }
    };

    const handleDotKeydown = (event) => {
      movement(event, true);
    };

    this.dotFrom.addEventListener('focus', this.handleFromFocus);
    this.dotTo.addEventListener('focus', this.handleDotFocus);
    this.dotFrom.addEventListener('keydown', movement);
    this.dotTo.addEventListener('keydown', handleDotKeydown);
  }
}

function renderRangeSlider(className) {
  const components = document.querySelectorAll(className);

  const objMas = [];
  components.forEach((elem) => {
    objMas.push(new RangeSlider(className, elem));
  });

  return objMas;
}

renderRangeSlider('.js-range-slider');
