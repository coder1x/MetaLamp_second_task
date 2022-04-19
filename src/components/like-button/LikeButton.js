import autoBind from 'auto-bind';
import './like-button.scss';

class LikeButton {
  constructor(nameClass, elem) {
    autoBind(this);
    this.nameClass = nameClass;
    if (elem instanceof HTMLElement) {
      this._strKey = String(`${elem.offsetLeft}${elem.offsetTop}`);
    }
    this._likeEl = elem;
    this._init();
  }

  getLikes() {
    let number = 0;
    if (this._valueEl) {
      number = Number(this._valueEl.innerText);
    }
    return number;
  }

  toggleLike() {
    if (this._flag) { // ставили лайк
      this._setLikes(this.likes -= 1, '');
      this._flag = false;
    } else { // не ставили
      this._setLikes(this.likes += 1);
      this._flag = true;
    }
    this._toggleStyle();
  }

  _init() {
    this._setDom();
    this.likes = this.getLikes() ?? 0; // получаем начальное значение
    this._flag = Boolean(localStorage.getItem(this._strKey)) ?? false; // проверяем ставили мы лайк или нет
    this._toggleStyle();
    this._setAction();
  }

  _setDom() {
    if (!this._likeEl) return false;
    this._iconEl = this._likeEl.querySelector(`${this.nameClass}__icon`);
    this._valueEl = this._likeEl.querySelector(`${this.nameClass}__value`);
    this._linkEl = this._likeEl.querySelector(`${this.nameClass}__like`);

    return true;
  }

  _setLikes(likeNumber, flag = 'true') {
    if (this._valueEl) { this._valueEl.innerText = String(likeNumber); }
    localStorage.setItem(this._strKey, String(flag));
  }

  _toggleStyle() {
    const selector = this.nameClass.replace(/^\.js-/, '');
    const name = `${selector}_voted`;
    const favorite = `${selector}__icon_favorite`;

    if (this._flag) {
      if (this._iconEl && this._likeEl) {
        this._iconEl.classList.add(favorite);
        this._likeEl.classList.add(name);
      }
    } else if (this._iconEl && this._likeEl) {
      this._iconEl.classList.remove(favorite);
      this._likeEl.classList.remove(name);
    }
  }

  _handleLinkClick() {
    this.toggleLike();
  }

  _handleLinkKeydown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      this.toggleLike();
      event.preventDefault();
    }
  }

  _setAction() {
    if (!this._linkEl) return false;

    this._linkEl.addEventListener('click', this._handleLinkClick);
    this._linkEl.addEventListener('keydown', this._handleLinkKeydown);

    return true;
  }
}

export default LikeButton;
