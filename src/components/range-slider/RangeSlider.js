import autoBind from 'auto-bind';
import 'ion-rangeslider/css/ion.rangeSlider.min.css';
import 'ion-rangeslider/js/ion.rangeSlider.min.js';

import './range-slider.scss';

class RangeSlider {
  constructor(className, element) {
    autoBind(this);
    this.className = className;
    this.element = element;
    this.init();
  }

  init() {
    this.dotFocus = '';
    this._setDomElement();
    this._createRangeSlider();
  }

  handleFromFocus() {
    this.dotFocus = 'from';
  }

  handleDotFocus() {
    this.dotFocus = 'to';
  }

  _setAttributeDot(data, isDotFocused = false) {
    [this.dotFrom] = this.element.getElementsByClassName('irs-handle from');
    [this.dotTo] = this.element.getElementsByClassName('irs-handle to');

    this.element.getElementsByClassName('irs-line')[0]
      .setAttribute('tabindex', '-2');
    this.dotFrom.setAttribute('tabindex', '0');
    this.dotTo.setAttribute('tabindex', '0');

    if (isDotFocused) {
      if (this.dotFocus === 'from') { this.dotFrom.focus(); }

      if (this.dotFocus === 'to') { this.dotTo.focus(); }
    }

    this._bindEventDot(data);
  }

  _setDomElement() {
    this.valueElement = this.element.querySelector(`${this.className}__value`);
  }

  _createRangeSlider() {
    const setRange = ({ from, to }) => {
      this.valueElement
        .innerText = `${from.toLocaleString()}₽ - ${to.toLocaleString()}₽`;
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
        this._setAttributeDot(data, true);
      },
      onStart: (data) => {
        setRange(data);
        this._setAttributeDot(data);
      },
      onChange: (data) => {
        setRange(data);
      },
    }).data('ionRangeSlider');
  }

  _bindEventDot({
    from, to, min, max,
  }) {
    const handleMovement = (event, flag = false) => {
      const value = flag ? to : from;
      const dotName = flag ? 'to' : 'from';

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        this.$myRange.update({
          [dotName]: value >= min ? value - 50 : value,
        });
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        this.$myRange.update({
          [dotName]: value <= max ? value + 50 : value,
        });
      }
    };

    const handleDotKeydown = (event) => {
      handleMovement(event, true);
    };

    this.dotFrom.addEventListener('focus', this.handleFromFocus);
    this.dotTo.addEventListener('focus', this.handleDotFocus);
    this.dotFrom.addEventListener('keydown', handleMovement);
    this.dotTo.addEventListener('keydown', handleDotKeydown);
  }
}

export default RangeSlider;
