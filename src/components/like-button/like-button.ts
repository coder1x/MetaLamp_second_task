import './like-button.scss';

class likeButton {

  likes: number;
  nameClass: string;
  private likeEl: Element;
  private iconEl: HTMLImageElement;
  private valueEl: HTMLElement;
  private linkEl: HTMLElement;
  private flag: boolean;
  private strKey: string;


  constructor(nameClass: string, elem: Element) {
    this.nameClass = nameClass;
    if (elem instanceof HTMLElement)
      this.strKey = String(elem.offsetLeft + elem.offsetTop);
    this.likeEl = elem;
    this.init();
  }


  getLikes() {
    return Number(this.valueEl.innerText);
  }

  toggleLike() {
    if (this.flag) { // ставили лайк
      this.setLikes(--this.likes, '');
      this.flag = false;
    } else { // не ставили
      this.setLikes(++this.likes);
      this.flag = true;
    }

    this.toggleStyle();
  }

  private init() {
    this.setDom();
    this.likes = this.getLikes() || 0; // получаем начальное значение
    this.flag = Boolean(localStorage.getItem(this.strKey)) || false; // проверяем ставили мы лайк или нет
    this.toggleStyle();
    this.setAction();
  }

  private setDom() {
    this.iconEl = this.likeEl.querySelector(this.nameClass + '__icon');
    this.valueEl = this.likeEl.querySelector(this.nameClass + '__value');
    this.linkEl = this.likeEl.querySelector(this.nameClass + '__like');
  }

  private setLikes(like: number, fl = 'true') {
    this.valueEl.innerText = String(like);
    localStorage.setItem(this.strKey, String(fl));
  }

  private toggleStyle() {
    // меняем стили в зависимости от события
    const name = this.nameClass.replace(/^\.js-/, '') + '_voted';
    if (this.flag) { // ставили лайк
      this.iconEl.src =
        require('@com/like-button/img/favorite.svg').default;
      this.likeEl.classList.add(name);

    } else { // не ставили
      this.iconEl.src =
        require('@com/like-button/img/like.svg').default;
      this.likeEl.classList.remove(name);
    }
  }

  private setAction() {
    this.linkEl.addEventListener('click', () => {
      this.toggleLike();
    });

    this.linkEl.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key == 'Enter' || e.key == ' ') {
        this.toggleLike();
        e.preventDefault();
      }
    });
  }

}



function renderLikeButton(className: string) {
  let components = document.querySelectorAll(className);
  let objMas = [];
  for (let elem of components) {
    objMas.push(new likeButton(className, elem));
  }
  return objMas;
}


renderLikeButton('.js-like-button');