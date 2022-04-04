import autoBind from 'auto-bind';
import './room-card.scss';

class Slider {
  className: string;

  elem: Element;

  private slidesEl: Element[] | null = null;

  private dotEl: Element | null = null;

  private prevEl: HTMLElement | null = null;

  private nextEl: HTMLElement | null = null;

  private indexS: number = 0;

  private indexDot: number = 0;

  private sliderWrap: HTMLElement | null = null;

  private flagSwipe: boolean = false;

  private linkSlide: HTMLElement | null = null;

  private swipe: boolean = false;

  private timeS: number = 0;

  constructor(className: string, elem: Element) {
    autoBind(this);
    this.className = className;
    this.elem = elem;
    this.init();
  }

  getElement(str: string): HTMLElement | null {
    const selector = `${this.className}__${str}-wrap`;
    return this.elem.querySelector(selector);
  }

  setVisible(index: number) {
    const date = Number(new Date());
    const delay = date - this.timeS > 150;

    if (delay && Array.isArray(this.slidesEl)) {
      this.toggle(this.slidesEl[this.indexS], true);
      this.indexS = index;
      this.toggle(this.slidesEl[index]);
      this.paintDot();
    }
  }

  private init() {
    this.setDom();
    this.createDot();
    this.paintDot();
    this.setAction();
    this.setActionSwipe();
  }

  private setDom() {
    const slide = `${this.className}__slide`;
    this.slidesEl = [...this.elem.querySelectorAll(slide)];
    this.dotEl = this.getElement('dot');
    this.prevEl = this.getElement('prev');
    this.nextEl = this.getElement('next');
    this.sliderWrap = this.getElement('slider');
    this.linkSlide = this.elem.querySelector(`${this.className}__link`);
  }

  private toggle(slide: Element, flag = false) {
    const prefix = '__slide_visible';
    const clearName = `${this.className.replace(/^\.js-/, '')}${prefix}`;

    const objClass = slide.classList;

    if (!flag) {
      objClass.add(clearName);
    } else {
      objClass.remove(clearName);
    }
  }

  private paintDot() {
    const dotCl = `${this.className}__dot`;
    let modify = `${dotCl}_paint`;
    modify = modify.replace(/^\.js-/, '');
    const dots = this.elem.querySelectorAll(dotCl);

    let objClass = dots[this.indexDot].classList;
    objClass.remove(modify);

    objClass = dots[this.indexS].classList;
    objClass.add(modify);
    this.indexDot = this.indexS;
  }

  private createDot() {
    const classN = `${this.className.replace(/^\./, '')}__dot`;

    if (Array.isArray(this.slidesEl)) {
      for (let i = 0; i < this.slidesEl.length; i += 1) {
        const dot = document.createElement('span');

        dot.classList.add(classN.replace(/^js-/, ''));
        dot.classList.add(classN);
        dot.setAttribute('data-index', String(i));

        if (this.dotEl) this.dotEl.appendChild(dot);
      }
    }
  }

  private handlePrevClick() {
    if (this.indexS > 0) {
      this.setVisible(this.indexS - 1);
    } else if (Array.isArray(this.slidesEl)) {
      this.setVisible(this.slidesEl.length - 1);
    }
    this.timeS = Number(new Date());
  }

  private handleNextClick() {
    if (!Array.isArray(this.slidesEl)) return false;

    const len = this.slidesEl.length - 1;
    if (this.indexS < len) {
      this.setVisible(this.indexS + 1);
    } else {
      this.setVisible(0);
    }
    this.timeS = Number(new Date());
    return true;
  }

  private handleLinkSlideClick(event: Event) {
    if (this.flagSwipe) {
      event.preventDefault();
    }
    this.flagSwipe = false;
  }

  private handleDotClick(event: Event) {
    const target = event.target as Element;
    const index = Number(target.getAttribute('data-index'));

    if (this.indexS !== index && !Number.isNaN(index)) {
      this.setVisible(index);
    }
  }

  private setAction() {
    if (!this.prevEl || !this.nextEl) return false;

    this.prevEl.addEventListener('click', this.handlePrevClick);
    this.nextEl.addEventListener('click', this.handleNextClick);

    if (!this.linkSlide || !this.dotEl) return false;

    this.linkSlide.addEventListener('click', this.handleLinkSlideClick);
    this.dotEl.addEventListener('click', this.handleDotClick);

    return true;
  }

  private handleLinkSlideFocus() {
    if (this.swipe && this.linkSlide) {
      this.linkSlide.blur();
    }
    this.swipe = false;
  }

  private setActionSwipe() {
    let xyDown: number[] = [];

    if (this.linkSlide) {
      this.linkSlide.addEventListener('focus', this.handleLinkSlideFocus);
    }

    function getCoordinatesXY(event: MouseEvent | TouchEvent): number[] {
      const eventT = event as TouchEvent;
      const eventM = event as MouseEvent;

      if (event.type === 'touchstart' || event.type === 'touchmove') {
        return [eventT.touches[0].clientX, eventT.touches[0].clientY];
      }

      if (event.type === 'mousedown' || event.type === 'mousemove') {
        return [eventM.clientX, eventM.clientY];
      }

      return [];
    }

    const swipe = (xyDiff: number[]) => {
      if (this.nextEl && this.prevEl) {
        if (xyDiff[0] > 0) {
          this.nextEl.click();
        } else {
          this.prevEl.click();
        }
      }
      this.flagSwipe = true;
    };

    const handleSwipeStart = (ev: MouseEvent | TouchEvent) => {
      this.swipe = true;
      xyDown = getCoordinatesXY(ev);
    };

    const handleSwipeMove = (ev: MouseEvent | TouchEvent) => {
      if (!xyDown) {
        return false;
      }

      const eventM = ev;
      const touchmove = ev.type === 'touchmove';
      const mousemove = ev.type === 'mousemove';

      if (eventM instanceof MouseEvent) {
        const event = (touchmove || mousemove) && eventM.buttons === 1;
        if (event) {
          const xyUp: number[] = getCoordinatesXY(ev);

          if (Math.abs((xyUp[0] - xyDown[0])) > 20) {
            const xyDiff = [xyDown[0] - xyUp[0], xyDown[1] - xyUp[1]];
            const date = Number(new Date());
            if (date - this.timeS > 200) { swipe(xyDiff); }
            xyDown = [];
          }
        }
      }
      return true;
    };

    if (this.sliderWrap) {
      this.sliderWrap.addEventListener('touchstart', handleSwipeStart);
      this.sliderWrap.addEventListener('touchmove', handleSwipeMove);
      this.sliderWrap.addEventListener('mousedown', handleSwipeStart);
      this.sliderWrap.addEventListener('mousemove', handleSwipeMove);
    }
  }
}

function renderSlider(className: string) {
  const components = document.querySelectorAll(className);
  const objMas: Slider[] = [];
  components.forEach((elem) => {
    objMas.push(new Slider(className, elem));
  });
  return objMas;
}

renderSlider('.js-room-card');
