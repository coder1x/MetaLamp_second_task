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
    const TIME = 150;
    const delay = new Date().getTime() - this._timePress > TIME;

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

  _getElements(nameElement, parentElement) {
    return [
      ...(parentElement ?? this.element).querySelectorAll(`${this.className}__${nameElement}`),
    ];
  }

  _getElement(nameElement, parentElement) {
    return (parentElement ?? this.element).querySelector(`${this.className}__${nameElement}`);
  }

  _setDomElement() {
    this._slidesElement = this._getElements('slide');
    this._dotElement = this._getElement('dot-wrapper');
    this._prevElement = this._getElement('prev-wrapper');
    this._nextElement = this._getElement('next-wrapper');
    this._sliderWrap = this._getElement('slider-wrapper');
    this._linkSlide = this._getElement('link');
  }

  _toggle(slide, isVisible = false) {
    const slideVisibleClassName = `${this.className.replace(/^\.js-/, '')}__slide_visible`;

    const { classList } = slide;

    if (!isVisible) {
      classList.add(slideVisibleClassName);
    } else {
      classList.remove(slideVisibleClassName);
    }
  }

  _paintDot() {
    const dotSelector = `${this.className}__dot`;
    let modifier = `${dotSelector}_paint`;
    modifier = modifier.replace(/^\.js-/, '');
    const dots = this.element.querySelectorAll(dotSelector);
    dots[this._indexDot].classList.remove(modifier);
    dots[this._indexSlide].classList.add(modifier);

    this._indexDot = this._indexSlide;
  }

  _createDot() {
    const dotSelector = `${this.className.replace(/^\./, '')}__dot`;

    if (!Array.isArray(this._slidesElement)) {
      return false;
    }
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < this._slidesElement.length; i += 1) {
      const dot = document.createElement('span');

      dot.classList.add(dotSelector.replace(/^js-/, ''));
      dot.classList.add(dotSelector);
      dot.setAttribute('data-index', String(i));

      fragment.appendChild(dot);
    }

    this._dotElement.appendChild(fragment);

    return true;
  }

  _handlePrevClick() {
    if (this._indexSlide > 0) {
      this.setVisible(this._indexSlide - 1);
    } else if (Array.isArray(this._slidesElement)) {
      this.setVisible(this._slidesElement.length - 1);
    }
    this._timePress = new Date().getTime();
  }

  _handleNextClick() {
    if (!Array.isArray(this._slidesElement)) {
      return false;
    }

    const length = this._slidesElement.length - 1;
    if (this._indexSlide < length) {
      this.setVisible(this._indexSlide + 1);
    } else {
      this.setVisible(0);
    }
    this._timePress = new Date().getTime();
    return true;
  }

  _handleLinkClick(event) {
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
    if (!this._prevElement || !this._nextElement) {
      return false;
    }

    this._prevElement.addEventListener('click', this._handlePrevClick);
    this._nextElement.addEventListener('click', this._handleNextClick);

    if (!this._linkSlide || !this._dotElement) {
      return false;
    }

    this._linkSlide.addEventListener('click', this._handleLinkClick);
    this._dotElement.addEventListener('click', this._handleDotClick);

    return true;
  }

  static _getCoordinatesXY(event) {
    const isTouchStart = event.type === 'touchstart';
    const isTouchMove = event.type === 'touchmove';

    if (isTouchStart || isTouchMove) {
      return [event.touches[0].clientX, event.touches[0].clientY];
    }

    const isMouseDown = event.type === 'mousedown';
    const isMouseMove = event.type === 'mousemove';

    if (isMouseDown || isMouseMove) {
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

  _handleLinkFocus() {
    if (this._isSwipe) {
      this._linkSlide.blur();
    }
    this._isSwipe = false;
  }

  _bindEventSwipe() {
    let xyDown = [];
    this._linkSlide.addEventListener('focus', this._handleLinkFocus);

    const handleSliderTouchStartMouseDown = (event) => {
      this._isSwipe = true;
      xyDown = Slider._getCoordinatesXY(event);
    };

    const handleSliderTouchMoveMouseMove = (event) => {
      if (!xyDown) {
        return false;
      }

      const isTouchMove = event.type === 'touchmove';
      const isButtonPressed = event.buttons === 1;
      const isMouseMove = event.type === 'mousemove' && isButtonPressed;

      if (!isTouchMove && !isMouseMove) {
        return false;
      }

      const TIME = 200;
      const SHIFT = 20;
      const xyUp = Slider._getCoordinatesXY(event);
      const isShift = Math.abs((xyUp[0] - xyDown[0])) > SHIFT;
      const isTimeInterval = (new Date().getTime() - this._timePress) > TIME;

      if (isShift && isTimeInterval) {
        this._swipeDirection([
          xyDown[0] - xyUp[0],
          xyDown[1] - xyUp[1],
        ]);
        xyDown = [];
      }

      return true;
    };

    this._sliderWrap.addEventListener('touchstart', handleSliderTouchStartMouseDown);
    this._sliderWrap.addEventListener('touchmove', handleSliderTouchMoveMouseMove);
    this._sliderWrap.addEventListener('mousedown', handleSliderTouchStartMouseDown);
    this._sliderWrap.addEventListener('mousemove', handleSliderTouchMoveMouseMove);
  }
}

export default Slider;
