import './range-slider.scss';

class rangeSlider {

  constructor(className, elem) {

    this.className = className;
    this.elem = elem;
    this.dotFocus = '';

    this.setDomElem();
    this.createRangeSlider();
  }

  setAttrDot(data, fl = false) {
    this.dotFrom = this.elem.getElementsByClassName('irs-handle from')[0];
    this.dotTo = this.elem.getElementsByClassName('irs-handle to')[0];

    this.dotFrom.setAttribute('tabindex', '0');
    this.dotTo.setAttribute('tabindex', '0');

    if (fl) {
      if (this.dotFocus == 'from')
        this.dotFrom.focus();

      if (this.dotFocus == 'to')
        this.dotTo.focus();
    }

    this.setActionsDot(data);
  }

  setActionsDot({ from, to, min, max }) {

    this.dotFrom.addEventListener('focus', () => {
      this.dotFocus = 'from';
    });

    this.dotTo.addEventListener('focus', () => {
      this.dotFocus = 'to';
    });

    const movement = (e, fl = false) => {
      const val = fl ? to : from;
      const name = fl ? 'to' : 'from';
      if (e.key == 'ArrowLeft') {
        e.preventDefault();
        this.$myRange.update({
          [name]: val >= min ? val - 50 : val,
        });

      } else if (e.key == 'ArrowRight') {
        e.preventDefault();
        this.$myRange.update({
          [name]: val <= max ? val + 50 : val,
        });
      }
    };

    this.dotFrom.addEventListener('keydown', (e) => {
      movement(e);
    });

    this.dotTo.addEventListener('keydown', (e) => {
      movement(e, true);
    });
  }

  setDomElem() {
    const classVal = this.className + '__value';
    this.valueEl = this.elem.querySelector(classVal);

  }

  createRangeSlider() {

    const setRange = ({ from, to }) => {
      const numFrom = from.toLocaleString();
      const numTo = to.toLocaleString();
      const range = numFrom + '₽ - ' + numTo + '₽';
      this.valueEl.innerText = range;
    };

    this.$myRange = $('.range-slider__input').ionRangeSlider({
      type: 'double',
      //min: 0,
      step: 1,
      // eslint-disable-next-line camelcase
      hide_min_max: true,
      // eslint-disable-next-line camelcase
      hide_from_to: true,

      onUpdate: (data) => {
        setRange(data);
        this.setAttrDot(data, true);
      },

      onStart: (data) => {
        setRange(data);
        this.setAttrDot(data);
      },

      onChange: (data) => {
        setRange(data);
      }
    }).data('ionRangeSlider');
  }
}

function renderRangeSlider(className) {
  let components = document.querySelectorAll(className);
  let objMas = [];
  for (let elem of components) {
    objMas.push(new rangeSlider(className, elem));
  }
  return objMas;
}


renderRangeSlider('.range-slider');



