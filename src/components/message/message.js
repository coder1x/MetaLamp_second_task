import './message.scss';

function handleClose(event) {
  event.target.parentElement.remove();
}

function handleKeydownClose(event) {
  const { key } = event;
  if (key === 'Escape') {
    event.preventDefault();
    event.target.parentElement.remove();
  }
}

function message(text) {
  const selector = 'message-toxin';

  const popUp = document.querySelector(`.${selector}`);
  if (popUp) return false;

  const wrapper = document.createElement('article');
  wrapper.classList.add(selector);
  const buttonClose = document.createElement('button');
  buttonClose.innerText = '✖';
  buttonClose.classList.add(`${selector}__close`);
  const paragraph = document.createElement('p');
  paragraph.innerText = text;
  paragraph.classList.add(`${selector}__text`);

  wrapper.appendChild(buttonClose);
  wrapper.appendChild(paragraph);

  const bodyElement = document.querySelector('body');
  bodyElement.appendChild(wrapper);

  buttonClose.addEventListener('click', handleClose);
  buttonClose.addEventListener('keydown', handleKeydownClose);

  // buttonClose.focus();

  return true;
}

export default message;
