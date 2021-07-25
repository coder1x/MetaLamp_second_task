import './like-button.scss';

class likeButton {

	private likeEl: Element;
	private iconEl: HTMLImageElement;
	valueEl: HTMLElement;
	private linkEl: HTMLElement;
	likes: number;
	private flag: boolean;
	private strKey: string;

	// eslint-disable-next-line no-unused-vars
	constructor(public nameClass: string, elem: any) {
		this.strKey = String(elem.offsetLeft + elem.offsetTop);
		this.likeEl = elem;
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

	getLikes() {
		return Number(this.valueEl.innerText);
	}

	private setLikes(like: number, fl = 'true') {
		this.valueEl.innerText = String(like);
		localStorage.setItem(this.strKey, String(fl));
	}

	private toggleStyle() {
		// меняем стили в зависимости от события
		const name = this.nameClass.replace(/^\./, '') + '_voted';
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

	private setAction() {
		this.linkEl.addEventListener('click', () => {
			this.toggleLike();
		});

		this.linkEl.addEventListener('keydown', (e: any) => {
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


renderLikeButton('.like-button');