import "./like-button.scss";

class likeButton {

	likeEl: Element;
	iconEl: HTMLImageElement;
	valueEl: HTMLElement;
	linkEl: HTMLElement;
	likes: number;
	flag: boolean;

	constructor(public nameClass: string, elem: Element) {

		this.likeEl = elem;
		this.iconEl = this.likeEl.querySelector(nameClass + '__icon');
		this.valueEl = this.likeEl.querySelector(nameClass + '__value');
		this.linkEl = this.likeEl.querySelector(nameClass + '__like');

		this.likes = this.getLikes() || 0; // получаем начальное значение
		this.flag = Boolean(localStorage.getItem('likes')) || false; // проверяем ставили мы лайк или нет

		this.toggleStyle();
		this.setAction();
	}

	getLikes() {
		return Number(this.valueEl.innerText);
	}

	setLikes(like: number, fl = 'true') {
		this.valueEl.innerText = String(like);
		localStorage.setItem('likes', String(fl));
	}

	toggleStyle() {
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

	setAction() {
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