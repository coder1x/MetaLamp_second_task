import autoBind from 'auto-bind';
import './like-button.scss';

const favorite = require('@com/like-button/img/favorite.svg').default;
const like = require('@com/like-button/img/like.svg').default;

class LikeButton {
  likes: number = 0;

  nameClass: string = '';

  private likeEl: Element | null = null;

  private iconEl: HTMLImageElement | null = null;

  private valueEl: HTMLElement | null = null;

  private linkEl: HTMLElement | null = null;

  private flag: boolean = false;

  private strKey: string = '';

  constructor(nameClass: string, elem: Element) {
    autoBind(this);
    this.nameClass = nameClass;
    if (elem instanceof HTMLElement) {
      this.strKey = String(`${elem.offsetLeft}${elem.offsetTop}`);
    }
    this.likeEl = elem;
    this.init();
  }

  getLikes() {
    let number = 0;
    if (this.valueEl) {
      number = Number(this.valueEl.innerText);
    }
    return number;
  }

  toggleLike() {
    if (this.flag) { // ставили лайк
      this.setLikes(this.likes -= 1, '');
      this.flag = false;
    } else { // не ставили
      this.setLikes(this.likes += 1);
      this.flag = true;
    }
    this.toggleStyle();
  }

  private init() {
    this.setDom();
    this.likes = this.getLikes() ?? 0; // получаем начальное значение
    this.flag = Boolean(localStorage.getItem(this.strKey)) ?? false; // проверяем ставили мы лайк или нет
    this.toggleStyle();
    this.setAction();
  }

  private setDom() {
    if (!this.likeEl) return false;
    this.iconEl = this.likeEl.querySelector(`${this.nameClass}__icon`);
    this.valueEl = this.likeEl.querySelector(`${this.nameClass}__value`);
    this.linkEl = this.likeEl.querySelector(`${this.nameClass}__like`);

    return true;
  }

  private setLikes(likeNumber: number, flag = 'true') {
    if (this.valueEl) { this.valueEl.innerText = String(likeNumber); }
    localStorage.setItem(this.strKey, String(flag));
  }

  private toggleStyle() {
    // меняем стили в зависимости от события
    const name = `${this.nameClass.replace(/^\.js-/, '')}_voted`;
    if (this.flag) { // ставили лайк
      if (this.iconEl && this.likeEl) {
        this.iconEl.src = favorite;
        this.likeEl.classList.add(name);
      }
    } else if (this.iconEl && this.likeEl) {
      this.iconEl.src = like;
      this.likeEl.classList.remove(name);
    }
  }

  private handleLinkClick() {
    this.toggleLike();
  }

  private handleLinkKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      this.toggleLike();
      event.preventDefault();
    }
  }

  private setAction() {
    if (!this.linkEl) return false;

    this.linkEl.addEventListener('click', this.handleLinkClick);
    this.linkEl.addEventListener('keydown', this.handleLinkKeydown);

    return true;
  }
}

function renderLikeButton(className: string) {
  const components = document.querySelectorAll(className);
  const objMas: LikeButton[] = [];
  components.forEach((elem) => {
    objMas.push(new LikeButton(className, elem));
  });
  return objMas;
}

renderLikeButton('.js-like-button');
