import './checkbox-list.scss';

interface optE {
  str: string,
  fl?: boolean,
  dom?: Element
}

class CheckBoxList {

  className: string;
  elem: Element;
  private wrap: HTMLElement;
  private headerEl: HTMLElement;
  private imgEl: HTMLElement;
  private keyF: boolean;

  constructor(className: string, elem: Element) {
    this.className = className;
    this.elem = elem;
    this.init();
  }

  init() {
    this.keyF = false;
    this.setDomElem();
    this.setActions();
  }

  toggleVis() {
    let display = window.getComputedStyle(this.wrap, null)
      .getPropertyValue('display');
    const flag = display == 'block' ? false : true;

    this.toggleModify(this.elem, '_visible', flag);
  }

  private getElem(param: optE) {
    let elem: HTMLElement[] | Element;
    let dom = param.dom ?? this.elem;
    let name = this.className + param.str;
    if (param.fl) {
      elem = [...dom.querySelectorAll<HTMLElement>(name)];
    }
    else {
      elem = dom.querySelector(name);
    }
    return elem;
  }

  private setDomElem() {
    this.wrap = (this.getElem({ str: '__wrap' }) as HTMLElement);
    this.headerEl = (this.getElem({ str: '__header' }) as HTMLElement);
    this.imgEl = (this.getElem({ str: '__tip' }) as HTMLElement);
  }

  private toggleModify(elem: Element, modify: string, flag = false) {
    let clearName = this.className.replace(/^\./, '') + modify;
    let objClass = elem.classList;
    flag ? objClass.add(clearName) : objClass.remove(clearName);
  }

  private setActions() {

    if (this.imgEl) {
      this.headerEl.addEventListener('click', () => {
        console.log('headerEl');
        this.toggleVis();
      });

      this.headerEl.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.key == 'Enter' || e.key == ' ') {
          e.preventDefault();
          this.toggleVis();
        } else if (e.key == 'Escape') {
          e.preventDefault();
          this.toggleModify(this.elem, '_visible', false);
        }
      });
    }
  }
}



function renderCheckboxList(className: string) {
  let components = document.querySelectorAll(className);
  let objMas = [];
  for (let elem of components) {
    objMas.push(new CheckBoxList(className, elem));
  }
  return objMas;
}


renderCheckboxList('.checkbox-list');



