import autoBind from 'auto-bind';

class Slider {
  constructor(className, element) {
    autoBind(this);
    this.className = className;
    this.element = element;
    this._init();
  }

  getElement(string) {
    return this.element.querySelector(`${this.className}__${string}-wrapper`);
  }

  setVisible(index) {
    const delay = Number(new Date()) - this._timePress > 150;

    if (delay && Array.isArray(this._slidesElement)) {
      this._toggle(this._slidesElement[this._indexSlide], true);
      this._indexSlide = index;
      this._toggle(this._slidesElement[index]);
      this._paintDot();
    }
  }

  _init() {
    this._indexSlide = 0;
    this._indexDot = 0;
    this._isSwipedMove = false;
    this._isSwipe = false;
    this._timePress = 0;

    this._setDomElement();
    this._createDot();
    this._paintDot();
    this._bindEvent();
    this._bindEventSwipe();
  }

  _setDomElement() {
    this._slidesElement = [
      ...this.element.querySelectorAll(`${this.className}__slide`),
    ];
    this._dotElement = this.getElement('dot');
    this._prevElement = this.getElement('prev');
    this._nextElement = this.getElement('next');
    this._sliderWrap = this.getElement('slider');
    this._linkSlide = this.element.querySelector(`${this.className}__link`);
  }

  _toggle(slide, isVisible = false) {
    const prefix = '__slide_visible';
    const selector = `${this.className.replace(/^\.js-/, '')}${prefix}`;

    const { classList } = slide;

    if (!isVisible) {
      classList.add(selector);
    } else {
      classList.remove(selector);
    }
  }

  _paintDot() {
    const dotSelector = `${this.className}__dot`;
    let modifier = `${dotSelector}_paint`;
    modifier = modifier.replace(/^\.js-/, '');
    const dots = this.element.querySelectorAll(dotSelector);

    let classListDot = dots[this._indexDot].classList;
    classListDot.remove(modifier);

    classListDot = dots[this._indexSlide].classList;
    classListDot.add(modifier);
    this._indexDot = this._indexSlide;
  }

  _createDot() {
    const dotSelector = `${this.className.replace(/^\./, '')}__dot`;

    if (Array.isArray(this._slidesElement)) {
      for (let i = 0; i < this._slidesElement.length; i += 1) {
        const dot = document.createElement('span');

        dot.classList.add(dotSelector.replace(/^js-/, ''));
        dot.classList.add(dotSelector);
        dot.setAttribute('data-index', String(i));

        if (this._dotElement) this._dotElement.appendChild(dot);
      }
    }
  }

  _handlePrevClick() {
    if (this._indexSlide > 0) {
      this.setVisible(this._indexSlide - 1);
    } else if (Array.isArray(this._slidesElement)) {
      this.setVisible(this._slidesElement.length - 1);
    }
    this._timePress = Number(new Date());
  }

  _handleNextClick() {
    if (!Array.isArray(this._slidesElement)) return false;

    const length = this._slidesElement.length - 1;
    if (this._indexSlide < length) {
      this.setVisible(this._indexSlide + 1);
    } else {
      this.setVisible(0);
    }
    this._timePress = Number(new Date());
    return true;
  }

  _handleLinkSlideClick(event) {
    if (this._isSwipedMove) {
      event.preventDefault();
    }
    this._isSwipedMove = false;
  }

  _handleDotClick(event) {
    const { target } = event;
    const index = Number(target.getAttribute('data-index'));

    if (this._indexSlide !== index && !Number.isNaN(index)) {
      this.setVisible(index);
    }
  }

  _bindEvent() {
    if (!this._prevElement || !this._nextElement) return false;

    this._prevElement.addEventListener('click', this._handlePrevClick);
    this._nextElement.addEventListener('click', this._handleNextClick);

    if (!this._linkSlide || !this._dotElement) return false;

    this._linkSlide.addEventListener('click', this._handleLinkSlideClick);
    this._dotElement.addEventListener('click', this._handleDotClick);

    return true;
  }

  static _getCoordinatesXY(event) {
    if (event.type === 'touchstart' || event.type === 'touchmove') {
      return [event.touches[0].clientX, event.touches[0].clientY];
    }

    if (event.type === 'mousedown' || event.type === 'mousemove') {
      return [event.clientX, event.clientY];
    }
    return [];
  }

  _swipeDirection(deltaXY) {
    if (deltaXY[0] > 0) {
      this._nextElement.click();
    } else {
      this._prevElement.click();
    }
    this._isSwipedMove = true;
  }

  _bindEventSwipe() {
    let xyDown = [];
    this._linkSlide.addEventListener('focus', () => {
      if (this._isSwipe) {
        this._linkSlide.blur();
      }
      this._isSwipe = false;
    });

    const handleSwipeStart = (event) => {
      this._isSwipe = true;
      xyDown = Slider._getCoordinatesXY(event);
    };

    const handleSwipeMove = (event) => {
      if (!xyDown) {
        return;
      }

      const touchmove = event.type === 'touchmove';
      const mousemove = event.type === 'mousemove';

      if (touchmove || (mousemove && event.buttons === 1)) {
        const xyUp = Slider._getCoordinatesXY(event);

        const isShift = Math.abs((xyUp[0] - xyDown[0])) > 20;
        const isTimeInterval = (Number(new Date()) - this._timePress) > 200;

        if (isShift && isTimeInterval) {
          this._swipeDirection([
            xyDown[0] - xyUp[0],
            xyDown[1] - xyUp[1],
          ]);
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
