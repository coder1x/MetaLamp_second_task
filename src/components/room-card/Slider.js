import autoBind from 'auto-bind';
import './room-card.scss';

class Slider {
  constructor(className, elem) {
    autoBind(this);
    this.className = className;
    this.elem = elem;
    this._init();
  }

  getElement(str) {
    return this.elem.querySelector(`${this.className}__${str}-wrap`);
  }

  setVisible(index) {
    const delay = Number(new Date()) - this._timeS > 150;

    if (delay && Array.isArray(this._slidesEl)) {
      this._toggle(this._slidesEl[this._indexS], true);
      this._indexS = index;
      this._toggle(this._slidesEl[index]);
      this._paintDot();
    }
  }

  _init() {
    this._indexS = 0;
    this._indexDot = 0;
    this._flagSwipe = false;
    this._swipe = false;
    this._timeS = 0;

    this._setDom();
    this._createDot();
    this._paintDot();
    this._setAction();
    this._setActionSwipe();
  }

  _setDom() {
    this._slidesEl = [
      ...this.elem.querySelectorAll(`${this.className}__slide`),
    ];
    this._dotEl = this.getElement('dot');
    this._prevEl = this.getElement('prev');
    this._nextEl = this.getElement('next');
    this._sliderWrap = this.getElement('slider');
    this._linkSlide = this.elem.querySelector(`${this.className}__link`);
  }

  _toggle(slide, flag = false) {
    const prefix = '__slide_visible';
    const clearName = `${this.className.replace(/^\.js-/, '')}${prefix}`;

    const { classList } = slide;

    if (!flag) {
      classList.add(clearName);
    } else {
      classList.remove(clearName);
    }
  }

  _paintDot() {
    const dotSelector = `${this.className}__dot`;
    let modifier = `${dotSelector}_paint`;
    modifier = modifier.replace(/^\.js-/, '');
    const dots = this.elem.querySelectorAll(dotSelector);

    let objClass = dots[this._indexDot].classList;
    objClass.remove(modifier);

    objClass = dots[this._indexS].classList;
    objClass.add(modifier);
    this._indexDot = this._indexS;
  }

  _createDot() {
    const dotSelector = `${this.className.replace(/^\./, '')}__dot`;

    if (Array.isArray(this._slidesEl)) {
      for (let i = 0; i < this._slidesEl.length; i += 1) {
        const dot = document.createElement('span');

        dot.classList.add(dotSelector.replace(/^js-/, ''));
        dot.classList.add(dotSelector);
        dot.setAttribute('data-index', String(i));

        if (this._dotEl) this._dotEl.appendChild(dot);
      }
    }
  }

  _handlePrevClick() {
    if (this._indexS > 0) {
      this.setVisible(this._indexS - 1);
    } else if (Array.isArray(this._slidesEl)) {
      this.setVisible(this._slidesEl.length - 1);
    }
    this._timeS = Number(new Date());
  }

  _handleNextClick() {
    if (!Array.isArray(this._slidesEl)) return false;

    const length = this._slidesEl.length - 1;
    if (this._indexS < length) {
      this.setVisible(this._indexS + 1);
    } else {
      this.setVisible(0);
    }
    this._timeS = Number(new Date());
    return true;
  }

  _handleLinkSlideClick(event) {
    if (this._flagSwipe) {
      event.preventDefault();
    }
    this._flagSwipe = false;
  }

  _handleDotClick(event) {
    const { target } = event;
    const index = Number(target.getAttribute('data-index'));

    if (this._indexS !== index && !Number.isNaN(index)) {
      this.setVisible(index);
    }
  }

  _setAction() {
    if (!this._prevEl || !this._nextEl) return false;

    this._prevEl.addEventListener('click', this._handlePrevClick);
    this._nextEl.addEventListener('click', this._handleNextClick);

    if (!this._linkSlide || !this._dotEl) return false;

    this._linkSlide.addEventListener('click', this._handleLinkSlideClick);
    this._dotEl.addEventListener('click', this._handleDotClick);

    return true;
  }

  static _getCoordinatesXY(ev) {
    const eventT = ev;
    const eventM = ev;

    if (eventT instanceof TouchEvent) {
      if (ev.type === 'touchstart' || ev.type === 'touchmove') {
        return [eventT.touches[0].clientX, eventT.touches[0].clientY];
      }
    }

    if (eventM instanceof MouseEvent) {
      if (ev.type === 'mousedown' || ev.type === 'mousemove') {
        return [eventM.clientX, eventM.clientY];
      }
    }

    return [];
  }

  _swipeMove(xyDiff) {
    if (xyDiff[0] > 0) {
      this._nextEl.click();
    } else {
      this._prevEl.click();
    }
    this._flagSwipe = true;
  }

  _setActionSwipe() {
    let xyDown = [];
    this._linkSlide.addEventListener('focus', () => {
      if (this._swipe) {
        this._linkSlide.blur();
      }
      this._swipe = false;
    });

    const handleSwipeStart = (event) => {
      this._swipe = true;
      xyDown = Slider._getCoordinatesXY(event);
    };

    const handleSwipeMove = (ev) => {
      if (!xyDown) {
        return;
      }

      const touchmove = ev.type === 'touchmove';
      const mousemove = ev.type === 'mousemove';

      if (touchmove || (mousemove && ev.buttons === 1)) {
        const xyUp = Slider._getCoordinatesXY(ev);

        if (Math.abs((xyUp[0] - xyDown[0])) > 20) {
          if (Number(new Date()) - this._timeS > 200) {
            this._swipeMove([
              xyDown[0] - xyUp[0],
              xyDown[1] - xyUp[1],
            ]);
          }
          xyDown = [];
        }
      }
    };

    this._sliderWrap.addEventListener('touchstart', handleSwipeStart);
    this._sliderWrap.addEventListener('touchmove', handleSwipeMove);
    this._sliderWrap.addEventListener('mousedown', handleSwipeStart);
    this._sliderWrap.addEventListener('mousemove', handleSwipeMove);
  }
}

export default Slider;
