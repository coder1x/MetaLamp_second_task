import autoBind from 'auto-bind';

class LikeButton {
  constructor(className, element) {
    autoBind(this);
    this.className = className;
    this._stringKey = String(`${element.offsetLeft}${element.offsetTop}`);
    this.element = element;
    this._init();
  }

  getLikes() {
    return Number(this._valueElement.innerText);
  }

  toggleLike() {
    if (this._isLiked) {
      this._setLikes(this.likes -= 1, '');
      this._isLiked = false;
    } else {
      this._setLikes(this.likes += 1);
      this._isLiked = true;
    }
    this._toggleStyle();
  }

  _init() {
    this._setDomElement();
    this.likes = this.getLikes() ?? 0;
    this._isLiked = Boolean(localStorage.getItem(this._stringKey)) ?? false; // проверяем ставили мы лайк или нет
    this._toggleStyle();
    this._bindEvent();
  }

  _getElement(nameElement, parentElement) {
    return (parentElement ?? this.element).querySelector(`${this.className}__${nameElement}`);
  }

  _setDomElement() {
    this._iconElement = this._getElement('icon');
    this._valueElement = this._getElement('value');
    this._linkElement = this._getElement('like');
  }

  _setLikes(likeNumber, isRecord = 'true') {
    this._valueElement.innerText = String(likeNumber);
    localStorage.setItem(this._stringKey, String(isRecord));
  }

  _toggleClass() {
    const className = this.className.replace(/^\.js-/, '');
    const nameVoted = `${className}_voted`;
    const nameFavorite = `${className}__icon_favorite`;

    if (this._isLiked) {
      this._iconElement.classList.add(nameFavorite);
      this.element.classList.add(nameVoted);
    } else {
      this._iconElement.classList.remove(nameFavorite);
      this.element.classList.remove(nameVoted);
    }
  }

  _toggleStyle() {
    if (this._iconElement && this.element) {
      this._toggleClass();
    }
  }

  _handleLikeClick() {
    this.toggleLike();
  }

  _handleLikeKeyDown(event) {
    const isEnter = event.key === 'Enter';
    const isSpace = event.key === ' ';

    if (isEnter || isSpace) {
      this.toggleLike();
      event.preventDefault();
    }
  }

  _bindEvent() {
    this._linkElement.addEventListener('click', this._handleLikeClick);
    this._linkElement.addEventListener('keydown', this._handleLikeKeyDown);
  }
}

export default LikeButton;
