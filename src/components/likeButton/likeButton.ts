class likeButton {

	likeEl: HTMLElement;
	iconEl: HTMLImageElement;
	valueEl: HTMLElement;
	linkEl: HTMLElement;
	likes: number;
	flag: boolean;

	constructor(public nameClass: string) {

		this.likeEl = document.querySelector(nameClass);
		this.iconEl = this.likeEl.querySelector(nameClass + '__icon');
		this.valueEl = this.likeEl.querySelector(nameClass + '__value');
		this.linkEl = this.likeEl.querySelector(nameClass + '__like');

		this.likes = this.getLikes() || 0; // получаем начальное значение
		this.flag = Boolean(localStorage.getItem("likes")) || false; // проверяем ставили мы лайк или нет

		this.toggleStyle();
		this.setAction();
	}

	getLikes() {
		return Number(this.valueEl.innerText);
	}

	setLikes(like: number, fl = 'true') {
		this.valueEl.innerText = String(like);
		localStorage.setItem("likes", String(fl));
	}

	toggleStyle() {
		// меняем стили в зависимости от события
		const name = this.nameClass.replace(/^\./, '') + '__voted';
		if (this.flag) { // ставили лайк
			this.iconEl.src = 'assets/img/inetrface/favorite.svg';
			this.likeEl.classList.add(name);

		} else { // не ставили
			this.iconEl.src = 'assets/img/inetrface/like.svg';
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
		this.linkEl.addEventListener('click', (e) => {
			e.preventDefault();
			this.toggleLike();
		});
	}

}


new likeButton(".likeButton");