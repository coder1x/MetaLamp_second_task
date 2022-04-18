import LikeButton from './LikeButton.js';

function renderLikeButton(className) {
  const objMas = [];
  document.querySelectorAll(className).forEach((elem) => {
    objMas.push(new LikeButton(className, elem));
  });
  return objMas;
}

renderLikeButton('.js-like-button');
