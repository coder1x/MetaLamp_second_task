import autoBind from 'auto-bind';

class LikeButton {
  constructor(nameClass, element) {
    autoBind(this);
    this.nameClass = nameClass;
    if (element instanceof HTMLElement) {
      this._stringKey = String(`${element.offsetLeft}${element.offsetTop}`);
    }
    this._likeElement = element;
    this._init();
  }

  getLikes() {
    let number = 0;
    if (this._valueElement) {
      number = Number(this._valueElement.innerText);
    }
    return number;
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

  _setDomElement() {
    if (!this._likeElement) return false;
    this._iconElement = this._likeElement.querySelector(`${this.nameClass}__icon`);
    this._valueElement = this._likeElement.querySelector(`${this.nameClass}__value`);
    this._linkElement = this._likeElement.querySelector(`${this.nameClass}__like`);

    return true;
  }

  _setLikes(likeNumber, isRecord = 'true') {
    if (this._valueElement) {
      this._valueElement.innerText = String(likeNumber);
    }
    localStorage.setItem(this._stringKey, String(isRecord));
  }

  _toggleStyle() {
    const selector = this.nameClass.replace(/^\.js-/, '');
    const nameVoted = `${selector}_voted`;
    const nameFavorite = `${selector}__icon_favorite`;

    const toggleClass = () => {
      if (this._isLiked) {
        this._iconElement.classList.add(nameFavorite);
        this._likeElement.classList.add(nameVoted);
      } else {
        this._iconElement.classList.remove(nameFavorite);
        this._likeElement.classList.remove(nameVoted);
      }
    };

    if (this._iconElement && this._likeElement) {
      toggleClass();
    }
  }

  _handleLinkClick() {
    this.toggleLike();
  }

  _handleLinkKeydown(event) {
    const isEnter = event.key === 'Enter';
    const isSpace = event.key === ' ';

    if (isEnter || isSpace) {
      this.toggleLike();
      event.preventDefault();
    }
  }

  _bindEvent() {
    if (!this._linkElement) return false;

    this._linkElement.addEventListener('click', this._handleLinkClick);
    this._linkElement.addEventListener('keydown', this._handleLinkKeydown);

    return true;
  }
}

export default LikeButton;
