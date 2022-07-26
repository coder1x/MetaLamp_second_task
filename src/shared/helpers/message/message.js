function handleButtonClick(event) {
  event.target.parentElement.remove();
}

function handleButtonKeyDown(event) {
  const { key } = event;
  if (key === 'Escape') {
    event.preventDefault();
    event.target.parentElement.remove();
  }
}

function message(text) {
  const BASE_CLASS = 'message-toxin';

  const popUp = document.querySelector(`.${BASE_CLASS}`);
  if (popUp) {
    return false;
  }

  const wrapper = document.createElement('article');
  wrapper.classList.add(BASE_CLASS);
  const buttonClose = document.createElement('button');
  buttonClose.innerText = '✖';
  buttonClose.classList.add(`${BASE_CLASS}__close`);
  const paragraph = document.createElement('p');
  paragraph.innerText = text;
  paragraph.classList.add(`${BASE_CLASS}__text`);

  wrapper.appendChild(buttonClose);
  wrapper.appendChild(paragraph);

  const bodyElement = document.querySelector('body');
  bodyElement.appendChild(wrapper);

  buttonClose.addEventListener('click', handleButtonClick);
  buttonClose.addEventListener('keydown', handleButtonKeyDown);

  return true;
}

export default message;
